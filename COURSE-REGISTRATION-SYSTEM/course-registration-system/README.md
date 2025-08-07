# Course Registration System

## Overview
The Course Registration System is a web application that allows users to register for various courses. It provides a user-friendly interface for course selection and enrollment, along with a backend server to handle requests and manage course data.

## Project Structure
```
course-registration-system
├── public
│   ├── index.html        # Main HTML document for the application
│   ├── register.html     # Registration form for course enrollment
│   └── myscript.js       # Client-side JavaScript for functionality
├── src
│   ├── server.js         # Entry point for the server-side application
│   └── db
│       └── courses.json   # JSON representation of available courses
├── package.json           # npm configuration file
└── README.md              # Documentation for the project
```

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd course-registration-system
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the server:**
   ```
   node src/server.js
   ```

4. **Access the application:**
   Open your web browser and navigate to `http://localhost:8080` to view the application.

## Usage
- Navigate to the registration page to enroll in a course.
- Fill out the registration form and submit to register for your selected course.
- The application will dynamically update course availability based on the data in `src/db/courses.json`.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.