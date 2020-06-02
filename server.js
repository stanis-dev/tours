const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION. SHUTTING DOWN...`);
  console.error(err);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const app = require('./app');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log('App running on port: ' + PORT);
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.log(`UNHADLED REJECTION. SHUTTING DOWN...`);
  server.close(() => {
    //By doing it like this, we are giving the server time to shut down gracefully - finishing the pending requests, etc
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
