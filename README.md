<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h1 align="center">API Nest Loans</h1>

<p align="center">
<a href="https://app.swaggerhub.com/apis-docs/1111172/BANFONDESA-Loans-API/1.0.0">
  <img src="https://img.shields.io/badge/SwaggerHub-v1.0.0-blue.svg" alt="SwaggerHub v1.0.0 Badge">
</a>
</p>

## Table of Contents

- [Description](#description)
- [Project Setup](#project-setup)
- [Database Structure](#database-structure)
- [Running the Project](#running-the-project)
- [Testing](#testing)

## Description

API Nest Loans is a backend service built with [NestJS](https://nestjs.com/) for managing loans, users, and payments. It provides a scalable and maintainable architecture for handling typical loan management operations.

## Project Setup

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/saitamaHero/loans-api.git

   cd api-nest-loans
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update the values as needed (database credentials, JWT secrets, etc).

4. **Set up the database:**
   - Ensure your database (PostgreSQL) server is running.
   - Synchronize entities as configured in your project.Since this is a demo project Synchronize option should be used.

## Database Structure

The following entities are used in this project:

### User

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| id        | int      | Primary key        |
| name      | string   | User's name        |
| email     | string   | User's email       |
| password  | string   | Hashed password    |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Update timestamp   |

### Loan

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| id        | int      | Primary key        |
| userId    | int      | Reference to User  |
| amount    | decimal  | Loan amount        |
| interest  | decimal  | Interest rate      |
| status    | string   | Loan status        |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Update timestamp   |

### Payment

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| id        | int      | Primary key        |
| loanId    | int      | Reference to Loan  |
| amount    | decimal  | Payment amount     |
| paymentDate    | datetime | Payment date       |
| createdAt | datetime | Creation timestamp |

## Running the Project

```bash
# development
npm run start

# watch mode
npm run start:dev
```

## Testing

> **Note**: The test suites are broken at the moment of the last update. This is something the I'm working on to improve code quality and make sure the changes are not broken as the code grows.
