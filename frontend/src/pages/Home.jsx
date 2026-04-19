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

  const halfStyle = (mode, bg) => ({
    flex: expanding === mode ? 4 : expanding && expanding !== mode ? 0 : 1,
    background: bg,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '0 6%',
    paddingTop: '12vh',
    paddingBottom: '6vh',
    cursor: 'pointer',
    transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
    opacity: expanding && expanding !== mode ? 0 : 1,
    position: 'relative',
    overflow: 'hidden',
  });

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
        <div onClick={() => handleClick('design')} style={halfStyle('design', '#060D1F')}>
          
          {/* Decorative rings */}
          <div style={{
            position: 'absolute', top: '-40px', left: '-40px',
            width: '180px', height: '180px', borderRadius: '50%',
            border: '1px solid rgba(126,179,232,0.08)', pointerEvents: 'none',
          }} />

          {/* Top section — label + icon + title */}
          <div>
            <p style={{
              fontSize: '10px', letterSpacing: '3px',
              textTransform: 'uppercase', color: '#7EB3E8',
              fontWeight: 500, marginBottom: '20px',
            }}>
              Step 01
            </p>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>🎨</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: 300, color: '#E8EEFF',
              lineHeight: 1.1, marginBottom: '14px',
            }}>
              Design<br />Me<br />Something
            </h2>
            <p style={{
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              color: '#4A6A9A', lineHeight: 1.6,
            }}>
              Camera-based jewelry design tailored to your face shape, skin tone & colouring
            </p>
          </div>

          {/* Bottom section — tags + cta */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {['Face Analysis', 'Skin Tone', 'Tutorial'].map(tag => (
                <span key={tag} style={{
                  fontSize: '10px', padding: '4px 10px',
                  background: 'rgba(126,179,232,0.08)',
                  color: '#7EB3E8', borderRadius: '99px',
                  border: '1px solid rgba(126,179,232,0.2)',
                  letterSpacing: '0.5px', whiteSpace: 'nowrap',
                }}>{tag}</span>
              ))}
            </div>
            <p style={{
              fontSize: '11px', color: '#7EB3E8',
              fontWeight: 500, letterSpacing: '1px',
            }}>
              Tap to begin →
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          background: 'rgba(126,179,232,0.08)',
          flexShrink: 0,
        }} />

        {/* Right — Try On */}
        <div onClick={() => handleClick('tryon')} style={halfStyle('tryon', '#0B1C3D')}>

          {/* Decorative rings */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '180px', height: '180px', borderRadius: '50%',
            border: '1px solid rgba(168,200,240,0.08)', pointerEvents: 'none',
          }} />

          {/* Top section — label + icon + title */}
          <div>
            <p style={{
              fontSize: '10px', letterSpacing: '3px',
              textTransform: 'uppercase', color: '#A8C8F0',
              fontWeight: 500, marginBottom: '20px',
            }}>
              Step 02
            </p>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>🪞</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: 300, color: '#E8EEFF',
              lineHeight: 1.1, marginBottom: '14px',
            }}>
              How Does<br />This<br />Look?
            </h2>
            <p style={{
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              color: '#4A6A9A', lineHeight: 1.6,
            }}>
              Wear your creation or existing jewelry and get honest AI feedback — plus your next design idea
            </p>
          </div>

          {/* Bottom section — tags + cta */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {['Style Rating', 'Feedback', 'Next Design'].map(tag => (
                <span key={tag} style={{
                  fontSize: '10px', padding: '4px 10px',
                  background: 'rgba(168,200,240,0.08)',
                  color: '#A8C8F0', borderRadius: '99px',
                  border: '1px solid rgba(168,200,240,0.2)',
                  letterSpacing: '0.5px', whiteSpace: 'nowrap',
                }}>{tag}</span>
              ))}
            </div>
            <p style={{
              fontSize: '11px', color: '#A8C8F0',
              fontWeight: 500, letterSpacing: '1px',
            }}>
              Tap to begin →
            </p>
          </div>
        </div>
      </div>

      {/* Brand footer */}
      <div style={{
        background: '#7EB3E8',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexShrink: 0,
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