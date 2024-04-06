const axios = require('axios')

const clerkAuthMiddleware = async (req, res, next) => {
  // Check if the request contains the authentication token
  console.log(req.headers)
  const authToken = req.headers.authorization;

  

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized: Missing authentication token' });
  }

  try {
    // Verify the authentication token with Clerk's authentication service
    const clerkResponse = await axios.get('https://api.clerk.io/v1/session/me', {
      headers: {
        Authorization: authToken,
      },
    });

    if (clerkResponse.data.user_id) {
      // If the authentication is successful, attach the user ID to the request
      req.userId = clerkResponse.data.user_id;
      next(); // Continue to the next middleware or route handler
    } else {
      return res.status(401).json({ message: 'Unauthorized: Invalid authentication token' });
    }
  } catch (error) {
    // Handle any errors that occur during the authentication process
    console.error('Error verifying authentication token:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = clerkAuthMiddleware;
