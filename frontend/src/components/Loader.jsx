export function Loader({ message = 'Analysing...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(108, 63, 197, 0.2)',
        borderTop: '3px solid #6c3fc5',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#9b8cc0', fontSize: '15px' }}>{message}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}