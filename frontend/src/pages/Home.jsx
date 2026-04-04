import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [expanding, setExpanding] = useState(null);

  const handleClick = (mode) => {
    setExpanding(mode);
    setTimeout(() => {
      navigate(`/${mode === 'design' ? 'design' : 'tryon'}`);
    }, 600);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#060D1F',
    }}>

      {/* Split screen */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>

        {/* Left — Design */}
        <div
          onClick={() => handleClick('design')}
          style={{
            flex: expanding === 'design' ? 4 : expanding === 'tryon' ? 0 : 1,
            background: '#060D1F',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '0 10%',
            minHeight: '100%',
            cursor: 'pointer',
            transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            opacity: expanding === 'tryon' ? 0 : 1,
            position: 'relative',
            overflow: 'hidden',
            borderRight: '1px solid rgba(126,179,232,0.08)',
          }}
        >
          {/* Decorative rings */}
          <div style={{
            position: 'absolute', top: '-40px', left: '-40px',
            width: '180px', height: '180px', borderRadius: '50%',
            border: '1px solid rgba(126,179,232,0.08)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', right: '-60px',
            width: '240px', height: '240px', borderRadius: '50%',
            border: '1px solid rgba(126,179,232,0.06)',
            pointerEvents: 'none',
          }} />

          {/* Content wrapper */}
          <div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  zIndex: 1,
  maxWidth: '360px',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: '10%',
}}>
            <div>
              <p style={{
                fontSize: '10px', letterSpacing: '3px',
                textTransform: 'uppercase', color: '#7EB3E8',
                fontWeight: 500, marginBottom: '24px',
                animation: 'fadeUp 0.6s ease both',
              }}>
                Step 01
              </p>
              <div style={{
                fontSize: '48px', marginBottom: '20px',
                animation: 'fadeUp 0.6s ease 0.1s both',
              }}>
                🎨
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '40px', fontWeight: 300,
                color: '#E8EEFF', lineHeight: 1.1,
                marginBottom: '16px',
                animation: 'fadeUp 0.6s ease 0.15s both',
              }}>
                Design<br />Me<br />Something
              </h2>
              <p style={{
                fontSize: '13px', color: '#4A6A9A',
                lineHeight: 1.7,
                animation: 'fadeUp 0.6s ease 0.2s both',
              }}>
                Camera-based AI jewelry design tailored to your face shape, skin tone & colouring
              </p>
            </div>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              animation: 'fadeUp 0.6s ease 0.25s both',
            }}>
              {['Face Analysis', 'Skin Tone', 'Tutorial'].map(tag => (
                <span key={tag} style={{
                  fontSize: '10px', padding: '5px 12px',
                  background: 'rgba(126,179,232,0.08)',
                  color: '#7EB3E8', borderRadius: '99px',
                  border: '1px solid rgba(126,179,232,0.2)',
                  letterSpacing: '0.5px',
                }}>{tag}</span>
              ))}
            </div>

            <p style={{
              fontSize: '11px', color: '#7EB3E8',
              fontWeight: 500, letterSpacing: '1px',
              animation: 'fadeUp 0.6s ease 0.3s both',
            }}>
              Tap to begin →
            </p>
          </div>
        </div>

        {/* Right — Try On */}
        <div
          onClick={() => handleClick('tryon')}
          style={{
            flex: expanding === 'tryon' ? 4 : expanding === 'design' ? 0 : 1,
            background: '#0B1C3D',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '0 10%',
            minHeight: '100%',
            cursor: 'pointer',
            transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            opacity: expanding === 'design' ? 0 : 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative rings */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '180px', height: '180px', borderRadius: '50%',
            border: '1px solid rgba(168,200,240,0.08)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '-60px',
            width: '240px', height: '240px', borderRadius: '50%',
            border: '1px solid rgba(168,200,240,0.05)',
            pointerEvents: 'none',
          }} />

          {/* Content wrapper */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            zIndex: 1,
            maxWidth: '360px',
          }}>
            <div>
              <p style={{
                fontSize: '10px', letterSpacing: '3px',
                textTransform: 'uppercase', color: '#A8C8F0',
                fontWeight: 500, marginBottom: '24px',
                animation: 'fadeUp 0.6s ease 0.05s both',
              }}>
                Step 02
              </p>
              <div style={{
                fontSize: '48px', marginBottom: '20px',
                animation: 'fadeUp 0.6s ease 0.15s both',
              }}>
                🪞
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '40px', fontWeight: 300,
                color: '#E8EEFF', lineHeight: 1.1,
                marginBottom: '16px',
                animation: 'fadeUp 0.6s ease 0.2s both',
              }}>
                How Does<br />This<br />Look?
              </h2>
              <p style={{
                fontSize: '13px', color: '#4A6A9A',
                lineHeight: 1.7,
                animation: 'fadeUp 0.6s ease 0.25s both',
              }}>
                Wear your creation and get honest AI feedback — plus your next design idea
              </p>
            </div>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              animation: 'fadeUp 0.6s ease 0.3s both',
            }}>
              {['Style Rating', 'Feedback', 'Next Design'].map(tag => (
                <span key={tag} style={{
                  fontSize: '10px', padding: '5px 12px',
                  background: 'rgba(168,200,240,0.08)',
                  color: '#A8C8F0', borderRadius: '99px',
                  border: '1px solid rgba(168,200,240,0.2)',
                  letterSpacing: '0.5px',
                }}>{tag}</span>
              ))}
            </div>

            <p style={{
              fontSize: '11px', color: '#A8C8F0',
              fontWeight: 500, letterSpacing: '1px',
              animation: 'fadeUp 0.6s ease 0.35s both',
            }}>
              Tap to begin →
            </p>
          </div>
        </div>
      </div>

      {/* Brand footer */}
      <div style={{
        background: '#7EB3E8',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <div style={{ height: '1px', flex: 1, background: 'rgba(6,13,31,0.15)' }} />
        <p style={{
          fontSize: '11px', letterSpacing: '4px',
          textTransform: 'uppercase', color: '#060D1F',
          fontWeight: 500, margin: 0,
        }}>
          Beadazzled ✦
        </p>
        <div style={{ height: '1px', flex: 1, background: 'rgba(6,13,31,0.15)' }} />
      </div>
    </div>
  );
}