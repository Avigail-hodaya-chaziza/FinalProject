-----

# 💆‍♀️ Beauty Hair Straightening Scheduler - Appointment Management System
## 🎯 Problem Solved & Value Proposition

Traditional phone booking for beauty treatments forces users to call during business hours, leading to frustration, extended wait times, and scheduling conflicts.

Our project delivers a **simple, 24/7 accessible digital solution** that empowers clients to **secure an appointment instantly** at their convenience, eliminating the hassle of coordinating schedules by phone.

A Full Stack system designed for managing appointments at a beauty salon, specializing exclusively in **Hair Straightening Treatments**. This application enables the manager and employees to efficiently oversee the schedule, view existing bookings, and easily add or cancel appointments.

## ✨ Key Features

  * **Interactive Scheduling:** Ability to book appointments by date, time, and duration, focusing **only on hair straightening services**.
  * **Focused Service Management:** Creation and updates of service types specifically for **hair straightening**.
  * **Appointment Management:** Functions for updating existing appointment details or deleting them.
  * **User Authentication:** Secure login using **username and password** or via **Google Sign-In**.
  * **Rating System:** Ability for customers to **rate the service** after their appointment is complete.
  * **User-Friendly Interface:** An interactive calendar providing a clear overview of all scheduled appointments.

## 💻 Technologies

| Category | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | `React`, `JavaScript`, `HTML`, `CSS` | Interactive and fast user interface. |
| **Backend** | `C#`, `.NET Core 7+`, `Entity Framework` | Business logic, API management, and database interaction. |
| **Database** | `SQL Server` | Data storage (appointments, services, employees). |
| **API** | `Axios` | Asynchronous communication between the Frontend and Backend. |

## 🛠️ Installation and Setup

To run the project on your local machine, ensure all prerequisites are installed.

### 📜 Prerequisites

1.  **Node.js:** Version `18` or higher.
2.  **npm** (Installed with Node.js).
3.  **.NET SDK:** Version `7` or higher.
4.  **SQL Server:** An SQL Server instance or a connection to an existing SQL database is required.
      * **Update Connection String:** Ensure the server's settings file (`appsettings.json` in the `Server` folder) contains the correct `Connection String` for your database.

### 1\. Running the Server (Backend)

Navigate to the server directory and start the project:

```bash
# Navigate to the Server directory
cd "C:\Users\Administrator\Desktop\project full stack\FinalProject-main\FinalProject\Server"

# Ensure .NET dependencies are restored
dotnet restore

# Start the server
dotnet run
```

The server will typically run on the default ASP.NET Core port (e.g., `https://localhost:7001`).

-----

### 2\. Running the Client (Frontend - React)

Open a new terminal window (separate from the server), navigate to the client directory, and install and run the application:

```bash
# Navigate to the Client directory (where package.json is located)
cd "C:\Users\Administrator\Desktop\project full stack\FinalProject-main\FinalProject\Client"

# Install React dependencies
npm install

# Start the React application
npm start
```

### 🚀 Accessing the Application

The application will automatically open in your browser at:

[**http://localhost:3000**](https://www.google.com/search?q=http://localhost:3000)
