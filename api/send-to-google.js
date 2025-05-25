export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, name, message } = req.body;

  if (!date || !name || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf6s_uZDG-bOzhGPz9lt8W-TUJGKngxaZObOK9yhrsAIhZJGA/formResponse';

  const formData = new URLSearchParams();
  formData.append('entry.1178573611', date);      // Data
  formData.append('entry.1117559273', name);      // Nome paziente
  formData.append('entry.1902715667', message);   // Messaggio

  try {
    const response = await fetch(formUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
      },
      body: formData.toString(),
    });

    if (response.ok || response.status === 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      return res.status(500).json({ error: 'Form submission failed', details: errorText });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Request failed', details: error.message });
  }
}
