const express = require('express');
const cors = require('cors');
const { trackEmailIP } = require('./backend/ipTracker.cjs');
const { classifyEmailWithAI } = require('./backend/aiClassifier.cjs');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

app.get('/api/check-email', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const apiUrl = `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`;
        console.log(`Calling: ${apiUrl}`);

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            console.error('XposedOrNot API Error:', data);
            return res.status(response.status).json({ error: data });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching from XposedOrNot:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
app.post('/api/classify-email', async (req, res) => {
    const { subject, body, headers } = req.body;

    try {
        const result = await classifyEmailWithAI(subject, body, headers || {});
        res.json({ classification: result });
    } catch (error) {
        console.error('OpenAI classification error:', error.message);
        res.status(500).json({ error: 'Failed to classify email' });
    }
});

const { trackSingleIP } = require('./backend/ipTracker.cjs');

app.post('/api/track-ip', async (req, res) => {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: 'Missing IP address' });

    try {
        const result = await trackSingleIP(ip);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'IP tracking failed' });
    }
});


app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
