const axios = require('axios');
require('dotenv').config();

async function listModels() {
  try {
    const res = await axios.get('https://generativelanguage.googleapis.com/v1/models', {
      params: { key: process.env.GEMINI_API_KEY }
    });
    console.log('Desteklenen Modeller:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Model listeleme hatası:', err.response?.data || err.message);
  }
}

listModels();
