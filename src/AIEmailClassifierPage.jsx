import { useState } from 'react';
import './AIEmailClassifierPage.css';
function AIEmailClassifierPage() {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [headers, setHeaders] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClassify = async () => {
        setLoading(true);
        setResult(null);

        let parsedHeaders = {};
        try {
            parsedHeaders = headers ? JSON.parse(headers) : {};
        } catch (err) {
            setResult('❌ Invalid JSON in headers');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/classify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    body,
                    headers: parsedHeaders
                })
            });

            const data = await response.json();
            if (data.classification) {
                setResult(data.classification);
            } else {
                setResult('❓ Unexpected response format');
            }
        } catch (err) {
            console.error('Client Fetch Error:', err);
            setResult('⚠️ Error contacting server');
        }

        setLoading(false);
    };

    return (
        <div className="scanner-page">
            <h2>🧠 AI Email Classifier</h2>

            <input
                type="text"
                placeholder="Email Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />

            <textarea
                rows="8"
                placeholder="Email Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />

            <textarea
                rows="6"
                placeholder='Optional: JSON headers e.g. {"from":"test@example.com"}'
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
            />

            <button onClick={handleClassify} disabled={loading}>
                {loading ? 'Classifying...' : 'Classify Email'}
            </button>

            {result && (
                <div className="result-box">
                    <strong>🧾 Classification:</strong>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}

export default AIEmailClassifierPage;
