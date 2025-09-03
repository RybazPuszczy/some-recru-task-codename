# Home task: Event-Driven Notification Orchestrator

## Configuring the environment
Use `.env` file in `/` project directory for development server.
### Environmental variables:
```env
# To change the port the server runs on, set the PORT variable. If you don't specify a port, it'll default to 3000.
PORT=3001

# The TZ variable is used to set the timezone for the server. By default, Node.js uses your system's timezone.
# CRUCIAL WHEN PROCESSING EVENT NOTIFICATION TIME.
TZ="Etc/GMT" 
```

## Running the server

To run in development mode, you can use the following command:

```bash
npm run dev
```

This will start the development server, watch for changes in your code and automatically reload the application.

To build the project for production, you can use the following command:

```bash
npm run build
```

This will create an optimized build of your application in the `.build` directory.

To start the production server, you can use the following command:

```bash
npm run start
```

This will start the server using the optimized build created in the previous step.

Remember to install the necessary dependencies before running these commands. You can do this by running:

```bash
npm i
```
