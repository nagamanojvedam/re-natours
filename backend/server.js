const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 5001;
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then((conn) => {
    console.log('Mongo DB connected to:', conn.connection.name);

    const server = app.listen(port, () => {
      console.log(`Application running on port: ${port}`);
    });

    process.on('unhandledRejection', (err) => {
      console.log(`Unhandled Rejection! 💥 Shutting down...`);
      console.log(err.name, err.message);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
