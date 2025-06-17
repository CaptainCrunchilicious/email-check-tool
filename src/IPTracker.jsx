import { useState } from 'react';

function IPTrackerPage() {
    const [ip, setIp] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async () => {
        setResult(null);
        setLoading(true);

        const isValidIP = (ip) => {
            const parts = ip.trim().split('.');
            if (parts.length !== 4) return false;
            return parts.every(part => {
                const num = Number(part);
                return !isNaN(num) && num >= 0 && num <= 255;
            });
        };

        if (!isValidIP(ip)) {
            setResult({ error: '❌ Please enter a valid IP address' });
            setLoading(false);
            return;
        }


        try {
            const res = await fetch('http://localhost:3001/api/track-ip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip: ip.trim() })
            });

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setResult({ error: '⚠️ Error contacting server' });
        }

        setLoading(false);
    };

    return (
        <div className="scanner-page">
            <h2>🌍 IP Tracker</h2>
            <input
                type="text"
                placeholder='Enter a single IP address (e.g. 8.8.8.8)'
                value={ip}
                onChange={(e) => setIp(e.target.value)}
            />
            <button onClick={handleTrack} disabled={loading}>
                {loading ? 'Tracking...' : 'Track IP'}
            </button>

            {result && (
                <div className="result-box">
                    {result.error ? (
                        <p>{result.error}</p>
                    ) : (
                        <>
                            <h4>🧾 IP: {result.ip}</h4>
                            <p><strong>Country:</strong> {result.country}</p>
                            <p><strong>Region:</strong> {result.region}</p>
                            <p><strong>City:</strong> {result.city}</p>
                            <p><strong>ISP:</strong> {result.isp}</p>
                            <p><strong>Timezone:</strong> {result.timezone}</p>
                            {result.caution && (
                                <p style={{ color: 'orange' }}><strong>{result.caution}</strong></p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default IPTrackerPage;
