const mongoose = require('mongoose');
const app = require('./app');

// Handle Uncaught Exceptions (e.g., undefined variables, syntax errors)
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

// Environment Variables
const PORT = process.env.PORT || 5001;
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

// Database Connection
mongoose
  .connect(DB)
  .then((conn) => {
    console.log(`✅ MongoDB connected: ${conn.connection.name}`);

    // Start Server After DB Connection
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Handle Unhandled Promise Rejections (e.g., failed async code)
    process.on('unhandledRejection', (err) => {
      console.error('💥 UNHANDLED REJECTION! Shutting down...');
      console.error(`${err.name}: ${err.message}`);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
