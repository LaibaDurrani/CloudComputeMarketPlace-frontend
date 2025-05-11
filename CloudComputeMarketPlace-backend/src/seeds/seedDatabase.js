const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars - use absolute path to ensure it finds the .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Show MongoDB connection string (without credentials) for debugging
console.log(`MongoDB URI being used: ${process.env.MONGO_URI ? 'Found connection string' : 'MONGO_URI is undefined'}`);

// Load models
const User = require('../models/User');
const Computer = require('../models/Computer');
const Rental = require('../models/Rental');

// Connect to DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hammadarif564:hammad1234@cluster0.t3ayndk.mongodb.net/cloudcomputemarketplace?retryWrites=true&w=majority';
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    profileType: 'both',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    name: 'John Seller',
    email: 'john@example.com',
    password: 'password123',
    profileType: 'seller',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Jane Seller',
    email: 'jane@example.com',
    password: 'password123',
    profileType: 'seller',
    profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    name: 'Bob Buyer',
    email: 'bob@example.com',
    password: 'password123',
    profileType: 'buyer',
    profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    name: 'Alice Buyer',
    email: 'alice@example.com',
    password: 'password123',
    profileType: 'buyer',
    profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    name: 'David Both',
    email: 'david@example.com',
    password: 'password123',
    profileType: 'both',
    profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg'
  },
  {
    name: 'Emily Both',
    email: 'emily@example.com',
    password: 'password123',
    profileType: 'both',
    profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg'
  },
  {
    name: 'Michael Seller',
    email: 'michael@example.com',
    password: 'password123',
    profileType: 'seller',
    profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg'
  },
  {
    name: 'Sarah Buyer',
    email: 'sarah@example.com',
    password: 'password123',
    profileType: 'buyer',
    profilePicture: 'https://randomuser.me/api/portraits/women/9.jpg'
  },
  {
    name: 'Ryan Developer',
    email: 'ryan@example.com',
    password: 'password123',
    profileType: 'both',
    profilePicture: 'https://randomuser.me/api/portraits/men/10.jpg'
  }
];

// Function to generate computers based on user IDs
const generateComputers = (userIds) => {
  // Get IDs of users who can sell (seller or both)
  const sellerUserIds = userIds.filter((user) => 
    user.profileType === 'seller' || user.profileType === 'both'
  );

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
    'Virtualization'
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
    'FreeBSD 13'
  ];

  const locations = [
    'New York, USA', 
    'San Francisco, USA', 
    'London, UK', 
    'Tokyo, Japan', 
    'Berlin, Germany',
    'Singapore', 
    'Sydney, Australia', 
    'Toronto, Canada', 
    'Amsterdam, Netherlands', 
    'Paris, France'
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
    'Intel Xeon Platinum 8490H'
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
    'No dedicated GPU'
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
    '384GB DDR4-3200 ECC'
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
    '100TB Server Storage Array'
  ];

  // Generate computer listings
  const computers = [];
  
  // Create 30 random computer listings
  for (let i = 0; i < 30; i++) {
    // Randomly select a seller
    const randomSellerIndex = Math.floor(Math.random() * sellerUserIds.length);
    const seller = sellerUserIds[randomSellerIndex];

    // Generate random specs
    const cpu = cpuOptions[Math.floor(Math.random() * cpuOptions.length)];
    const gpu = gpuOptions[Math.floor(Math.random() * gpuOptions.length)];
    const ram = ramOptions[Math.floor(Math.random() * ramOptions.length)];
    const storage = storageOptions[Math.floor(Math.random() * storageOptions.length)];
    const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
    
    // Generate random pricing based on specs
    const hourlyPrice = Math.round((Math.random() * 10 + 1) * 100) / 100; // $1-$11 with 2 decimal places
    
    // Assign 1-3 random categories
    const randomCategoryCount = Math.floor(Math.random() * 3) + 1;
    const computerCategories = [];
    for (let j = 0; j < randomCategoryCount; j++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      if (!computerCategories.includes(randomCategory)) {
        computerCategories.push(randomCategory);
      }
    }

    // Create compelling titles and descriptions
    let title = '';
    let description = '';    // Base title and description on main category
    const mainCategory = computerCategories[0] || 'General Computing';
    
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
    }    // Ensure title is within the 50 character limit
    const truncatedTitle = title.length > 45 ? title.substring(0, 45) + '...' : title;
    
    // Create computer object
    const computer = {
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
      location: locations[Math.floor(Math.random() * locations.length)],
      price: {
        hourly: hourlyPrice,
        daily: hourlyPrice * 20, // 20 hours price for a day (discount)
        weekly: hourlyPrice * 20 * 6, // 6 days price for a week (discount)
        monthly: hourlyPrice * 20 * 6 * 3.5, // 3.5 weeks price for a month (discount)
      },
      availability: {
        status: 'available',
      },
      categories: computerCategories,
      photos: [
        `https://source.unsplash.com/random/300x200?computer,server&sig=${i}1`,
        `https://source.unsplash.com/random/300x200?computer,hardware&sig=${i}2`,
        `https://source.unsplash.com/random/300x200?server,tech&sig=${i}3`
      ],
      averageRating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      reviews: [],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)), // Random date in last 90 days
    };

    computers.push(computer);
  }

  return computers;
};

// Function to generate rentals based on users and computers
const generateRentals = (users, computers) => {
  const rentals = [];
  const statuses = ['pending', 'active', 'completed', 'cancelled'];
  const rentalTypes = ['hourly', 'daily', 'weekly', 'monthly'];
  const paymentMethods = ['credit_card', 'paypal', 'crypto'];

  // Get buyer and both type users
  const buyerUserIds = users.filter(user => 
    user.profileType === 'buyer' || user.profileType === 'both'
  );

  // Create 20 random rentals
  for (let i = 0; i < 20; i++) {
    // Select a random computer
    const randomComputerIndex = Math.floor(Math.random() * computers.length);
    const computer = computers[randomComputerIndex];
    
    // Select a random buyer
    const randomBuyerIndex = Math.floor(Math.random() * buyerUserIds.length);
    const buyer = buyerUserIds[randomBuyerIndex];
    
    // Get computer owner
    const owner = users.find(user => user._id.toString() === computer.user.toString());
    
    // Skip if buyer is the same as owner
    if (buyer._id.toString() === owner._id.toString()) {
      continue;
    }
    
    // Set random dates
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30)); // Up to 30 days ago
    
    const startDate = pastDate;
    
    const rentalType = rentalTypes[Math.floor(Math.random() * rentalTypes.length)];
    const endDate = new Date(startDate);
    
    // Set end date based on rental type
    if (rentalType === 'hourly') {
      endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 24) + 1); // 1-24 hours
    } else if (rentalType === 'daily') {
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days
    } else if (rentalType === 'weekly') {
      endDate.setDate(endDate.getDate() + (Math.floor(Math.random() * 3) + 1) * 7); // 1-3 weeks
    } else {
      endDate.setMonth(endDate.getMonth() + 1); // 1 month
    }
    
    // Determine status based on dates
    let status;
    if (startDate > now) {
      status = 'pending';
    } else if (endDate < now) {
      status = Math.random() > 0.2 ? 'completed' : 'cancelled';
    } else {
      status = 'active';
    }
    
    // Calculate price based on rental type and computer price
    let totalPrice;
    if (rentalType === 'hourly') {
      const hours = (endDate - startDate) / (1000 * 60 * 60);
      totalPrice = computer.price.hourly * hours;
    } else if (rentalType === 'daily') {
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      totalPrice = computer.price.daily * days;
    } else if (rentalType === 'weekly') {
      const weeks = (endDate - startDate) / (1000 * 60 * 60 * 24 * 7);
      totalPrice = computer.price.weekly * weeks;
    } else {
      const months = (endDate - startDate) / (1000 * 60 * 60 * 24 * 30);
      totalPrice = computer.price.monthly * months;
    }
    
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    // Random payment method
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    // Create rental object
    const rental = {
      computer: computer._id,
      renter: buyer._id,
      owner: owner._id,
      startDate,
      endDate,
      rentalType,
      totalPrice,
      status,
      paymentInfo: {
        method: paymentMethod,
        transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`,
        isPaid: status !== 'pending',
        paidAt: status !== 'pending' ? startDate : null
      },
      createdAt: new Date(startDate.getTime() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)), // 1 day before start date
    };
    
    rentals.push(rental);

    // If the rental is completed, add a review
    if (status === 'completed' && Math.random() > 0.3) { // 70% chance of review
      const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
      const reviewTexts = [
        "Great machine, everything worked perfectly!",
        "The computer performed really well for my needs.",
        "Very satisfied with the performance.",
        "Good specs, but had some issues with connectivity.",
        "Excellent support from the owner when I had questions.",
        "The machine was exactly what I needed for my project.",
        "Performance was even better than I expected.",
        "Had some initial issues but the owner was quick to resolve them.",
        "Very smooth experience from start to finish.",
        "Would definitely rent again for future projects."
      ];
      
      const review = {
        user: buyer._id,
        text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        rating,
        createdAt: new Date(endDate.getTime() + Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000)), // 0-2 days after end date
      };
      
      // Add the review to the computer
      computers[randomComputerIndex].reviews.push(review);
      
      // Recalculate average rating
      const reviews = computers[randomComputerIndex].reviews;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      computers[randomComputerIndex].averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
    }
  }
  
  return rentals;
};

// Import data into DB
const importData = async () => {
  try {  // Clear existing data
    await User.deleteMany();
    await Computer.deleteMany();
    await Rental.deleteMany();    
    console.log('Existing data cleared...');

    // Create users with hashed passwords
    const hashedPasswordUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      hashedPasswordUsers.push({
        ...user,
        _id: new mongoose.Types.ObjectId(),
        password: hashedPassword
      });
    }
    
    // Insert users into database
    const createdUsers = await User.insertMany(hashedPasswordUsers);
    console.log(`${createdUsers.length} users created...`);
    
    // Generate and insert computers
    const computerData = generateComputers(createdUsers);
    const createdComputers = await Computer.insertMany(computerData);
    console.log(`${createdComputers.length} computer listings created...`);

    // Generate and insert rentals
    const rentalData = generateRentals(createdUsers, createdComputers);
    const createdRentals = await Rental.insertMany(rentalData);
    console.log(`${createdRentals.length} rentals created...`);    // Update computers with reviews
    for (const computer of computerData) {
      if (computer.reviews && computer.reviews.length > 0) {
        await Computer.findByIdAndUpdate(computer._id, { 
          $set: { 
            reviews: computer.reviews,
            averageRating: computer.averageRating 
          } 
        });
      }
    }
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Computer.deleteMany();
    await Rental.deleteMany();

    console.log('Data destroyed...');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

// Run the appropriate function based on command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import data or -d to destroy data'.yellow);
  process.exit();
}
