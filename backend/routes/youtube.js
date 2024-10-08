// Route for handling youtube related requests
const express = require('express');
const router = express.Router();
const axios = require('axios')
const path = require('path');
const authorisation = require("../middleware/authorisation");
const getSecret = require("../helper/secretes");
const {get, set} = require('../helper/cache');
const getParameter = require("../helper/parameterStore")
require('dotenv').config();

// Endpoint for saving video to users' video list
router.post('/save', authorisation, async function(req, res, next){

    // Get video and playlist id
    const videoId = req.body.videoId;
    const playlist_id = req.body.playlist_id || '';

    if(!videoId){
      res.status(400).json({ error : true, message : "Video id required in body"});
      return;
    }

    // Create video url
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    try {

        // Get username from req
        const username = req.currentUser.username;
        // Save video
        const response = await saveYoutubeVideo(videoUrl, req.db, username, playlist_id);
        res.status(200).json({ message: 'Video saved successfully', file: response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  
});

// Endpoint for querying youtube DATA API
router.get('/search', async function(req, res, next){

    const query = req.query.q;
    // Set default limit to 16
    const limit = parseInt(req.query.maxResults, 10) || 16;
    const pageToken = req.query.pageToken || ''; 
    const cacheKey = `youtube:${query}:${limit}:${pageToken}`;
    // Check to see if cache exists for the key
    try{
        const value = await get(cacheKey);
        if (value) {
            res.status(200).json(value);
            return;
        }
    }
    catch(error){
        res.status(500).json({error : true, message : error.message});
        return;
    }    

    const secret_name = "n11736062-assignment2-YoutTube";

    let YoutubeKey;
    let YoutubeBase;

    try{
        const response = await getSecret(secret_name);
        const json = await JSON.parse(response);
        const baseUrl = await getParameter("/n11736062/YoutubeBASE");
        YoutubeKey = json.YouTubeKey;
        YoutubeBase = baseUrl;
    }catch(error){
        res.status(500).json({error : true, message : "Error occured while accessing API."});
        return;
    }
    
    // If query is null 
    if(!query){
        res.status(400).json({error : true, message : "keyword required for search."});
        return;
    }

    // Use axios to fetch data from youtube API
    axios.get(YoutubeBase, {
        params: {
            part:'snippet',
            q: query, 
            type: 'video', 
            key: YoutubeKey, 
            maxResults: limit,
            pageToken: pageToken
        }
    })
    .then(async(response) => {
        const result = {
            items: response.data.items,
            nextPageToken: response.data.nextPageToken,
            prevPageToken: response.data.prevPageToken
        };

        // cache results
        try{
            await set(cacheKey, result, 200);
        }
        catch(error){
            res.status(500).json({error : true, message : error.message});
            return;
        }  
        // Send the search results back to the client
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({error : true, message : err.message});
    })
});

module.exports = router;