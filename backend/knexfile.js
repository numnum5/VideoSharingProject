require('dotenv').config();
const getSecret = require('./helper/secretes')
module.exports = async () => {
	// Get secret username and password for RDS
    const secretName = process.env.RDS_SCRETE_NAME; 
    const secret = await getSecret(secretName);
    const secretJson = JSON.parse(secret);
    return {
        client: 'mysql2',
        connection: {
            host: process.env.RDS_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: secretJson.username,
            password: secretJson.password,
        },
    };
};