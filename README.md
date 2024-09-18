Task Overview
The coding task involves a backend system that implements role-based access control using TypeScript and Next.js API routes. The system will interact with a MySQL database and include functionality for handling CSV file uploads to an FTP server, processing the uploaded data, and inserting it into the database. The frontend will include user authentication and manage permissions, displaying forms and buttons based on user roles. Additionally, you should write tests to ensure the correctness and reliability of your implementation.

Detailed Task Requirements

Backend (Nest.js API with TypeScript)

1. Project Setup:
   - Initialize a Nest.js project with TypeScript.
   - Configure the project to use a MySQL database.

2. User Authentication:
   - Implement user authentication using JWT (JSON Web Tokens).
   - Create middleware for verifying JWT tokens on protected routes.

3. Role-Based Access Control:
   - Define at least two roles: superadmin, Hr, tech, product manager, and user.
     - superadmin: Has full access to all operations and resources.
     - Hr: Has specific access relevant to HR operations.
     - tech: Has specific access relevant to technical operations.
     - product manager: Has specific access relevant to product management operations.
     - user: Can view forms and perform limited operations based on permissions.
   - Implement middleware to check user roles and permissions before allowing access to certain endpoints.

4. API Endpoints:
   - User Management:
     - Registration: Endpoint for creating new users.
     - Login: Endpoint for user authentication.
   - CRUD Operations:
     - Endpoints for creating, reading, updating, and deleting records.
     - Implement role-based permissions on these operations to ensure only users with the appropriate role can perform certain actions.

5. Middleware:
   - Implement middleware to handle authentication and role-based authorization.
   - Ensure middleware checks are performed before executing sensitive operations.

6. CSV Handling:
   - Create an API endpoint for uploading CSV files.
   - Implement file upload functionality to save the CSV file to an FTP server.
   - Parse the CSV file, validate the data, and insert it into the MySQL database.

7.Scheduled CSV Data Update and Database Synchronization

You need to implement a system that periodically checks for new CSV files on an FTP server every 10 minutes. The process involves:

Detecting New Files: Check the FTP server for new CSV files that have been added since the last check.
Processing Data: For each new CSV file, parse its content to extract the data.
Database Synchronization: Verify if the data from the CSV file already exists in the database. If the data does not exist, insert the new records into the database.
This system should ensure that the database is updated with new data from the CSV files while avoiding duplication of records.


Frontend (Next.js with TypeScript)

1. Authentication:
   - Develop a login page to handle user authentication.
   - Utilize JWT for maintaining user sessions.

2. Dashboard:
   - Form Display: Display a data input form visible to all logged-in users.
   - Role-Based UI: Implement logic to show or hide certain buttons based on the logged-in user's role.
     - Example: Only superadmin or users with specific permissions should see the button for CSV upload.
   - CSV Upload: Allow admin users (or those with the appropriate role) to upload CSV files via the dashboard.
   - Data Display: Retrieve and display data from the database, allowing users to view data based on their role.

Testing

1. Backend Tests:
   - Unit Tests: Write unit tests for individual components such as authentication, role-based middleware, and CRUD operations.
   - Integration Tests: Create integration tests to ensure the interaction between components (e.g., authentication and role-based access) works as expected.
   - API Tests: Implement tests for the API endpoints, verifying correct behavior for user registration, login, CRUD operations, and CSV handling.
   - CSV Handling Tests: Test the functionality of CSV file uploads, parsing, and database insertion.
   - Use testing frameworks such as Jest and testing libraries like Supertest for API endpoint testing.

2. Frontend Tests:
   - Component Tests: Write tests for React components to ensure proper rendering and functionality based on user roles.
   - Integration Tests: Implement integration tests to verify interactions between components, such as login functionality and form submissions.
   - End-to-End Tests: Use tools like Cypress or Puppeteer to test the complete flow from login to data display, ensuring that role-based access controls work as expected.


# backend_assignment-
