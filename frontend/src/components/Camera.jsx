import { useEffect } from 'react';
import { useCamera } from '../hooks/useCamera';

export function Camera({ onCapture, facingMode = 'user' }) {
  const {
    videoRef,
    canvasRef,
    streaming,
    photo,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    retake,
    getBlob,
  } = useCamera();

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleCapture = async () => {
    capturePhoto();
    const blob = await getBlob();
    if (blob && onCapture) onCapture(blob, photo);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Error state */}
      {error && (
        <div style={{
          background: 'rgba(224, 92, 92, 0.1)',
          border: '1px solid #e05c5c',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#e05c5c',
          marginBottom: '12px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* Video stream */}
      {!photo && (
        <div style={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#1a1428',
          aspectRatio: '3/4',
        }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: streaming ? 'block' : 'none',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            }}
            playsInline
            muted
          />

          {/* Face guide overlay */}
          {streaming && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
  width: '85%',
  aspectRatio: '3/4',
  border: '2px solid rgba(126,179,232,0.7)',
  borderRadius: '50%',
  boxShadow: '0 0 0 9999px rgba(6,13,31,0.5)',
}} />
            </div>
          )}

          {/* Placeholder when camera not started */}
          {!streaming && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#9b8cc0',
            }}>
              <span style={{ fontSize: '64px' }}>📷</span>
              <p style={{ fontSize: '14px' }}>Tap below to start camera</p>
            </div>
          )}
        </div>
      )}

      {/* Captured photo preview */}
      {photo && (
        <div style={{
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          aspectRatio: '3/4',
        }}>
          <img
            src={photo}
            alt="captured"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            }}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '16px',
      }}>
        {!streaming && !photo && (
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => startCamera(facingMode)}
          >
            📷 Start Camera
          </button>
        )}

        {streaming && (
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleCapture}
          >
            ⬤ Capture
          </button>
        )}

        {photo && (
          <>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={retake}
            >
              ↩ Retake
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleCapture}
            >
              ✓ Use Photo
            </button>
          </>
        )}
      </div>
    </div>
  );
}