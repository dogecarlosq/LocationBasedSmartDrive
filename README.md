# Location-Based Smart Drive Solution

## Overview
The Location-Based Smart Drive Solution is an IoT-driven file management system that offers an intelligent, context-aware platform for uploading and organizing files based on real-time geographic location. Users can upload files via an intuitive drag-and-drop interface, and the system automatically categorizes files into location-specific folders . When a new location is detected or if the city cannot be determined automatically, the system dynamically creates a folder or prompts the user for clarification.

project/
├── README.md      # Overview, objectives, and usage instructions.
├── src/  
│   ├──index            # The folder for HTML file
│   └── server     # js file for backend server service
├── uploads      # the folders for different locations
├── views              # ejs file
├── tests/              # test cases
│   └── usage.md          # Documentation and user guides.

## Features
- **User-Friendly Interface:**  
  Responsive design with drag-and-drop functionality for file uploads.
- **Automatic Location-Based Organization:**  
  Files are sorted into folders based on the user's current city derived from IP geolocation.
- **Dynamic Folder Creation:**  
  New locations trigger automatic folder creation.
- **Secure User Authentication:**  
  Login system with session management to protect user data.
- **Robust Backend:**  
  Server-side logic implemented with Node.js and Express.js.
- **Lightweight Database:**  
  SQLite3 is used for efficient data storage and retrieval.
- **Geolocation Integration:**  
  Uses the ipinfo.io API for accurate location detection.

## System Architecture
The solution is designed following the IoT 4-layer model:
- **Integrated Applications Layer (Frontend):**  
  User interface built with HTML, CSS, and JavaScript for login and file management.
- **Information Processing Layer (Database):**  
  SQLite database handling user and file data.
- **Network Infrastructure Layer (Backend):**  
  Node.js/Express.js server manages HTTP requests, file uploads, and geolocation services.
- **Sensing and Identification Layer:**  
  Geolocation via ipinfo.io API to determine user location.

### Workflow
1. **User Authentication:**  
   Users log in via a dedicated login page. Credentials are verified and sessions are managed with cookies.
2. **File Upload:**  
   - The drag-and-drop interface allows users to upload files.
   - The server retrieves the user's current city using the ipinfo.io API.
   - Files are stored in city-specific folders; if a new location is detected, a new folder is created.
3. **Viewing Uploaded Files:**  
   Users can view their uploaded files via an interface that retrieves data from the database.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **File Upload:** Multer middleware
- **Database:** SQLite3
- **Geolocation:** ipinfo.io API
- **Security:** HTTPS/TLS, express-session for session management

## Installation and Setup
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd project-directory
