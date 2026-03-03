const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/spacedey?authSource=admin';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

const DEFAULT_USERS = [
  {
    email: 'admin@spacedey.com',
    password: 'admin123456', // Change this in production!
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isAdmin: true,
  },
  {
    email: 'user@spacedey.com',
    password: 'user123456', // Change this in production!
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    isAdmin: false,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing users
    const existingUsers = await User.find({});
    if (existingUsers.length > 0) {
      console.log(`Found ${existingUsers.length} existing users. Checking for defaults...`);
    }

    // Check and create default users
    for (const userData of DEFAULT_USERS) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`✓ User ${userData.email} already exists`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();
      console.log(`✓ Created user: ${userData.email}`);
    }

    console.log('\n✅ Database seeding completed!');
    console.log('\nDefault Users:');
    console.log('─────────────────────────────────');
    console.log('Admin:');
    console.log('  Email: admin@spacedey.com');
    console.log('  Password: admin123456');
    console.log('\nRegular User:');
    console.log('  Email: user@spacedey.com');
    console.log('  Password: user123456');
    console.log('─────────────────────────────────');
    console.log('⚠️  IMPORTANT: Change these passwords in production!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
