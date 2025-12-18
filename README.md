# Employee Management System

## Overview
The Employee Management System (EMS) is a comprehensive, web-based application designed to streamline and optimize the management of human resources within organizations. It provides a centralized platform for HR personnel to efficiently handle employee data, departmental structures, and generate insightful reports.

This repository contains the source code for the EMS application. The main project is located in the `emp_mng` directory.

## Project Structure
- `emp_mng/`: Contains the React frontend application and the mock backend server setup.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites
- Node.js and npm installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd emp_mng
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

This application requires both the React frontend and the JSON server (mock backend) to be running.

1. **Start the Backend Server:**
   Open a terminal, navigate to `emp_mng`, and run:
   ```bash
   npm run server
   ```
   This will start the mock database on port 3001.

2. **Start the Frontend:**
   Open a new terminal, navigate to `emp_mng`, and run:
   ```bash
   npm start
   ```
   This will launch the React application in your default browser (usually at http://localhost:3000).

## Features
- **Employee Management:** Add, update, view, and delete employee records.
- **Department Management:** Manage departments and assign employees.
- **Reporting:** Generate reports on employee statistics and more.

For more detailed documentation, please refer to the [README](emp_mng/README.md) inside the `emp_mng` directory.
