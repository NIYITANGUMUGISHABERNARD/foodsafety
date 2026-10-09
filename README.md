Food Safety Management System

A web-based application for managing and monitoring food safety activities, including products, batches, inspections, risks, storage conditions, alerts, and users.

Overview

The Food Safety Management System combines a React frontend, a Node.js and Express backend, a MySQL-compatible database, and a Python service. The project is organized into separate components to support development and maintenance.

Key Features
Dashboard: Overview of food safety management activities.
Product Management: Manage product information.
Batch Management: Track product batches.
Category Management: Organize products into categories.
Inspection Management: Support food safety inspections.
Risk Management: Manage food safety risk information.
Storage Management: Manage storage-related information.
Alerts and Notifications: Support food safety alerts.
User Management: Provide user administration.
Chatbot: Connect to the configured Python service.
Technology Stack
Component	Technology
Frontend	React, JavaScript, Vite, CSS, Tailwind CSS
Backend	Node.js, Express.js
Database	MySQL / MariaDB
Python Service	Python, Flask
HTTP Client	Axios
Version Control	Git and GitHub
Project Structure
foodsafety/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── python-service/
│   ├── app.py
│   └── requirements.txt
├── web-based/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
├── API_TESTING_GUIDE.md
├── Food Safety Management System.pdf
├── food_safety_public.sql
├── .gitignore
└── README.md
Prerequisites

Install the following tools:

Node.js and npm
Python and pip
MySQL or MariaDB
Git
Installation and Setup
1. Clone the Repository
git clone https://github.com/NIYITANGUMUGISHABERNARD/foodsafety.git
cd foodsafety
2. Configure the Database
Start MySQL or MariaDB.
Create a database named food_safety.
Review food_safety_public.sql.
Import the SQL file into your database.
Configure a database user with the necessary permissions.

Important: Back up important data and review the SQL file before importing it into an existing database.

3. Set Up the Backend

Open a terminal in the project directory:

cd backend
npm install

Create a local .env file inside the backend directory:

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=food_safety
PORT=5000

Replace the example values with your own database credentials. Never publish real passwords or secrets on GitHub.

Start the backend:

npm run dev

The documented default backend port is 5000. If the command is unavailable, check the scripts in backend/package.json.

4. Set Up the Python Service

Open another terminal from the project root:

cd python-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

Check app.py to confirm how the Python service reads its database configuration.

Start the Python service:

python app.py

The current application uses port 5001 for the Python service.

5. Set Up the Frontend

Open another terminal from the project root:

cd web-based
npm install
npm run dev

Open the local URL displayed by Vite.

To create a production build:

npm run build

The build output is generated in web-based/dist/.

API Testing

See API_TESTING_GUIDE.md for API testing instructions.

Use valid credentials from your own configured application when testing authentication.

Security Practices
Keep .env files and credentials out of version control.
Use strong passwords and securely hash user passwords.
Validate user input on the server.
Apply appropriate authentication and authorization controls.
Avoid publishing database exports containing private information.
Review files for exposed secrets before pushing changes to GitHub.
Apply production-safe settings before deployment.
Future Improvements
Automated testing and expanded test coverage.
Improved error handling and logging.
Continuous integration and continuous deployment (CI/CD).
Production deployment documentation.
Expanded API documentation and integration tests.
Database setup and recovery documentation.
Author

Bernard Niyitangumugisha

GitHub: @NIYITANGUMISHABERNARD

Repository

View Food Safety Management System on GitHub