import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function BeadPattern({ palette }) {
  if (!palette || palette.length === 0) return null;

  const beadSize = 20;
  const spacing = beadSize + 8;
  const repeat = 4;
  const totalBeads = palette.length * repeat;
  const svgWidth = totalBeads * spacing + 20;
  const svgHeight = beadSize + 20;

  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
        color: '#7EB3E8', fontWeight: 500, marginBottom: '14px',
      }}>📿 Your Bead Pattern</p>

      <div className="card">
        {/* Pattern label */}
        <p style={{
          fontSize: '12px', color: '#4A6A9A',
          marginBottom: '16px',
        }}>
          One repeat shown below — continue this pattern to complete your {palette.length} bead sequence
        </p>

        {/* SVG bead pattern */}
        <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          <svg height={svgHeight} width={svgWidth} style={{ display: 'block', minWidth: '100%' }}>
            {Array.from({ length: repeat }).flatMap((_, ri) =>
              palette.map((hex, bi) => {
                const r = beadSize / 2;
                const x = 10 + (ri * palette.length + bi) * spacing + r;
                const y = r + 10;
                return (
                  <g key={`${ri}-${bi}`}>
                    <circle
                      cx={x} cy={y} r={r}
                      fill={hex}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1.5"
                    />
                    {/* Position number */}
                    {ri === 0 && (
                      <text
                        x={x} y={y + r + 14}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#4A6A9A"
                      >
                        {bi + 1}
                      </text>
                    )}
                  </g>
                );
              })
            )}

            {/* Repeat dividers */}
            {Array.from({ length: repeat - 1 }).map((_, i) => {
              const x = 10 + (i + 1) * palette.length * spacing;
              return (
                <line
                  key={i}
                  x1={x} y1={5}
                  x2={x} y2={svgHeight - 5}
                  stroke="rgba(126,179,232,0.2)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              );
            })}
          </svg>
        </div>

        {/* Colour legend */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '8px',
          marginTop: '16px',
        }}>
          {palette.map((hex, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(126,179,232,0.04)',
              borderRadius: '8px', padding: '8px 10px',
            }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%',
                background: hex, flexShrink: 0,
                border: '1.5px solid rgba(255,255,255,0.15)',
              }} />
              <span style={{
                fontSize: '11px', color: '#4A6A9A',
                fontFamily: 'monospace', letterSpacing: '0.5px',
              }}>{hex}</span>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: '11px', color: '#4A6A9A',
          marginTop: '12px', textAlign: 'center',
        }}>
          Repeat × {repeat} — dashed lines show pattern repeats
        </p>
      </div>
    </div>
  );
}

export function Results({ data, mode }) {
  const [showTutorial, setShowTutorial] = useState(false);

  if (!data) return null;

  // Split recommendation into sections
  const rec = mode === 'design' ? data.recommendation : data.feedback;

  // Extract tutorial section
  const tutorialMatch = rec?.match(/\*\*TUTORIAL\*\*([\s\S]*?)(\*\*WHY THIS WORKS\*\*|$)/i);
  const tutorialText = tutorialMatch ? tutorialMatch[1].trim() : null;
  const recWithoutTutorial = rec?.replace(/\*\*TUTORIAL\*\*[\s\S]*?(\*\*WHY THIS WORKS\*\*)/i, '**WHY THIS WORKS**');

  return (
    <div style={{ marginTop: '8px' }}>

      {/* Chips */}
      {mode === 'design' && data.face && data.skin && (
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px',
        }}>
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

      {/* Generated jewelry image */}
{mode === 'design' && data.image_url && (
  <div style={{ marginBottom: '24px' }}>
    <p style={{
      fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
      color: '#7EB3E8', fontWeight: 500, marginBottom: '14px',
    }}>🖼️ Your Design</p>
    <div style={{
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(126,179,232,0.2)',
      background: 'rgba(126,179,232,0.04)',
    }}>
      <img
        src={data.image_url}
        alt="Generated jewelry design"
        style={{
          width: '100%',
          display: 'block',
          borderRadius: '16px',
        }}
        onError={e => {
          e.target.parentElement.style.display = 'none';
        }}
      />
    </div>
  </div>
)}

      {/* Bead pattern visual */}
      {mode === 'design' && data.colour_palette?.length > 0 && (
        <BeadPattern palette={data.colour_palette} />
      )}

      {/* Main recommendation */}
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
              h1: ({ children }) => <h2 style={{ color: '#7EB3E8', margin: '20px 0 8px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '24px' }}>{children}</h2>,
              h2: ({ children }) => <h3 style={{ color: '#7EB3E8', margin: '20px 0 8px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '20px' }}>{children}</h3>,
              h3: ({ children }) => <p style={{ color: '#7EB3E8', fontWeight: 600, margin: '16px 0 4px', fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: '#E8EEFF' }}>{children}</strong>,
              ul: ({ children }) => <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>{children}</ol>,
              li: ({ children }) => <li style={{ margin: '6px 0', color: '#A8C8F0' }}>{children}</li>,
              p: ({ children }) => <p style={{ margin: '8px 0', color: '#A8C8F0' }}>{children}</p>,
            }}
          >
            {mode === 'design' ? (tutorialText ? recWithoutTutorial : rec) : rec}
          </ReactMarkdown>
        </div>

        {/* Collapsible tutorial */}
        {mode === 'design' && tutorialText && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              style={{
                background: 'rgba(126,179,232,0.08)',
                border: '1px solid rgba(126,179,232,0.2)',
                borderRadius: '8px',
                color: '#7EB3E8',
                fontSize: '13px',
                fontWeight: 500,
                padding: '10px 16px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              📖 Step-by-step tutorial
              <span>{showTutorial ? '▲ Hide' : '▼ Show'}</span>
            </button>

            {showTutorial && (
              <div style={{
                marginTop: '12px',
                padding: '16px',
                background: 'rgba(126,179,232,0.04)',
                borderRadius: '8px',
                border: '1px solid rgba(126,179,232,0.1)',
              }}>
                <ReactMarkdown
                  components={{
                    ol: ({ children }) => <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>{children}</ol>,
                    li: ({ children }) => <li style={{ margin: '8px 0', color: '#A8C8F0', lineHeight: 1.6 }}>{children}</li>,
                    p: ({ children }) => <p style={{ margin: '8px 0', color: '#A8C8F0' }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: '#E8EEFF' }}>{children}</strong>,
                  }}
                >
                  {tutorialText}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
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