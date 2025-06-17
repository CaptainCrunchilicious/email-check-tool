const dotenv = require('dotenv');
dotenv.config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const API_KEY = process.env.OPENROUTER_API_KEY;

async function classifyEmailWithAI(subject, body, headers = {}) {
    const prompt = `You are a cybersecurity assistant. Analyze the following email:
Subject: ${subject}
Body: ${body}
Headers: ${JSON.stringify(headers)}

Decide if this email is:
1. A phishing or scam attempt
2. A spam or marketing email
3. A legitimate and safe message

Reply with only one of these:
- "Phishing or Scam"
- "Spam or Marketing"
- "Safe / Legitimate"
`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages: [
                    { role: 'system', content: 'You are an AI security assistant.' },
                    { role: 'user', content: prompt }
                ]
            })
        });

        const json = await response.json();

        if (
            json &&
            json.choices &&
            json.choices[0] &&
            json.choices[0].message &&
            json.choices[0].message.content
        ) {
            return json.choices[0].message.content.trim();
        }

        return '❓ Unknown response structure';
    } catch (error) {
        console.error('OpenRouter Error:', error);
        return '⚠️ AI classification failed';
    }
}

module.exports = { classifyEmailWithAI };
