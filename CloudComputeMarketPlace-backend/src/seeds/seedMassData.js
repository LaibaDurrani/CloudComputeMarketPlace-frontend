/**
 * Mass Data Seeder for CloudComputeMarketPlace
 * 
 * This script generates thousands of entries for:
 * - Users
 * - Computer listings
 * - Rentals
 * - Conversations
 * - Messages
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const { faker } = require('@faker-js/faker');
const cliProgress = require('cli-progress');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Load models
const User = require('../models/User');
const Computer = require('../models/Computer');
const Rental = require('../models/Rental');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Connect to DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hammadarif564:hammad1234@cluster0.t3ayndk.mongodb.net/cloudcomputemarketplace?retryWrites=true&w=majority';
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Configuration - can be overridden by environment variables
const CONFIG = {
  USERS: parseInt(process.env.SEED_USERS) || 500,             // Number of users to create
  COMPUTERS_PER_SELLER: parseInt(process.env.SEED_COMPUTERS_PER_SELLER) || 8, // Average number of computers per seller
  RENTALS_FACTOR: parseInt(process.env.SEED_RENTALS_FACTOR) || 5,      // Average rentals per computer
  CONVERSATIONS_FACTOR: parseInt(process.env.SEED_CONVERSATIONS_FACTOR) || 3, // Average conversations per computer
  MESSAGES_PER_CONVO: parseInt(process.env.SEED_MESSAGES_PER_CONVO) || 15   // Average messages per conversation
};

// Progress bars
const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  format: '{bar} | {filename} | {value}/{total} | {percentage}% | {eta_formatted}'
}, cliProgress.Presets.shades_classic);

// Reference data
const categories = [
  'AI & Machine Learning', 
  '3D Rendering', 
  'Gaming', 
  'Video Editing', 
  'Software Development',
  'Scientific Computing', 
  'Data Analysis', 
  'Crypto Mining', 
  'CAD/CAM', 
  'Virtualization',
  'Web Hosting',
  'Database Server',
  'Media Streaming',
  'Edge Computing',
  'IoT Platform'
];

const operatingSystems = [
  'Windows 11 Pro', 
  'Windows 10 Enterprise', 
  'Ubuntu 22.04 LTS', 
  'Debian 11', 
  'macOS Ventura',
  'CentOS 9', 
  'Red Hat Enterprise Linux 9', 
  'Windows Server 2022', 
  'FreeBSD 13',
  'Fedora 37',
  'Arch Linux',
  'OpenSUSE',
  'Rocky Linux 9',
  'NixOS',
  'ChromeOS Flex'
];

const cpuOptions = [
  'Intel Core i9-13900K',
  'AMD Ryzen 9 7950X',
  'Intel Xeon W9-3495X',
  'AMD Threadripper PRO 5995WX',
  'Intel Core i7-13700K',
  'AMD Ryzen 7 7800X3D',
  'Intel Core i5-13600K',
  'AMD Ryzen 5 7600X',
  'Apple M2 Ultra',
  'Apple M2 Max',
  'AMD EPYC 9654',
  'Intel Xeon Platinum 8490H',
  'Intel Core i9-14900K',
  'AMD Ryzen 9 7900X',
  'Intel Core i7-14700K',
  'AMD Ryzen 7 7700X',
  'Apple M3 Pro',
  'Intel Core i5-14600K',
  'AMD Ryzen 5 7600',
  'Intel Xeon Gold 6430'
];

const gpuOptions = [
  'NVIDIA RTX 4090',
  'NVIDIA RTX 4080',
  'AMD Radeon RX 7900 XTX',
  'NVIDIA RTX A6000',
  'NVIDIA A100 80GB',
  'AMD Radeon Pro W7900',
  'NVIDIA Tesla V100',
  'NVIDIA H100',
  'AMD Radeon RX 7900 XT',
  'NVIDIA RTX 4070 Ti',
  'AMD Radeon RX 6950 XT',
  'Apple M2 Ultra (32-core GPU)',
  'NVIDIA RTX 4090 x2 (SLI)',
  'NVIDIA A30 x4',
  'No dedicated GPU',
  'NVIDIA RTX 4080 Super',
  'AMD Radeon Pro W7800',
  'NVIDIA RTX A5000',
  'AMD Radeon RX 7800 XT',
  'NVIDIA RTX 4070 Super',
  'Intel Arc A770',
  'NVIDIA A40',
  'AMD Radeon RX 6900 XT',
  'NVIDIA L4'
];

const ramOptions = [
  '16GB DDR4-3200',
  '32GB DDR4-3600',
  '64GB DDR5-5600',
  '128GB DDR5-6000',
  '256GB DDR5-4800 ECC',
  '512GB DDR4-3200 ECC',
  '1TB DDR5-4800 ECC',
  '2TB DDR4-3200 ECC',
  '8GB LPDDR5',
  '24GB GDDR6X (GPU Memory)',
  '96GB DDR5-5600',
  '384GB DDR4-3200 ECC',
  '48GB DDR5-6400',
  '192GB DDR5-5200 ECC',
  '768GB DDR4-3200 ECC',
  '1.5TB DDR5-4800 ECC',
  '4TB DDR4-3200 ECC',
  '12GB LPDDR5X'
];

const storageOptions = [
  '512GB NVMe SSD',
  '1TB NVMe SSD',
  '2TB NVMe SSD',
  '4TB NVMe SSD',
  '8TB NVMe SSD RAID 0',
  '16TB HDD (4x4TB RAID 10)',
  '24TB HDD (6x4TB RAID 5)',
  '1TB NVMe SSD + 4TB HDD',
  '2TB NVMe SSD + 8TB HDD',
  '4TB NVMe SSD + 16TB HDD',
  '30TB Enterprise SAS SSD Array',
  '100TB Server Storage Array',
  '2TB NVMe SSD PCIe 4.0',
  '4TB NVMe SSD PCIe 5.0',
  '8TB NVMe SSD + 32TB HDD',
  '40TB NVMe SSD Array (RAID 5)',
  '120TB Enterprise Storage (10x12TB)',
  '500TB Storage Cluster',
  '1PB Storage Solution'
];

/**
 * Generate a random number within a range with normal distribution
 * @param {Number} min Minimum value
 * @param {Number} max Maximum value
 * @param {Number} skew How skewed the distribution is (higher values = more skewed toward min)
 */
function getRandomNormal(min, max, skew = 1) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = getRandomNormal(min, max, skew); // resample between 0 and 1 if out of range
  } else {
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
}

/**
 * Generate password hash
 * @param {String} password Plain text password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Generate users
 * @param {Number} count Number of users to generate
 */
async function generateUsers(count) {
  const bar = multibar.create(count, 0, { filename: 'Users        ' });
  const users = [];
  const password = await hashPassword('password123'); // Use same password for all users for simplicity
  
  for (let i = 0; i < count; i++) {
    const profileType = Math.random() > 0.5 ? 
      (Math.random() > 0.3 ? 'seller' : 'both') : 'buyer';
    
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: password,
      profileType: profileType,
      profilePicture: faker.image.avatar(),
      createdAt: faker.date.past({ years: 2 })
    });
    
    bar.update(i + 1);
  }
  
  // Add admin user
  users.push({
    name: 'Admin User',
    email: 'admin@example.com',
    password: password,
    profileType: 'both',
    profilePicture: faker.image.avatar(),
    createdAt: faker.date.past({ years: 2 })
  });
  
  try {
    await User.deleteMany({}); // Clear existing data
    const createdUsers = await User.insertMany(users);
    
    bar.update(count);
    bar.stop();
    console.log(`✓ Successfully created ${createdUsers.length} users`);
    
    return createdUsers;
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
}

/**
 * Generate computer listings for sellers
 * @param {Array} users Array of user documents
 */
async function generateComputers(users) {
  // Filter sellers
  const sellers = users.filter(user => 
    user.profileType === 'seller' || user.profileType === 'both'
  );
  
  const totalComputers = Math.floor(sellers.length * CONFIG.COMPUTERS_PER_SELLER);
  const bar = multibar.create(totalComputers, 0, { filename: 'Computers    ' });
  
  const computers = [];
  let count = 0;
  
  for (const seller of sellers) {
    // Each seller has a different number of listings
    const computerCount = Math.max(1, Math.floor(getRandomNormal(1, CONFIG.COMPUTERS_PER_SELLER * 2)));
    
    for (let i = 0; i < computerCount && count < totalComputers; i++) {
      // Generate specs
      const cpu = cpuOptions[Math.floor(Math.random() * cpuOptions.length)];
      const gpu = gpuOptions[Math.floor(Math.random() * gpuOptions.length)];
      const ram = ramOptions[Math.floor(Math.random() * ramOptions.length)];
      const storage = storageOptions[Math.floor(Math.random() * storageOptions.length)];
      const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
      
      // Generate pricing based on specs
      const hourlyBase = Math.random() * 10 + 1;
      const hourlyPrice = Math.round(hourlyBase * 100) / 100; // $1-$11 with 2 decimal places
      
      // Generate categories
      const randomCategoryCount = Math.floor(Math.random() * 3) + 1;
      const computerCategories = [];
      for (let j = 0; j < randomCategoryCount; j++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        if (!computerCategories.includes(randomCategory)) {
          computerCategories.push(randomCategory);
        }
      }
      
      // Generate title and description based on main category
      const mainCategory = computerCategories[0] || 'General Computing';
      let title, description;
      
      if (mainCategory.includes('AI') || mainCategory.includes('Machine Learning')) {
        title = `${cpu.split(' ')[0]} AI Training Powerhouse`;
        description = `High-performance machine learning rig with ${gpu} for deep learning and AI model training. Perfect for data scientists and researchers working with large datasets and complex models.`;
      } else if (mainCategory.includes('3D Rendering')) {
        title = `Professional ${gpu} Rendering Workstation`;
        description = `Ultra-fast rendering solution with ${cpu} and ${gpu}. Ideal for 3D artists, animators, and VFX professionals working with Blender, Maya, or 3ds Max.`;
      } else if (mainCategory.includes('Gaming')) {
        title = `Ultimate Gaming Rig with ${gpu}`;
        description = `Experience lag-free gaming with this high-end setup featuring ${cpu} and ${gpu}. Run the latest AAA titles at max settings with butter-smooth framerates.`;
      } else if (mainCategory.includes('Video Editing')) {
        title = `Professional Video Editing Station`;
        description = `Edit 4K and 8K footage smoothly with this professional-grade workstation. ${cpu} and ${gpu} provide the horsepower needed for complex timelines and effects.`;
      } else if (mainCategory.includes('Development')) {
        title = `Developer Workstation with ${ram}`;
        description = `Speed up your development workflow with this powerful machine. Perfect for compiling large codebases, running multiple VMs, and handling complex containerized environments.`;
      } else if (mainCategory.includes('Scientific')) {
        title = `Scientific Computing Cluster Node`;
        description = `Accelerate your research with this high-performance computing node. Ideal for simulations, data analysis, and computational modeling in scientific applications.`;
      } else if (mainCategory.includes('Data Analysis')) {
        title = `Big Data Processing Rig`;
        description = `Process and analyze large datasets efficiently with this powerful setup featuring ${ram} and ${storage}. Perfect for data scientists and analysts working with big data tools.`;
      } else if (mainCategory.includes('Crypto')) {
        title = `${gpu} Crypto Mining Setup`;
        description = `Optimized for cryptocurrency mining with ${gpu}. High hash rates and energy efficiency make this an ideal rig for serious miners.`;
      } else if (mainCategory.includes('CAD')) {
        title = `${cpu} CAD/CAM Workstation`;
        description = `Professional-grade workstation for CAD/CAM applications. Handle complex 3D models and simulations with ease using the ${gpu} and ${cpu}.`;
      } else if (mainCategory.includes('Virtualization')) {
        title = `Enterprise Virtualization Host with ${ram}`;
        description = `Run multiple virtual machines simultaneously with this high-capacity server. ${ram} and ${cpu} provide ample resources for complex virtualized environments.`;
      } else {
        title = `High-Performance Computing System`;
        description = `Versatile and powerful computing solution for demanding tasks. Equipped with ${cpu}, ${gpu}, and ${ram} for excellent all-around performance.`;
      }
      
      // Ensure title is within the 50 character limit
      const truncatedTitle = title.length > 45 ? title.substring(0, 45) : title;
      
      // Generate reviews
      const reviewCount = Math.floor(Math.random() * 10); // 0-9 reviews
      const reviews = [];
      
      for (let r = 0; r < reviewCount; r++) {
        const buyers = users.filter(user => 
          user.profileType === 'buyer' || user.profileType === 'both'
        );
        
        if (buyers.length > 0) {
          const randomBuyerIndex = Math.floor(Math.random() * buyers.length);
          const buyer = buyers[randomBuyerIndex];
          
          const rating = Math.floor(Math.random() * 5) + 1; // 1-5 star rating
          
          reviews.push({
            user: buyer._id,
            text: faker.lorem.sentences({ min: 1, max: 3 }),
            rating: rating,
            createdAt: faker.date.recent({ days: 60 })
          });
        }
      }
      
      // Calculate average rating
      const averageRating = reviews.length > 0 ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 
        0;
      
      // Create computer object
      computers.push({
        user: seller._id,
        title: truncatedTitle,
        description: description,
        specs: {
          cpu: cpu,
          gpu: gpu,
          ram: ram,
          storage: storage,
          operatingSystem: os,
        },
        location: faker.location.city() + ', ' + faker.location.country(),
        price: {
          hourly: hourlyPrice,
          daily: Math.round(hourlyPrice * 20 * 100) / 100, // 20 hours price for a day (discount)
          weekly: Math.round(hourlyPrice * 20 * 6 * 100) / 100, // 6 days price for a week (discount)
          monthly: Math.round(hourlyPrice * 20 * 6 * 3.5 * 100) / 100, // 3.5 weeks price for a month (discount)
        },
        availability: {
          status: Math.random() > 0.8 ? 'rented' : 'available',
          scheduledMaintenanceDates: [],
          activePeriods: []
        },
        categories: computerCategories,
        photos: [
          `https://source.unsplash.com/random/800x600?computer,server&sig=${count}1`,
          `https://source.unsplash.com/random/800x600?hardware,technology&sig=${count}2`,
          `https://source.unsplash.com/random/800x600?workstation,gpu&sig=${count}3`
        ],
        averageRating: averageRating,
        reviews: reviews,
        createdAt: faker.date.past({ years: 1 })
      });
      
      count++;
      bar.update(count);
      
      if (count >= totalComputers) {
        break;
      }
    }
  }
  
  try {
    await Computer.deleteMany({}); // Clear existing data
    const createdComputers = await Computer.insertMany(computers);
    
    bar.update(totalComputers);
    bar.stop();
    console.log(`✓ Successfully created ${createdComputers.length} computers`);
    
    return createdComputers;
  } catch (error) {
    console.error('Error creating computers:', error);
    process.exit(1);
  }
}

/**
 * Generate rental records
 * @param {Array} users Array of user documents
 * @param {Array} computers Array of computer documents
 */
async function generateRentals(users, computers) {
  const totalRentals = Math.floor(computers.length * CONFIG.RENTALS_FACTOR);
  const bar = multibar.create(totalRentals, 0, { filename: 'Rentals      ' });
  
  const buyers = users.filter(user => 
    user.profileType === 'buyer' || user.profileType === 'both'
  );
  
  const rentals = [];
  
  for (let i = 0; i < totalRentals; i++) {
    // Select a random computer
    const randomComputerIndex = Math.floor(Math.random() * computers.length);
    const computer = computers[randomComputerIndex];
    
    // Select a random buyer
    const randomBuyerIndex = Math.floor(Math.random() * buyers.length);
    const buyer = buyers[randomBuyerIndex];
    
    // Don't rent to the owner
    if (buyer._id.toString() === computer.user.toString()) {
      continue;
    }
    
    // Get owner from computer
    const owner = users.find(user => 
      user._id.toString() === computer.user.toString()
    );
    
    if (!owner) continue;
    
    // Select random rental type and duration
    const rentalTypes = ['hourly', 'daily', 'weekly', 'monthly'];
    const rentalTypeIndex = Math.floor(Math.random() * rentalTypes.length);
    const rentalType = rentalTypes[rentalTypeIndex];
    
    let durationHours;
    switch (rentalType) {
      case 'hourly':
        durationHours = Math.floor(Math.random() * 8) + 1; // 1-8 hours
        break;
      case 'daily':
        durationHours = (Math.floor(Math.random() * 6) + 1) * 24; // 1-6 days
        break;
      case 'weekly':
        durationHours = (Math.floor(Math.random() * 3) + 1) * 24 * 7; // 1-3 weeks
        break;
      case 'monthly':
        durationHours = Math.floor(Math.random() * 2 + 1) * 24 * 30; // 1-2 months
        break;
    }
      // Generate dates
    const startOffset = Math.floor(Math.random() * 180) - 90; // -90 to +90 days from now
    const startDate = faker.date.recent({ days: Math.max(1, Math.abs(startOffset)) }); // Ensure days is at least 1
    if (startOffset < 0) {
      // If in the past, adjust the date back
      startDate.setDate(startDate.getDate() - Math.abs(startOffset) * 2);
    }
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + durationHours);
    
    // Calculate price
    let totalPrice;
    switch (rentalType) {
      case 'hourly':
        totalPrice = computer.price.hourly * durationHours;
        break;
      case 'daily':
        totalPrice = computer.price.daily * (durationHours / 24);
        break;
      case 'weekly':
        totalPrice = computer.price.weekly * (durationHours / (24 * 7));
        break;
      case 'monthly':
        totalPrice = computer.price.monthly * (durationHours / (24 * 30));
        break;
    }
    
    // Round to 2 decimal places
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    // Determine status based on dates
    let status;
    const now = new Date();
    if (endDate < now) {
      status = 'completed';
    } else if (startDate > now) {
      status = 'pending';
    } else {
      status = 'active';
    }
    
    // Payment info
    const isPaid = Math.random() > 0.1; // 90% are paid
    const paymentMethod = ['credit_card', 'paypal', 'crypto', 'automatic'][Math.floor(Math.random() * 4)];
    
    // Access details for completed/active rentals
    let accessDetails = {};
    if (status === 'completed' || status === 'active') {
      accessDetails = {
        ipAddress: faker.internet.ipv4(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        accessUrl: `rdp://${faker.internet.domainName()}/computer-${i}`
      };
    }
    
    rentals.push({
      computer: computer._id,
      renter: buyer._id,
      owner: owner._id,
      startDate: startDate,
      endDate: endDate,
      rentalType: rentalType,
      totalPrice: totalPrice,
      status: status,
      paymentInfo: {
        method: paymentMethod,
        transactionId: faker.string.alphanumeric(12),
        isPaid: isPaid,
        paidAt: isPaid ? faker.date.recent({ days: 7 }) : null
      },
      accessDetails: accessDetails,
      createdAt: faker.date.recent({ days: Math.max(7, Math.abs(startOffset) + 1) })
    });
    
    bar.update(i + 1);
  }
  
  try {
    await Rental.deleteMany({}); // Clear existing data
    const createdRentals = await Rental.insertMany(rentals);
    
    bar.update(totalRentals);
    bar.stop();
    console.log(`✓ Successfully created ${createdRentals.length} rentals`);
    
    return createdRentals;
  } catch (error) {
    console.error('Error creating rentals:', error);
    process.exit(1);
  }
}

/**
 * Generate conversations and messages
 * @param {Array} users Array of user documents
 * @param {Array} computers Array of computer documents
 */
async function generateConversationsAndMessages(users, computers) {
  const buyers = users.filter(user => 
    user.profileType === 'buyer' || user.profileType === 'both'
  );
  
  const totalConversations = Math.floor(computers.length * CONFIG.CONVERSATIONS_FACTOR);
  const conversationBar = multibar.create(totalConversations, 0, { filename: 'Conversations' });
  
  const conversations = [];
  
  for (let i = 0; i < totalConversations; i++) {
    // Select a random computer
    const randomComputerIndex = Math.floor(Math.random() * computers.length);
    const computer = computers[randomComputerIndex];
    
    // Select a random buyer
    const randomBuyerIndex = Math.floor(Math.random() * buyers.length);
    const buyer = buyers[randomBuyerIndex];
    
    // Don't create conversation between the owner and themselves
    if (buyer._id.toString() === computer.user.toString()) {
      continue;
    }
    
    // Get owner from computer
    const owner = users.find(user => 
      user._id.toString() === computer.user.toString()
    );
    
    if (!owner) continue;
      // Create conversation
    const createdAt = faker.date.past({ years: 1 });
    // Ensure there's at least 1 day difference
    const fromDate = new Date(createdAt);
    const toDate = new Date(); // now
    // Ensure we have at least 1 day difference
    if (toDate - fromDate < 86400000) { // less than 1 day in milliseconds
      fromDate.setDate(fromDate.getDate() - 1); // set from date back 1 day
    }
    const lastMessageDate = faker.date.between({ from: fromDate, to: toDate });
    
    conversations.push({
      computer: computer._id,
      buyer: buyer._id,
      owner: owner._id,
      lastMessage: faker.lorem.sentence(),
      lastMessageDate: lastMessageDate,
      unreadBuyer: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
      unreadOwner: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
      createdAt: createdAt,
      // Store temporarily for message generation
      _messageCount: Math.max(3, Math.floor(getRandomNormal(1, CONFIG.MESSAGES_PER_CONVO * 2)))
    });
    
    conversationBar.update(i + 1);
  }
  
  try {
    await Conversation.deleteMany({}); // Clear existing data
    const createdConversations = await Conversation.insertMany(conversations);
    
    conversationBar.update(totalConversations);
    conversationBar.stop();
    console.log(`✓ Successfully created ${createdConversations.length} conversations`);
    
    // Generate messages for each conversation
    const totalMessages = createdConversations.reduce((sum, conv) => sum + conv._messageCount, 0);
    const messageBar = multibar.create(totalMessages, 0, { filename: 'Messages     ' });
      const messages = [];
    let totalMessageCount = 0;
    
    for (const conversation of createdConversations) {
      const messageCount = conversation._messageCount || 5;
      const { buyer, owner, computer } = conversation;
      
      // Starting templates for first few messages
      const firstMessage = `Hi, I'm interested in renting your ${computers.find(c => c._id.toString() === computer.toString())?.title}. Is it still available?`;
      const secondMessage = `Yes, it's available! When are you looking to rent it and for how long?`;
      
      // Create first message from buyer
      messages.push({
        conversation: conversation._id,
        sender: buyer,
        content: firstMessage,
        isRead: true,
        createdAt: conversation.createdAt
      });
      
      let lastCreatedAt = new Date(conversation.createdAt);
      lastCreatedAt.setHours(lastCreatedAt.getHours() + Math.random() * 2); // 0-2 hours later
      
      // Create second message from owner
      messages.push({
        conversation: conversation._id,
        sender: owner,
        content: secondMessage,
        isRead: true,
        createdAt: lastCreatedAt
      });
      
      // Create remaining messages
      const remainingMessages = messageCount - 2;
      
      for (let i = 0; i < remainingMessages; i++) {
        // Alternate between buyer and owner
        const sender = i % 2 === 0 ? buyer : owner;
        
        // Add random time between messages
        lastCreatedAt = new Date(lastCreatedAt);
        lastCreatedAt.setMinutes(lastCreatedAt.getMinutes() + Math.random() * 60 * 12); // 0-12 hours later
        
        // Message content based on conversation flow
        let content;
        
        if (i < 6) {
          // Early conversation about rental details
          if (sender === buyer) {
            content = [
              `I'm looking to rent for about ${['a day', 'a week', 'a few hours', 'a month'][Math.floor(Math.random() * 4)]}. Would that work?`,
              `What kind of ${['projects', 'tasks', 'work', 'activities'][Math.floor(Math.random() * 4)]} is this machine best suited for?`,
              `Is remote access available or do I need to pick it up physically?`,
              `What's your availability like for ${['next week', 'tomorrow', 'this weekend'][Math.floor(Math.random() * 3)]}?`
            ][i % 4];
          } else {
            content = [
              `That timeframe works! I've had people rent it for similar durations with no issues.`,
              `This machine is particularly good for ${['AI training', '3D rendering', 'video editing', 'development work'][Math.floor(Math.random() * 4)]} based on the specs.`,
              `Remote access is fully set up and ready to go. You'll get secure credentials once the booking is confirmed.`,
              `I'm available ${['any time next week', 'tomorrow afternoon', 'all weekend'][Math.floor(Math.random() * 3)]}. Just let me know what works for you.`
            ][i % 4];
          }
        } else if (i < 12) {
          // Middle conversation about technical details
          if (sender === buyer) {
            content = [
              `Can you tell me more about the ${['CPU', 'GPU', 'RAM', 'storage'][Math.floor(Math.random() * 4)]} specifications?`,
              `Have you had any ${['performance issues', 'reliability concerns', 'connectivity problems'][Math.floor(Math.random() * 3)]} with this setup?`,
              `What's your ${['refund policy', 'cancellation policy', 'support availability'][Math.floor(Math.random() * 3)]} like if I run into issues?`,
              `Do you have any ${['benchmarks', 'performance metrics', 'user reviews'][Math.floor(Math.random() * 3)]} I could look at?`
            ][i % 4];
          } else {
            content = [
              `Sure, the ${['CPU', 'GPU', 'RAM', 'storage'][Math.floor(Math.random() * 4)]} is a ${faker.lorem.sentence(3)} that performs exceptionally well.`,
              `No major issues so far. It's been running ${['smoothly', 'reliably', 'consistently'][Math.floor(Math.random() * 3)]} for all previous renters.`,
              `I offer ${['full support', '24/7 assistance', 'quick response times'][Math.floor(Math.random() * 3)]} and can help troubleshoot any problems that might arise.`,
              `Yes, I can share some ${['benchmark results', 'performance stats', 'user feedback'][Math.floor(Math.random() * 3)]} with you. Most users have been very satisfied.`
            ][i % 4];
          }
        } else {
          // Later conversation about booking
          if (sender === buyer) {
            content = [
              `Great, I'd like to go ahead and book it starting ${['Monday', 'tomorrow', 'next week', 'this weekend'][Math.floor(Math.random() * 4)]}.`,
              `What payment methods do you accept?`,
              `Is there anything specific I should know about using this machine?`,
              `Thanks for all the information, I'll complete the booking through the platform shortly.`
            ][i % 4];
          } else {
            content = [
              `Perfect! I'll mark that date in my calendar.`,
              `You can pay directly through the platform which accepts all major payment methods.`,
              `Just make sure to ${['follow the setup guide', 'check the documentation I\'ll share', 'let me know if you need any help getting started'][Math.floor(Math.random() * 3)]}.`,
              `Great! Looking forward to having you as a renter. Don't hesitate to message me if you have any questions.`
            ][i % 4];
          }
        }
        
        // Add some randomness to make it feel real
        if (Math.random() > 0.7) {
          content = faker.lorem.sentence(Math.floor(Math.random() * 15) + 5);
        }
        
        // Create message
        messages.push({
          conversation: conversation._id,
          sender: sender,
          content: content,
          isRead: lastCreatedAt < new Date() - 1000 * 60 * 60 * 24, // Read if older than 24 hours
          createdAt: lastCreatedAt
        });
          totalMessageCount++;
        messageBar.update(totalMessageCount);
      }
    }
    
    try {
      await Message.deleteMany({}); // Clear existing data
      const createdMessages = await Message.insertMany(messages);
      
      messageBar.update(totalMessages);
      messageBar.stop();
      console.log(`✓ Successfully created ${createdMessages.length} messages`);
      
      return { conversations: createdConversations, messages: createdMessages };
    } catch (error) {
      console.error('Error creating messages:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error creating conversations:', error);
    process.exit(1);
  }
}

/**
 * Main function to seed all data
 */
async function seedAllData() {
  console.log(`
===============================================
  CLOUDCOMPUTEMARKETPLACE MASS DATA SEEDER
===============================================
This script will generate:
- ${CONFIG.USERS} users
- ~${CONFIG.USERS * 0.7 * CONFIG.COMPUTERS_PER_SELLER} computer listings
- ~${CONFIG.USERS * 0.7 * CONFIG.COMPUTERS_PER_SELLER * CONFIG.RENTALS_FACTOR} rentals
- ~${CONFIG.USERS * 0.7 * CONFIG.COMPUTERS_PER_SELLER * CONFIG.CONVERSATIONS_FACTOR} conversations
- ~${CONFIG.USERS * 0.7 * CONFIG.COMPUTERS_PER_SELLER * CONFIG.CONVERSATIONS_FACTOR * CONFIG.MESSAGES_PER_CONVO} messages
  `);
  
  console.log('Starting data generation...');
  
  try {
    console.log('Generating users...');
    const users = await generateUsers(CONFIG.USERS);
    
    console.log('Generating computers...');
    const computers = await generateComputers(users);
    
    console.log('Generating rentals...');
    const rentals = await generateRentals(users, computers);
    
    console.log('Generating conversations and messages...');
    const conversations = await generateConversationsAndMessages(users, computers);
    
    console.log('\n✓ Data generation complete!');
    console.log(`
Summary:
- ${users.length} users created
- ${computers.length} computer listings created
- ${rentals.length} rentals created
- ${conversations.conversations.length} conversations created
- ${conversations.messages.length} messages created
    `);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Run the seeder
seedAllData();
