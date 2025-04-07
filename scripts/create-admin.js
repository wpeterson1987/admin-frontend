// scripts/create-admin.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Admin user details
    const adminDetails = {
      name: 'Warren',
      email: 'wpeterson1987@gmail.com',
      password: bcrypt.hashSync('123Se$$ion45%', 10),
      role: 'admin'
    };
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email: adminDetails.email } });
    
    if (existingUser) {
      console.log('Admin user already exists. Updating password and role...');
      existingUser.password = adminDetails.password;
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('Admin user updated successfully!');
    } else {
      // Create new admin user
      await User.create(adminDetails);
      console.log('Admin user created successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();