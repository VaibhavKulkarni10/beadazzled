import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from '../components/Camera';
import { Results } from '../components/Results';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function TryOn() {
  const navigate = useNavigate();
  const [step, setStep] = useState('capture');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleCapture = async (blob) => {
    setStep('analysing');
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'tryon.jpg');
      formData.append('face_shape', 'Unknown');
      formData.append('skin_tone', 'Unknown');
      formData.append('undertone', 'Unknown');

      const response = await fetch(`${API_URL}/api/tryon`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Analysis failed');
      }

      const data = await response.json();
      setResults(data);
      setStep('results');
    } catch (err) {
      setError(err.message);
      setStep('capture');
    }
  };

  const reset = () => {
    setStep('capture');
    setResults(null);
    setError(null);
  };

  return (
    <div className="page">

      {/* Back button */}
      <button onClick={() => navigate('/')} style={{
        background: 'none', border: 'none', color: '#7EB3E8',
        fontSize: '14px', cursor: 'pointer', padding: '0 0 24px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        ← Back
      </button>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{
          fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
          color: '#A8C8F0', fontWeight: 500, marginBottom: '8px',
        }}>Step 02</p>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: '36px',
          fontWeight: 300, color: '#E8EEFF', marginBottom: '8px',
        }}>How Does This Look?</h1>
        <p style={{ fontSize: '14px', color: '#4A6A9A' }}>
          Put on your jewelry and get honest AI feedback
        </p>
      </div>

      {/* Error */}
      {error && <div className="error-banner">⚠️ {error}</div>}

      {/* Tips */}
      {step === 'capture' && (
        <div style={{
          background: 'rgba(168,200,240,0.06)',
          border: '1px solid rgba(168,200,240,0.15)',
          borderRadius: '12px', padding: '16px', marginBottom: '20px',
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
            color: '#A8C8F0', fontWeight: 500, marginBottom: '10px',
          }}>💡 For best results</p>
          <ul style={{ paddingLeft: '16px', margin: 0 }}>
            {[
              'Make sure your jewelry is clearly visible',
              'Use good lighting',
              'Face the camera straight on',
            ].map((tip, i) => (
              <li key={i} style={{ fontSize: '13px', color: '#4A6A9A', marginBottom: '4px' }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Camera */}
      {step === 'capture' && (
        <Camera onCapture={handleCapture} facingMode="user" />
      )}

      {/* Analysing */}
      {step === 'analysing' && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            width: '48px', height: '48px',
            border: '2px solid rgba(168,200,240,0.2)',
            borderTop: '2px solid #A8C8F0',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p style={{ color: '#A8C8F0', fontSize: '15px', marginBottom: '8px' }}>
            Evaluating your look...
          </p>
          <p style={{ fontSize: '12px', color: '#4A6A9A' }}>
            Claude Vision is analysing how your jewelry suits you
          </p>
        </div>
      )}

      {/* Results */}
      {step === 'results' && results && (
        <>
          <Results data={results} mode="tryon" />
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={reset}>
              ↩ Try Another
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }}
              onClick={() => navigate('/design')}>
              🎨 New Design
            </button>
          </div>
        </>
      )}
    </div>
  );
}