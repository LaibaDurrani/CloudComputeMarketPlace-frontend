# CloudComputeMarketPlace Mass Data Seeder

This tool helps you populate your CloudComputeMarketPlace database with thousands of realistic data entries for testing, development, and presentation purposes.

## What It Does

The mass data seeder creates:

- **Users**: Both buyers and sellers with realistic profiles
- **Computer Listings**: Diverse computing resources with detailed specifications
- **Rentals**: Historical and active rental records between users
- **Conversations**: Communication threads between buyers and sellers
- **Messages**: Realistic message exchanges within conversations

## Prerequisites

Before running the seeder, ensure you have:

1. Node.js installed (v14+ recommended)
2. MongoDB connection set up in your backend `.env` file
3. The CloudComputeMarketPlace backend dependencies installed

## Installation

The seeder requires two additional packages:

```bash
cd CloudComputeMarketPlace-backend
npm install @faker-js/faker cli-progress
```

## Usage

There are two ways to run the mass data seeder:

### 1. Using the Interactive Script (Recommended)

From the root project directory, run:

```bash
node seed-mass-data.js
```

Follow the prompts to configure:
- Number of users
- Computers per seller
- Number of rentals
- Number of conversations
- Number of messages

The script will provide estimates and ask for confirmation before proceeding.

### 2. Using Direct Command

Run directly from the backend directory:

```bash
# Use default configuration (500 users, etc.)
npm run seed:mass

# Use environment variables to configure
SEED_USERS=1000 SEED_COMPUTERS_PER_SELLER=10 npm run seed:mass
```

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| SEED_USERS | 500 | Number of users to create |
| SEED_COMPUTERS_PER_SELLER | 8 | Average number of computers per seller |
| SEED_RENTALS_FACTOR | 5 | Average number of rentals per computer |
| SEED_CONVERSATIONS_FACTOR | 3 | Average conversations per computer |
| SEED_MESSAGES_PER_CONVO | 15 | Average messages per conversation |

## Warning

- This script will **delete all existing data** in your database before creating new records.
- Generating large amounts of data may take several minutes to complete.
- For very large datasets (10,000+ users), ensure your system has sufficient memory.

## Example Output

```
===============================================
  CLOUDCOMPUTEMARKETPLACE MASS DATA SEEDER
===============================================
This script will generate:
- 500 users
- ~2800 computer listings
- ~14000 rentals
- ~8400 conversations
- ~126000 messages

✓ Data generation complete!

Summary:
- 501 users created
- 2843 computer listings created
- 14109 rentals created
- 8367 conversations created
- 125893 messages created
```
