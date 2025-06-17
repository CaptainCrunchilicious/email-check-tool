import { useState } from 'react';
import './styles.css';

const APILAYER_API_KEY = import.meta.env.VITE_APILAYER_API_KEY;

const validateEmailDetails = async (email) => {
  if (!APILAYER_API_KEY) {
    throw new Error('API key not configured. Please check your .env file.');
  }

  const res = await fetch(`https://api.apilayer.com/email_verification/check?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      apikey: APILAYER_API_KEY,
    }
  });

  if (!res.ok) {
    throw new Error(`Email validation API failed with status ${res.status}`);
  }

  return await res.json();
};

const checkEmailBreach = async (email) => {
  const res = await fetch(`http://localhost:3001/api/check-email?email=${encodeURIComponent(email)}`);
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error(`Invalid JSON received from backend: ${text}`);
  }

  if (json.Error === 'Not found') {
    return {
      status: 'Not found',
      BreachCount: 0,
      Sources: [],
    };
  }

  if (!res.ok) {
    console.error('API response text:', text);
    throw new Error(`API request failed with status ${res.status}`);
  }

  return {
    status: 'success',
    ...json,
  };
};


function HomePage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [breachResult, setBreachResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckEmail = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setBreachResult(null);
    setValidationResult(null);

    try {
      const [breach, validation] = await Promise.all([
        checkEmailBreach(email),
        validateEmailDetails(email)
      ]);

      setBreachResult(breach);
      setValidationResult(validation);
    } catch (err) {
      setError('Failed to validate or check breach status. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBreachResult = () => {
    if (!breachResult) return null;

    if (breachResult.status === 'Not found') {
      return (
        <div className="result-item">
          <strong>Status:</strong> ✅ Your email was not found in any known data breaches.
        </div>
      );
    }

    return (
      <>
        <div className="result-item">
          <strong>Status:</strong> ⚠️ Your email was found in a data breach.
        </div>
        {breachResult.BreachCount !== undefined && (
          <div className="result-item">
            <strong>Breach Count:</strong> {breachResult.BreachCount}
          </div>
        )}
        {breachResult.Sources && breachResult.Sources.length > 0 && (
          <div className="result-item">
            <strong>Sources:</strong> {breachResult.Sources.join(', ')}
          </div>
        )}
      </>
    );
  };

  const renderValidationResult = () => {
    if (!validationResult) return null;

    return (
      <>
        <div className="result-item">
          <strong>Format Valid:</strong> {validationResult.format_valid ? '✅ Yes' : '❌ No'}
        </div>
        <div className="result-item">
          <strong>MX Record Found:</strong> {validationResult.mx_found ? '✅ Yes' : '❌ No'}
        </div>
        <div className="result-item">
          <strong>SMTP Check:</strong> {validationResult.smtp_check ? '✅ Passed' : '❌ Failed'}
        </div>
        <div className="result-item">
          <strong>Disposable Email:</strong> {validationResult.disposable ? '⚠️ Yes' : '✅ No'}
        </div>
        <div className="result-item">
          <strong>Role-based Email:</strong> {validationResult.role ? '⚠️ Yes' : '✅ No'}
        </div>
        <div className="result-item">
          <strong>Free Email Provider:</strong> {validationResult.free ? '📧 Yes' : '💼 No'}
        </div>
        {validationResult.did_you_mean && (
          <div className="result-item">
            <strong>Did you mean:</strong> {validationResult.did_you_mean}
          </div>
        )}

      </>
    );
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1>Email Breach & Validation Checker</h1>
        <p>Check if your email is valid and whether it has been involved in a data breach.</p>

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
            {isLoading ? 'Checking...' : 'Check Now'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {(breachResult || validationResult) && (
          <div className="result-container">
            <h3>Results for {email}:</h3>
            <div className="result-details">
              {renderBreachResult()}
              <hr />
              {renderValidationResult()}
            </div>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Why use our extension?</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Breach Detection</h3>
            <p>Find out if your email was leaked in any known breaches</p>
          </div>
          <div className="card">
            <h3>Email Format & SMTP Check</h3>
            <p>Get detailed insights into email validity and server availability</p>
          </div>
          <div className="card">
            <h3>Disposable Detection</h3>
            <p>Identify temporary or throwaway email addresses</p>
          </div>
          <div className="card">
            <h3>Domain & Role Check</h3>
            <p>Ensure the email domain and user type are suitable for registration or contact</p>
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
