# Events Management API

## Project Overview

The Events Management API is a RESTful backend service built with Node.js, Express, and TypeScript that allows users to 
create, retrieve, update, and delete events. It provides structured endpoints for managing event data such as name, date, capacity, 
registration count, status, and category.

This API is designed to solve the problem of organizing and managing events efficiently through a centralized system. It ensures data 
validation using Joi schemas, provides robust error handling, and includes secure configurations using Helmet and CORS.

The API is intended for developers who want to integrate event management functionality into web or mobile applications. It also includes 
full API documentation using Swagger (OpenAPI), making it easy to understand and test endpoints.

## Installation Instructions

### Prerequisites

Make sure the following are installed on your system:

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- Git

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Arsh607/Rishi_Arshdeep_BED_assignment3
cd https://github.com/Arsh607/Rishi_Arshdeep_BED_assignment3

### Step 2: Install dependencies

```bash
npm install

### Step 3: Environment Variables

Create a .env file in the root directory using the provided example below.

Example:

PORT=3000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:3000

# Important:
Do NOT commit your .env file
Ensure .env is included in .gitignore

### Step 4: Starting the application

```bash
npm start

# The API will be available at - http://localhost:3000

### Endpoints examples

1. Fetching all Events

Method - GET
URL - http://localhost:3000/api/v1/events
Expected Response:

Status code = 200 OK
{
    "message": "Events retrieved",
    "count": number of events,
    "data": [
        All the events
    ]
}

2. Fetching event by id

Method - GET
URL - http://localhost:3000/api/v1/events/id
id = id for the event we want to fetch
Expected Response:

Status code - 200 OK
{
    "message": "Event retrieved",
    "data": {
        ...
    }
}

3. Deleting an event

Method - DELETE
URL - http://localhost:3000/api/v1/events/id
id = id for the event which we want to delete
Expected Response:

Status code - 200 OK
{
    "message": "Event deleted"
}

### Public API documentation
Link - https://arsh607.github.io/Rishi_Arshdeep_BED_assignment3/

### Local access to documentation
When running the application locally, the documentation can be accessed using http://localhost:3000/api-docs/