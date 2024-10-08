Assignment 1 - Web Server - Response to Criteria
================================================

Instructions
------------------------------------------------
- Keep this file named A2_response_to_criteria.md, do not change the name
- Upload this file along with your code in the root directory of your project
- Upload this file in the current Markdown format (.md extension)
- Do not delete or rearrange sections.  If you did not attempt a criterion, leave it blank
- Text inside [ ] like [eg. S3 ] are examples and should be removed


Overview
------------------------------------------------

- **Name:** Junseo Pyun
- **Student number:** n11736062
- **Partner name (if applicable):** None
- **Application name:** VideoSharingApp
- **Two line description:** Application that allows users to view, edit and interact with videos uploaded from other users
- **EC2 instance name or ID:** i-09a17a2fb025e3969

Core criteria
------------------------------------------------

### Core - First data persistence service

- **AWS service name:**  S3 blob storage
- **What data is being stored?:** Video files and images (thumbnails)
- **Why is this service suited to this data?:** 
Large unstructured files like images and videos are best approperiate for blob storage with no size restrictions as well as high scalability. 
- **Why is are the other services used not suitable for this data?:** RDS is used to store structured data and is not suited for large file sizes and other services like EBS is utilised with an EC2 instance directly and S3 can be accessed globally through https which supports separation of concern.
- **Bucket/instance/table name:**
n11736062-test
- **Video timestamp:** 0:00 ~ 0:53 
- **Relevant files:** 
    - backend/routes/videos.js (Upload post endpoint)

### Core - Second data persistence service

- **AWS service name:**  RDS MySQL
- **What data is being stored?:** 
Structued data with no ACID requirements like video metadata, playlists, comments, and other information related to interacting with videos
- **Why is this service suited to this data?:**
The data mentioned above require fast querying and retrieval, and my
- **Why is are the other services used not suitable for this data?:**
S3 is designed for object storage and would not efficiently manage relational queries or structured datasets like video metadata, playlists, and comments and DynanoDB is also inefficient compared to RDS
- **Video timestamp:** 0:57 ~ 1:21
- **Relevant files:**
    - backend/knexfile.js
    - backend/routes

### Third data service

- **AWS service name:** 
- **What data is being stored?:** 
- **Why is this service suited to this data?:** 
- **Why is are the other services used not suitable for this data?:** 
- **Video timestamp:**
- **Relevant files:**
    -

### S3 Pre-signed URLs

- **S3 Bucket names:** n11736062-test
- **Video timestamp:** 1:22 ~ 2:00
- **Relevant files:**
    - backend/routes/videos.js (generateDownloadURL function and /upload endpoint)

### In-memory cache

- **ElastiCache instance name:** n11736062-assignment2
- **What data is being cached?:** Youtube API requests like thumbnails, titles of videos are cached, additionally requests to RDS instance, especially when making requests to fetching video data, comments, and playlsits are cached as well which are requested very frequently in the application.
- **Why is this data likely to be accessed frequently?:** 
The application revolves around viewing and interacting with videos, hence, videos metadata and comments are frequently fetched and accessed by the users. Additionally, Youtube videos are also likely to be search frequently with common keywords, thus, it is efficent to have the results cached.
- **Video timestamp:** 2:02 ~ 3:40
- **Relevant files:**
    - backend/helper/cache.js
    - backend/routes/youtube.js (/seach get endpoint)
    - backend/routes/videos.js (/videos get endpoint and video get endpoint)
    - backend/routes/comments.js (/comments/:id get endpoint and video get endpoint)
    - backend/routes/playlists.js (/:username get endpoint and video get endpoint)

### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?:** 
Intermediary video downloaded from S3 before transconding and transcoded videos which are both stored temporarily on the server
- **Why is this data not considered persistent state?:** 
Temporary/Intermediary video files cannot be restored if the server goes down
- **How does your application ensure data consistency if the app suddenly stops?:** My application does not make updates/new entries to the table until the video is fully processed and if the user decides to save the edited version (by pressing the save button only appears after the process reaches 100% completion) in which case the database gets updated. Due to this, when app suddenly stops, error message will appear in the client side in which user can restart the process. Additionally, because of this flow, only uses journal to check for objects with no associated metadata which are deleted.
- **Relevant files:**
    - backend/app.js (checkIncompleteJournals)

### Graceful handling of persistent connections

- **Type of persistent connection and use:** 
Socket connection for progress reporting on the server side.
- **Method for handling lost connections:** 
Client attempts to reconnect to the server indefinitely, and displays approperiate error message on the client side when server disconnects/goes down
- **Relevant files:**
    - frontend/src/pages/transcode.jsx (Edit function component)

### Core - Authentication with Cognito

- **User pool name:** n11736062-assignment2 
- **How are authentication tokens handled by the client?:** 
Retrieves token from cognito using SDK with given credentials, then any requests that require authorisation, the Cognito token is sent to the server for verification.
- **Video timestamp:** 3:47 ~ 5:05
- **Relevant files:** 
    - frontend/src/pages/awsSDK.jsx
    - frontend/src/pages/login.jsx
    - frontend/src/pages/confirmUserRegister.jsx
    - backend/middleware/authorisation.js

### Cognito multi-factor authentication

- **What factors are used for authentication:** Authenticator App Passcode
- **Video timestamp:** 5:11 ~ 5:35
- **Relevant files:**
    - frontend/src/pages/setUp.jsx
    - frontend/src/pages/awsSDK.jsx
    - frontend/src/pages/login.jsx

### Cognito federated identities

- **Identity providers used:** Google (The functionality had to be tested on localhost as HTTPS was not setup)
- **Video timestamp:** 5:37 ~ 5:55
- **Relevant files:**   
    - frontend/src/pages/Google.jsx
    

### Cognito groups

- **How are groups used to set permissions?:** Admin group can view details of all users, and they can delete users' video and delete the users.
- **Video timestamp:** 5:59 ~ 7:26
- **Relevant files:**
    - frontend/src/pages/editUsers.jsx
    - backend/middleware/authorisation.js

### Core - DNS with Route53

- **Subdomain**:  n11736062.at2.cab432.com
- **Video timestamp:** 7:27 ~ 7:59


### Custom security groups

- **Security group names:** 
n11736062-assignment2-ec2, n11736062-assignment2-rdsv2, n11736062-assignment2-memcache
- **Services/instances using security groups:**
EC2, memcache cluster, and RDS
- **Video timestamp:** 8:01 ~ 9:10
- **Relevant files:**
    - None

### Parameter store

- **Parameter names:** n11736062/YoutubeBASE and n11736062/BaseAPI
- **Video timestamp:** 9:13 ~ 9:45
- **Relevant files:**
    - backend/routes/youtube.js (/search get endpoint)
    - backend/helper/parameterStore.js
    - backend/app.js

### Secrets manager

- **Secrets names:** n11736062-assignment2-YouTube, rds!db-630e84e9-054e-49f9-837e-5ebca604208e
- **Video timestamp:** 9:46 ~ end
- **Relevant files:**
    - backend/routes/youtube.js (/search get endpoint)
    - backend/helper/secretes.js
    - backend/knexfile.js

### Infrastructure as code

- **Technology used:**
- **Services deployed:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior approval only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior permission only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -