const axios = require('axios');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

// Root route to welcome the user
app.get('/', (req, res) => {
  res.send(
    'Welcome to the Codeforces API! Use /user-details/{username} to get user data from Codeforces.'
  );
});

// Custom API endpoint to fetch user details from Codeforces API
app.get('/user-details/:username', async (req, res) => {
  const username = req.params.username;

  try {
    // Fetch user details from Codeforces API
    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );

    const userData = response.data.result[0]; // User details are in the result array

    if (!userData) {
      return res.status(404).json({
        error: 'User not found or invalid username',
      });
    }

    // Extracting required data from response
    const userDetails = {
      username: userData.handle,
      userRank: userData.rank || 'N/A',
      rating: userData.rating || 'N/A',
      maxRating: userData.maxRating || 'N/A',
      contribution: userData.contribution || 'N/A',
      friendsCount: userData.friendOfCount || 'N/A',
    };

    // Return JSON response with user data
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching data from Codeforces API:', error);
    res.status(500).json({
      error: 'Failed to fetch user data. Please try again later.',
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
