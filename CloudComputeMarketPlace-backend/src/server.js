const app = require('./app');
const http = require('http');

// Try to use PORT from environment or default to 5000
const DEFAULT_PORT = 5000;
let PORT = process.env.PORT || DEFAULT_PORT;
let attempts = 0;

// Function to start the server
function startServer(port) {
  const server = app.listen(port)
    .on('listening', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && attempts < 3) {
        console.log(`Port ${port} is already in use, trying port ${port + 1}...`);
        attempts++;
        PORT = port + 1;
        server.close();
        startServer(PORT);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
    
  return server;
}

// Start the server with the initial port
const server = startServer(PORT);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
