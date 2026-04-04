import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from '../components/Camera';
import { Results } from '../components/Results';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const JEWELRY_OPTIONS = {
  women: [
    { id: 'necklace',       label: 'Necklace',       emoji: '📿' },
    { id: 'earrings',       label: 'Earrings',       emoji: '💎' },
    { id: 'bracelet',       label: 'Bracelet',       emoji: '✨' },
    { id: 'anklet',         label: 'Anklet',         emoji: '🦶' },
    { id: 'ring',           label: 'Ring',           emoji: '💍' },
    { id: 'hair_accessory', label: 'Hair Piece',     emoji: '🌸' },
  ],
  men: [
    { id: 'bracelet',    label: 'Bracelet',      emoji: '✨' },
    { id: 'necklace',    label: 'Necklace',      emoji: '📿' },
    { id: 'ring',        label: 'Ring',          emoji: '💍' },
    { id: 'keychain',    label: 'Keychain',      emoji: '🔑' },
    { id: 'watch_strap', label: 'Watch Strap',   emoji: '⌚' },
    { id: 'anklet',      label: 'Anklet',        emoji: '🦶' },
  ],
};

export default function Design() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select');
  const [gender, setGender] = useState(null);
  const [jewelryType, setJewelryType] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleCapture = async (blob) => {
    setStep('analysing');
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'face.jpg');
      formData.append('gender', gender);
      formData.append('jewelry_type', jewelryType);

      const response = await fetch(`${API_URL}/api/analyse`, {
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
    setStep('select');
    setGender(null);
    setJewelryType(null);
    setResults(null);
    setError(null);
  };

  const selectedJewelry = gender ? JEWELRY_OPTIONS[gender].find(j => j.id === jewelryType) : null;

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
          color: '#7EB3E8', fontWeight: 500, marginBottom: '8px',
        }}>Step 01</p>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: '36px',
          fontWeight: 300, color: '#E8EEFF', marginBottom: '8px',
        }}>Design Me Something</h1>
        <p style={{ fontSize: '14px', color: '#4A6A9A' }}>
          Get a personalised beaded jewelry design just for you
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner">⚠️ {error}</div>
      )}

      {/* Step 1: Select */}
      {step === 'select' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Gender */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>I am...</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['women', 'men'].map(g => (
                <button key={g} onClick={() => { setGender(g); setJewelryType(null); }}
                  style={{
                    flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer',
                    border: `1.5px solid ${gender === g ? '#7EB3E8' : 'rgba(126,179,232,0.15)'}`,
                    background: gender === g ? 'rgba(126,179,232,0.1)' : 'transparent',
                    color: gender === g ? '#E8EEFF' : '#4A6A9A',
                    fontSize: '15px', fontWeight: 500, transition: 'all 0.2s',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                  {g === 'women' ? '👩 Woman' : '👨 Man'}
                </button>
              ))}
            </div>
          </div>

          {/* Jewelry type */}
          {gender && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>I want to make...</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {JEWELRY_OPTIONS[gender].map(item => (
                  <button key={item.id} onClick={() => setJewelryType(item.id)}
                    style={{
                      padding: '14px', borderRadius: '12px', cursor: 'pointer',
                      border: `1.5px solid ${jewelryType === item.id ? '#7EB3E8' : 'rgba(126,179,232,0.15)'}`,
                      background: jewelryType === item.id ? 'rgba(126,179,232,0.1)' : 'transparent',
                      color: jewelryType === item.id ? '#E8EEFF' : '#4A6A9A',
                      fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                      fontFamily: 'DM Sans, sans-serif',
                    }}>
                    <span style={{ fontSize: '22px' }}>{item.emoji}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Continue */}
          {gender && jewelryType && (
            <button className="btn btn-primary" style={{ width: '100%' }}
              onClick={() => setStep('capture')}>
              Continue → Take Photo
            </button>
          )}
        </div>
      )}

      {/* Step 2: Camera */}
      {step === 'capture' && (
        <>
          <div style={{
            display: 'flex', gap: '8px', marginBottom: '16px',
            alignItems: 'center', flexWrap: 'wrap',
          }}>
            <span className="chip">
              {gender === 'women' ? '👩' : '👨'} {gender === 'women' ? 'Woman' : 'Man'}
            </span>
            <span className="chip">
              {selectedJewelry?.emoji} {selectedJewelry?.label}
            </span>
            <button onClick={() => setStep('select')} style={{
              background: 'none', border: 'none', color: '#4A6A9A',
              fontSize: '12px', cursor: 'pointer', textDecoration: 'underline',
              fontFamily: 'DM Sans, sans-serif',
            }}>Change</button>
          </div>
          <Camera onCapture={handleCapture} facingMode="user" />
        </>
      )}

      {/* Step 3: Analysing */}
      {step === 'analysing' && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            width: '48px', height: '48px',
            border: '2px solid rgba(126,179,232,0.2)',
            borderTop: '2px solid #7EB3E8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p style={{ color: '#7EB3E8', fontSize: '15px', marginBottom: '8px' }}>
            Analysing your features...
          </p>
          <p style={{ fontSize: '12px', color: '#4A6A9A' }}>
            Detecting face shape · Analysing skin tone · Generating your {selectedJewelry?.label} design
          </p>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 'results' && results && (
        <>
          <Results data={results} mode="design" />
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={reset}>
              ↩ New Design
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }}
              onClick={() => navigate('/tryon')}>
              🪞 Try It On
            </button>
          </div>
        </>
      )}
    </div>
  );
}