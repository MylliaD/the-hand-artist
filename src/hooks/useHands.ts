import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';

export const useHands = (videoElement: HTMLVideoElement | null) => {
  const [results, setResults] = useState<Results | null>(null);
  const handsRef = useRef<Hands | null>(null);

  useEffect(() => {
    if (!videoElement) return;

    // Inicializar MediaPipe Hands
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1, // Priorizamos una sola mano para el dibujo
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      setResults(results);
    });

    handsRef.current = hands;

    const processVideo = async () => {
      if (videoElement.readyState >= 2) {
        await hands.send({ image: videoElement });
      }
      requestAnimationFrame(processVideo);
    };

    processVideo();

    return () => {
      hands.close();
    };
  }, [videoElement]);

  return results;
};
