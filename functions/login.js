const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // Ensure the request is a POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the request body
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Email and password are required' }),
      };
    }

    // Encode X-Super-Properties (base64-encoded browser properties)
    const superProperties = Buffer.from(
      JSON.stringify({
        os: 'Windows',
        browser: 'Chrome',
        device: '',
        system_locale: 'en-US',
        browser_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        browser_version: '91.0.4472.124',
        os_version: '10',
        referrer: '',
        referring_domain: '',
        referrer_current: '',
        referring_domain_current: '',
        release_channel: 'stable',
        client_build_number: 123456,
        client_event_source: null,
      })
    ).toString('base64');

    // Make request to Discord API
    const response = await axios.post('https://discord.com/api/v9/auth/login', {
      login: email,
      password: password,
      undelete: false,
      gift_code_sku_id: null,
      login_source: null,
      captcha_key: null,
      source: 'login', // Added to match Discord's expected payload
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'X-Super-Properties': superProperties,
        'Accept': '*/*',
        'Accept-Language': 'en-US',
        'Origin': 'https://discord.com',
        'Referer': 'https://discord.com/login',
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    // Detailed error logging
    const errorDetails = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.error('Login error:', JSON.stringify(errorDetails, null, 2));
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
