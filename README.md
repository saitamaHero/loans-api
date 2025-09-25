<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h1 align="center">API Nest Loans</h1>

<p align="center">
<a href="https://app.swaggerhub.com/apis/1111172/BANFONDESA-Loans-API/1.0.0">
  <img src="https://img.shields.io/badge/SwaggerHub-v1.0.0-blue.svg" alt="SwaggerHub v1.0.0 Badge">
</a>
</p>

## Table of Contents

- [Description](#description)
- [Project Setup](#project-setup)
- [Database Structure](#database-structure)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Resources](#resources)
- [Support](#support)
- [Stay in Touch](#stay-in-touch)
- [License](#license)

## Description

API Nest Loans is a backend service built with [NestJS](https://nestjs.com/) for managing loans, users, and payments. It provides a scalable and maintainable architecture for handling typical loan management operations.

## Project Setup

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/saitamaHero/api-nest-loans.git

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
   - Run migrations or synchronize entities as configured in your project.

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
