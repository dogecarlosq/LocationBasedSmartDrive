# LocationBasedSmartDrive
An IoT-driven solution that intelligently organizes files based on real-time location data. This project leverages a modern web interface and robust backend services to streamline file management and it is a course project for ECE569A: IOT: Analytics and Security at University of Victoria.

Key features:
1.Responsive Frontend:
Built with HTML, CSS, and JavaScript, the intuitive user interface supports drag-and-drop file uploads across various devices.

2.Intelligent File Organization:
Automatically determines the user's city using geolocation data and dynamically creates folders (e.g., "Vancouver," "Victoria"). If the city cannot be determined, users are prompted for input.

3.Robust Backend:
Developed using Node.js and Express.js, the backend processes file uploads, manages user authentication, and interacts with an SQLite database for efficient data storage.

4.Location-specific folders
ipinfo.io api integration

A 4-layer model is applied in this model, and the Architecture design diagram is showed as follows.
![image](https://github.com/user-attachments/assets/df627b94-9eb3-415d-9ede-514e5d319d30)

1. Frontend----drag.HTML, login.HTML
2. Server side-------server.js
3. LocalHost(It is just for tesing in local, if applied on Cloud, can be deteled.)
