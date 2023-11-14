# Event Organizer Prediction Backend

This is the backend application for an Event Organizer Prediction system, designed to predict income and outcomes. The application is built using PostgreSQL and Node.js.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repository
   ```

3. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

4. Create a copy of the `.env.example` file and name it `.env`:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database connection details and any other configuration settings.

5. Start the application in development mode:

   ```bash
   yarn start:dev
   ```

   This will run the application with hot-reloading, making it easy to develop and test.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `DB_HOST`: The host of your PostgreSQL database.
- `DB_PORT`: The port of your PostgreSQL database.
- `DB_NAME`: The name of your PostgreSQL database.
- `DB_USER`: Your PostgreSQL database username.
- `DB_PASSWORD`: Your PostgreSQL database password.

## Scripts

- `yarn start`: Start the application in production mode.
- `yarn dev`: Start the application in development mode.
- `yarn test`: Run tests.
- `yarn lint`: Lint the code.

## Contributing

Feel free to contribute to the project. Follow the [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [MIT License](LICENSE).
```
