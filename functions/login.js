const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // Ensure the request is a POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the request body
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password are required' }),
      };
    }

    // Make request to Discord API
    const response = await axios.post('https://discord.com/api/v9/auth/login', {
      login: email,
      password: password,
      undelete: false,
      gift_code_sku_id: null,
      login_source: null,
      captcha_key: null,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow CORS for frontend
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: error.response?.data?.message || 'An error occurred',
      }),
    };
  }
};