const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { date, name, message } = req.body;

    if (!date || !name || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf6s_uZDG-bOzhGPz9lt8W-TUJGKngxaZObOK9yhrsAIhZJGA/formResponse';

    const formData = new URLSearchParams();
    formData.append('entry.1178573611', date);
    formData.append('entry.1117559273', name);
    formData.append('entry.1902715667', message);

    const response = await fetch(formUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
      },
      body: formData.toString()
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      return res.status(500).json({ error: 'Form submission failed', details: errorText });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
