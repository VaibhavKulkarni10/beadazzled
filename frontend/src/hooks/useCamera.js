import { useState, useRef, useCallback } from 'react';

export function useCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [streaming, setStreaming] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async (facingMode = 'user') => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,          // 'user' = front camera, 'environment' = back
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPhoto(dataUrl);
    stopCamera();
    return dataUrl;
  }, [stopCamera]);

  const retake = useCallback(() => {
    setPhoto(null);
    setError(null);
  }, []);

  // Convert dataUrl to a Blob for sending to the API
  const getBlob = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
  }, []);

  return {
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
  };
}