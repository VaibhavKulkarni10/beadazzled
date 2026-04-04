import ReactMarkdown from 'react-markdown';

export function Results({ data, mode }) {
  if (!data) return null;

  return (
    <div style={{ marginTop: '8px' }}>

      {/* Chips */}
      {mode === 'design' && data.face && data.skin && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span className="chip">💎 {data.face.face_shape}</span>
          <span className="chip">🎨 {data.skin.skin_tone}</span>
          <span className="chip">✨ {data.skin.undertone} undertone</span>
        </div>
      )}

      {/* Skin swatch */}
      {mode === 'design' && data.skin?.avg_rgb && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          marginBottom: '20px', padding: '14px 16px',
          background: 'rgba(126,179,232,0.06)',
          borderRadius: '12px', border: '1px solid rgba(126,179,232,0.12)',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
            background: `rgb(${data.skin.avg_rgb[0]}, ${data.skin.avg_rgb[1]}, ${data.skin.avg_rgb[2]})`,
            border: '2px solid rgba(126,179,232,0.2)',
          }} />
          <div>
            <p style={{ color: '#E8EEFF', fontSize: '14px', fontWeight: 500, margin: 0 }}>
              Your skin tone
            </p>
            <p style={{ fontSize: '12px', margin: 0, color: '#4A6A9A' }}>
              {data.skin.undertone_description}
            </p>
          </div>
        </div>
      )}

      {/* Colour palette */}
      {data.colour_palette && data.colour_palette.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
            color: '#7EB3E8', fontWeight: 500, marginBottom: '14px',
          }}>🎨 Your Bead Colour Palette</p>
          <div className="card">
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {data.colour_palette.map((hex, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: hex,
                    border: '2px solid rgba(126,179,232,0.15)',
                    marginBottom: '6px',
                    boxShadow: `0 4px 12px ${hex}44`,
                  }} />
                  <p style={{
                    fontSize: '9px', margin: 0, color: '#4A6A9A',
                    fontFamily: 'monospace', letterSpacing: '0.5px',
                  }}>{hex}</p>
                </div>
              ))}
            </div>
            <div style={{
              height: '20px', borderRadius: '10px',
              background: `linear-gradient(to right, ${data.colour_palette.join(', ')})`,
              border: '1px solid rgba(126,179,232,0.1)',
            }} />
            <p style={{
              fontSize: '11px', color: '#4A6A9A', marginTop: '10px',
              textAlign: 'center',
            }}>
              Use these colours when shopping for beads
            </p>
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <p style={{
          fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
          color: '#7EB3E8', fontWeight: 500, marginBottom: '16px',
        }}>
          {mode === 'design' ? '💍 Your Personalised Design' : '✨ Style Feedback'}
        </p>
        <div style={{ color: '#A8C8F0', lineHeight: '1.7', fontSize: '15px' }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h2 style={{ color: '#7EB3E8', margin: '16px 0 8px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '22px' }}>{children}</h2>,
              h2: ({ children }) => <h3 style={{ color: '#7EB3E8', margin: '16px 0 8px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '20px' }}>{children}</h3>,
              h3: ({ children }) => <p style={{ color: '#7EB3E8', fontWeight: 500, margin: '12px 0 4px', fontSize: '13px', letterSpacing: '0.5px' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: '#E8EEFF' }}>{children}</strong>,
              ul: ({ children }) => <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>{children}</ul>,
              li: ({ children }) => <li style={{ margin: '4px 0', color: '#A8C8F0' }}>{children}</li>,
              p: ({ children }) => <p style={{ margin: '8px 0', color: '#A8C8F0' }}>{children}</p>,
            }}
          >
            {mode === 'design' ? data.recommendation : data.feedback}
          </ReactMarkdown>
        </div>
      </div>

      {/* Measurements */}
      {mode === 'design' && data.face?.measurements && (
        <details style={{
          background: 'rgba(126,179,232,0.04)',
          border: '1px solid rgba(126,179,232,0.1)',
          borderRadius: '12px', padding: '12px 16px',
        }}>
          <summary style={{
            cursor: 'pointer', color: '#4A6A9A', fontSize: '12px',
            fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase',
            listStyle: 'none',
          }}>
            📐 View face measurements
          </summary>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '8px', marginTop: '12px',
          }}>
            {Object.entries(data.face.measurements).map(([key, value]) => (
              <div key={key} style={{
                background: 'rgba(126,179,232,0.06)',
                borderRadius: '8px', padding: '10px 12px',
              }}>
                <p style={{ fontSize: '10px', margin: 0, color: '#4A6A9A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {key.replace(/_/g, ' ')}
                </p>
                <p style={{ fontSize: '18px', fontWeight: 500, color: '#E8EEFF', margin: 0 }}>
                  {value}px
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}