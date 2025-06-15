import { useState } from 'react';
import './styles.css';

const APILAYER_API_KEY = import.meta.env.VITE_APILAYER_API_KEY;

console.log('Environment variable:', import.meta.env.VITE_APILAYER_API_KEY);
console.log('Using API Key:', APILAYER_API_KEY ? 'Yes' : 'No');

async function validateEmail(email) {
  if (!APILAYER_API_KEY) {
    throw new Error('API key not configured. Please check your .env file.');
  }

  const res = await fetch(`https://api.apilayer.com/email_verification/check?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "apikey": APILAYER_API_KEY,
    }
  });
  
  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  
  return await res.json();
}

function HomePage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckEmail = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const validationResult = await validateEmail(email);
      setResult(validationResult);
    } catch (err) {
      setError('Failed to validate email. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = (result) => {
    if (!result) return null;

    return (
      <div className="result-container">
        <h3>Validation Results for {email}:</h3>
        <div className="result-details">
          
          {result.format_valid !== undefined && (
            <div className="result-item">
              <strong>Format Valid:</strong> {result.format_valid ? '✅ Yes' : '❌ No'}
            </div>
          )}
          {result.mx_found !== undefined && (
            <div className="result-item">
              <strong>MX Record Found:</strong> {result.mx_found ? '✅ Yes' : '❌ No'}
            </div>
          )}
          {result.smtp_check !== undefined && (
            <div className="result-item">
              <strong>SMTP Check:</strong> {result.smtp_check ? '✅ Passed' : '❌ Failed'}
            </div>
          )}
          {result.disposable !== undefined && (
            <div className="result-item">
              <strong>Disposable Email:</strong> {result.disposable ? '⚠️ Yes' : '✅ No'}
            </div>
          )}
          {result.role !== undefined && (
            <div className="result-item">
              <strong>Role-based Email:</strong> {result.role ? '⚠️ Yes' : '✅ No'}
            </div>
          )}
          {result.free !== undefined && (
            <div className="result-item">
              <strong>Free Email Provider:</strong> {result.free ? '📧 Yes' : '💼 No'}
            </div>
          )}
          
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1>Email Validation Checker</h1>
        <p>Verify your email address format, domain validity, and detect potential issues.</p>

        <div className="email-checker">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="email-input"
            onKeyPress={(e) => e.key === 'Enter' && handleCheckEmail()}
          />
          <button 
            onClick={handleCheckEmail}
            disabled={isLoading}
            className="button"
          >
            {isLoading ? 'Validating...' : 'Validate Email'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {renderResult(result)}
      </div>

      <div className="features-section">
        <h2>Why use our extension?</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Email Verification</h3>
            <p>Validates email format and verifies domain mail servers</p>
          </div>
          <div className="card">
            <h3>Domain Check</h3>
            <p>Verifies if the email domain has valid MX records</p>
          </div>
          <div className="card">
            <h3>Disposable Email Detection</h3>
            <p>Identifies temporary or disposable email addresses</p>
          </div>
          <div className="card">
            <h3>SMTP Validation</h3>
            <p>Performs real-time SMTP checks for email deliverability</p>
          </div>
        </div>

        <div className="center">
          <button className="button" onClick={() => onNavigate('features')}>
            Learn more about all features
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;