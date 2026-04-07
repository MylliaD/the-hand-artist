import React, { useRef, useEffect, useState } from 'react';
import { useHands } from '../hooks/useHands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { useDrawingStore } from '../store/useDrawingStore';

export const HandCanvas: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamLoaded, setStreamLoaded] = useState(false);
  const results = useHands(videoRef.current);

  const { 
    paths, currentPath, isDrawing, startNewPath, addPointToPath, endPath, setPinching,
    movableObjects, selectedObjectId, selectObject, moveObject
  } = useDrawingStore();

  // Iniciar cámara
  useEffect(() => {
    async function startCamera() {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setStreamLoaded(true);
        };
      }
    }
    startCamera();
  }, []);

  // Lógica de detección de gestos, dibujo y agarre de objetos
  useEffect(() => {
    if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      if (isDrawing) endPath();
      selectObject(null);
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const indexBase = landmarks[6];

    // Centro del agarre (Punto medio entre pulgar e índice)
    const pinchX = (thumbTip.x + indexTip.x) / 2;
    const pinchY = (thumbTip.y + indexTip.y) / 2;

    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) + 
      Math.pow(thumbTip.y - indexTip.y, 2)
    );
    const isPinchingNow = distance < 0.05;
    setPinching(isPinchingNow);

    // 1. Lógica de Agarre (PINCH)
    if (isPinchingNow) {
      if (isDrawing) endPath();
      
      if (!selectedObjectId) {
        // Buscar si el pinch ocurrió sobre un objeto
        const clickedObj = movableObjects.find(obj => 
          pinchX >= obj.x && pinchX <= obj.x + obj.width &&
          pinchY >= obj.y && pinchY <= obj.y + obj.height
        );
        if (clickedObj) selectObject(clickedObj.id);
      } else {
        // Mover el objeto seleccionado centrado en el pinch
        const obj = movableObjects.find(o => o.id === selectedObjectId);
        if (obj) {
          moveObject(selectedObjectId, pinchX - obj.width / 2, pinchY - obj.height / 2);
        }
      }
    } else {
      selectObject(null);
      
      // 2. Lógica de Dibujo (Índice arriba)
      const isIndexUp = indexTip.y < indexBase.y;
      if (isIndexUp) {
        const point = { x: indexTip.x, y: indexTip.y };
        if (!isDrawing) {
          startNewPath(point);
        } else {
          addPointToPath(point);
        }
      } else {
        if (isDrawing) endPath();
      }
    }
  }, [results, isDrawing, selectedObjectId, movableObjects, startNewPath, addPointToPath, endPath, setPinching, selectObject, moveObject]);

  // Renderizado final
  useEffect(() => {
    if (!canvasRef.current || !results) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const W = canvasRef.current.width;
    const H = canvasRef.current.height;

    // Dibujar el video con efecto espejo
    if (videoRef.current) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-W, 0);
      ctx.globalAlpha = 0.4;
      ctx.drawImage(videoRef.current, 0, 0, W, H);
      ctx.restore();
    }

    // Dibujar Objetos Movibles
    movableObjects.forEach(obj => {
      ctx.fillStyle = obj.color;
      ctx.globalAlpha = obj.id === selectedObjectId ? 0.9 : 0.6;
      ctx.shadowBlur = obj.id === selectedObjectId ? 20 : 0;
      ctx.shadowColor = obj.color;
      
      // Aplicar espejo a las coordenadas de los objetos
      ctx.fillRect((1 - obj.x - obj.width) * W, obj.y * H, obj.width * W, obj.height * H);
      
      if (obj.id === selectedObjectId) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect((1 - obj.x - obj.width) * W, obj.y * H, obj.width * W, obj.height * H);
      }
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // Dibujar trazos guardados
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#10b981';

    const drawLine = (pts: {x: number, y: number}[]) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      const first = pts[0];
      ctx.moveTo((1 - first.x) * W, first.y * H);
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        ctx.lineTo((1 - p.x) * W, p.y * H);
      }
      ctx.stroke();
    };

    paths.forEach(drawLine);
    drawLine(currentPath);

    // Dibujar esqueleto de la mano
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#ffffff44', lineWidth: 1 });
        drawLandmarks(ctx, landmarks, { color: '#10b981', lineWidth: 1, radius: 3 });
      }
    }
  }, [results, paths, currentPath, movableObjects, selectedObjectId]);

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="max-w-full max-h-full border-2 border-emerald-500/30 rounded-lg shadow-emerald-500/10"
      />
      {!streamLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-emerald-400 font-mono text-sm uppercase tracking-tighter animate-pulse">
          Calibrando sensores de visión...
        </div>
      )}
    </div>
  );
};
