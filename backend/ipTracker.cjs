const dotenv = require('dotenv');
dotenv.config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const API_KEY = process.env.WHATISMYIP_KEY;

function isPrivateIP(ip) {
    return (
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        ip.startsWith('172.') && (parseInt(ip.split('.')[1]) >= 16 && parseInt(ip.split('.')[1]) <= 31)
    );
}

async function fetchIPInfo(ip) {
    const url = `https://api.whatismyip.com/ip-address-lookup.php?key=${API_KEY}&input=${ip}&output=json`;

    try {
        const response = await fetch(url);
        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            return { ip, error: 'Non-JSON response', raw: text };
        }

        const info = data?.ip_address_lookup?.[0];
        if (!info || info.status !== 'ok') {
            return { ip, error: 'IP lookup failed', message: info?.message || 'Unknown issue' };
        }

        const isPrivate = isPrivateIP(ip);

        return {
            ip,
            isPrivate,
            country: info.country || 'Unavailable',
            city: info.city || 'Unavailable',
            region: info.region || 'Unavailable',
            timezone: info.time || 'Unavailable',
            isp: info.isp || 'Unavailable',
            caution: isPrivate ? '⚠️ This is a private/local IP and does not represent a public location.' : undefined
        };
    } catch (err) {
        return { ip, error: 'Network error', message: err.message };
    }
}



async function trackSingleIP(ip) {
    return await fetchIPInfo(ip);
}

module.exports = { trackSingleIP };

