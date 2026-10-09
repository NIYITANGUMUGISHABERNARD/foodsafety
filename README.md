# Food Safety Management System
A web-based application designed to support food safety management through product and batch tracking, inspections, risk monitoring, storage management, alerts, and user administration.

## Overview
The Food Safety Management System combines a web-based frontend, a Node.js backend, and a Python service to support the management and monitoring of food safety information.

## Key Features
Dashboard: Provides an overview of food safety management activities.
Product Management: Organizes product information.
Batch Management: Supports product batch tracking.
Category Management: Organizes products into categories.
Inspection Management: Supports food safety inspection workflows.
Risk Management: Provides functionality for managing food safety risks.
Storage Management: Organizes storage-related information.
Alerts and Notifications: Supports food safety alerts and notifications.
User Management: Provides user administration functionality.
Chatbot: Includes a chatbot interface for the configured service.
## Technology Stack
Component	Technology
Frontend	React, Vite, JavaScript, CSS
Backend	Node.js, Express.js
Database	MySQL-compatible database configuration
Additional Service	Python
API Documentation	Markdown
Version Control	Git and GitHub
## Project Structure
foodsafety/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ config/
â”‚   â”œâ”€â”€ controllers/
â”‚   â”œâ”€â”€ middleware/
â”‚   â”œâ”€â”€ models/
â”‚   â”œâ”€â”€ routes/
â”‚   â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ app.js
â”‚   â”œâ”€â”€ seed.js
â”‚   â””â”€â”€ server.js
â”œâ”€â”€ python-service/
â”‚   â”œâ”€â”€ app.py
â”‚   â””â”€â”€ requirements.txt
â”œâ”€â”€ web-based/
â”‚   â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ index.html
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ API_TESTING_GUIDE.md
â”œâ”€â”€ Food Safety Management System.pdf
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
## Getting Started
Prerequisites

Install the following tools:

Node.js and npm
Python and pip
A compatible MySQL database server
Git
1. Clone the Repository
git clone https://github.com/NIYITANGUMUGISHABERNARD/foodsafety.git
cd foodsafety
2. Configure the Backend

Navigate to the backend directory and install dependencies:

cd backend
npm install

Configure the required environment variables for the database and application credentials.

Review config/db.js, seed.js, and package.json to identify the required settings and available scripts.

Start the backend using the appropriate script defined in package.json.

3. Configure the Python Service

From the project root, navigate to the Python service:

cd python-service
python -m venv .venv

Activate the virtual environment on Windows PowerShell:

.\.venv\Scripts\Activate.ps1

Install the dependencies:

pip install -r requirements.txt

Configure any required environment variables and start the service according to its application configuration.

4. Configure the Frontend

Open a separate terminal from the project root and run:

cd web-based
npm install
npm run dev

Open the local URL displayed by Vite in your browser.

Configuration Notes

The frontend, backend, database, and Python service may require additional configuration before all features work correctly. Review the configuration files and API testing guide for the required ports, environment variables, and service connections.

## API Testing
The project includes an API testing guide:

API_TESTING_GUIDE.md

Use this guide to review the available API testing procedures and verify backend endpoints.

## Security Practices
Keep .env files and credentials out of version control.
Use strong passwords and store password hashes securely.
Use environment variables for sensitive configuration.
Apply appropriate authentication and authorization controls.
Validate and sanitize user input.
Avoid publishing database exports containing private or sensitive information.
Review files for exposed credentials before pushing changes to GitHub.
## Future Improvements
Automated testing and test coverage.
Deployment and installation documentation.
Continuous integration and continuous deployment (CI/CD).
Improved application monitoring and logging.
More detailed database setup documentation.
Additional API integration documentation.
## Author
Bernard Niyitangumugisha

GitHub: @NIYITANGUMUGISHABERNARD

## Repository
View the Food Safety Management System on GitHub
