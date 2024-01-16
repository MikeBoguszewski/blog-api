// hashPasswords.js
const bcrypt = require("bcrypt");

// Replace these with your actual usernames and passwords
const users = [
  // Add more users as needed
];

const hashPasswords = async () => {
  try {
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { username: user.username, password: hashedPassword };
      })
    );

    console.log(JSON.stringify(hashedUsers, null, 2));
  } catch (error) {
    console.error("Error hashing passwords:", error);
  }
};

hashPasswords();
