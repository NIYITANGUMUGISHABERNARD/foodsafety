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
Chatbot: Provide a chatbot interface connected to the configured Python service.
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
Import the food_safety_public.sql file.
Configure a database user with appropriate permissions.

Check the SQL file before importing it into a database containing important data.

3. Set Up the Backend
cd backend
npm install

Create a local backend/.env file with your database configuration:

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=food_safety
PORT=5000

Replace the example values with your own database credentials. Never commit real passwords or secrets to GitHub.

Start the backend:

npm run dev

The backend uses port 5000 by default.

4. Set Up the Python Service

Open another terminal from the project root:

cd python-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

Check the database settings in app.py and make sure they match your local database configuration.

Start the Python service:

python app.py

The Python service uses port 5001 in the current application code.

Security: Before deployment, move database credentials into environment variables and use production-safe settings.

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

Security Practices
Keep .env files and credentials out of version control.
Use strong passwords and securely hash user passwords.
Validate user input on the server.
Apply appropriate authentication and authorization controls.
Avoid publishing database exports containing private information.
Review files for exposed credentials before pushing to GitHub.
Future Improvements
Automated testing and expanded test coverage.
Database setup and recovery documentation.
Improved error handling and logging.
Continuous integration and deployment (CI/CD).
Production deployment documentation.
Additional API documentation and integration tests.
Environment-based configuration for all services.
Author

Bernard Niyitangumugisha

GitHub: @NIYITANGUMUGISHABERNARD

Repository

View Food Safety Management System on GitHub
