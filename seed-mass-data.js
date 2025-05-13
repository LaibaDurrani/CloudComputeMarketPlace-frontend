/**
 * Mass Data Seeder Runner Script
 * 
 * This script helps run the mass data seeder with configurable options
 */

const { spawn } = require('child_process');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default values
const defaults = {
  users: 500,
  computersPerSeller: 8,
  rentalsFactor: 5,
  conversationsFactor: 3,
  messagesPerConvo: 15
};

// Helper to validate number input
const validateNumber = (input, min = 1, max = 100000) => {
  const num = parseInt(input);
  return !isNaN(num) && num >= min && num <= max ? num : null;
};

console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           CLOUDCOMPUTEMARKETPLACE MASS SEEDER            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

This utility will help you seed your database with thousands of entries.
You'll need to have your MongoDB connection string configured in .env file.

`);

// Ask for configuration values
rl.question(`Number of users to create [${defaults.users}]: `, (usersInput) => {
  const users = validateNumber(usersInput) || defaults.users;
  
  rl.question(`Average number of computers per seller [${defaults.computersPerSeller}]: `, (computersInput) => {
    const computersPerSeller = validateNumber(computersInput) || defaults.computersPerSeller;
    
    rl.question(`Average number of rentals per computer [${defaults.rentalsFactor}]: `, (rentalsInput) => {
      const rentalsFactor = validateNumber(rentalsInput) || defaults.rentalsFactor;
      
      rl.question(`Average number of conversations per computer [${defaults.conversationsFactor}]: `, (conversationsInput) => {
        const conversationsFactor = validateNumber(conversationsInput) || defaults.conversationsFactor;
        
        rl.question(`Average number of messages per conversation [${defaults.messagesPerConvo}]: `, (messagesInput) => {
          const messagesPerConvo = validateNumber(messagesInput) || defaults.messagesPerConvo;
          
          rl.close();
          
          // Display configuration summary
          console.log('\nConfiguration:');
          console.log(`- Users: ${users}`);
          console.log(`- Computers per seller: ${computersPerSeller}`);
          console.log(`- Rentals factor: ${rentalsFactor}`);
          console.log(`- Conversations factor: ${conversationsFactor}`);
          console.log(`- Messages per conversation: ${messagesPerConvo}`);
          
          const totalEstimate = {
            users: users,
            computers: Math.floor(users * 0.7 * computersPerSeller), // 70% are sellers
            rentals: Math.floor(users * 0.7 * computersPerSeller * rentalsFactor),
            conversations: Math.floor(users * 0.7 * computersPerSeller * conversationsFactor),
            messages: Math.floor(users * 0.7 * computersPerSeller * conversationsFactor * messagesPerConvo)
          };
          
          console.log('\nEstimated records to be created:');
          console.log(`- ~${totalEstimate.users} users`);
          console.log(`- ~${totalEstimate.computers} computer listings`);
          console.log(`- ~${totalEstimate.rentals} rentals`);
          console.log(`- ~${totalEstimate.conversations} conversations`);
          console.log(`- ~${totalEstimate.messages} messages`);
          
          // Confirm before proceeding
          const confirmProcess = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          
          confirmProcess.question('\nContinue with database seeding? (yes/no): ', (answer) => {
            confirmProcess.close();
            
            if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
              console.log('\nStarting seeding process...');
              
              // Set environment variables for configuration
              const env = {
                ...process.env,
                SEED_USERS: users,
                SEED_COMPUTERS_PER_SELLER: computersPerSeller,
                SEED_RENTALS_FACTOR: rentalsFactor,
                SEED_CONVERSATIONS_FACTOR: conversationsFactor,
                SEED_MESSAGES_PER_CONVO: messagesPerConvo
              };
              
              // Run the seeder script
              const seederProcess = spawn('npm', ['run', 'seed:mass'], { 
                cwd: './CloudComputeMarketPlace-backend',
                env,
                stdio: 'inherit'
              });
              
              seederProcess.on('close', (code) => {
                if (code === 0) {
                  console.log('\n✅ Database seeding completed successfully!');
                } else {
                  console.log(`\n❌ Database seeding failed with code ${code}`);
                }
              });
            } else {
              console.log('\nSeeding canceled.');
            }
          });
        });
      });
    });
  });
});
