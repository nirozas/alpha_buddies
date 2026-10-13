import { useState, useRef, useCallback, useEffect } from 'react';

export interface PinchZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  maxPan?: number;
  snapThreshold?: number;
  enableWheel?: boolean;
  onReset?: () => void;
}

export function usePinchZoom(options: PinchZoomOptions = {}) {
  const {
    minZoom = 1,
    maxZoom = 4,
    maxPan = 350,
    snapThreshold = 1.05,
    enableWheel = true,
    onReset,
  } = options;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pinchRef = useRef<{
    initialDist: number;
    initialZoom: number;
    initialPan: { x: number; y: number };
    initialMid: { x: number; y: number };
  } | null>(null);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    pinchRef.current = null;
    setIsPanning(false);
    onReset?.();
  }, [onReset]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      if (e.cancelable) e.preventDefault();
      setIsPanning(true);
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
      const midX = (t0.clientX + t1.clientX) / 2;
      const midY = (t0.clientY + t1.clientY) / 2;

      pinchRef.current = {
        initialDist: Math.max(dist, 10),
        initialZoom: zoom,
        initialPan: { ...pan },
        initialMid: { x: midX, y: midY },
      };
    }
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      if (e.cancelable) e.preventDefault();
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
      const midX = (t0.clientX + t1.clientX) / 2;
      const midY = (t0.clientY + t1.clientY) / 2;

      if (!pinchRef.current) {
        pinchRef.current = {
          initialDist: Math.max(dist, 10),
          initialZoom: zoom,
          initialPan: { ...pan },
          initialMid: { x: midX, y: midY },
        };
        setIsPanning(true);
        return;
      }

      const { initialDist, initialZoom, initialPan, initialMid } = pinchRef.current;
      const scaleFactor = dist / initialDist;
      let newZoom = Math.min(Math.max(initialZoom * scaleFactor, minZoom), maxZoom);

      const deltaX = midX - initialMid.x;
      const deltaY = midY - initialMid.y;
      let newPanX = initialPan.x + deltaX;
      let newPanY = initialPan.y + deltaY;

      if (newZoom <= snapThreshold) {
        newZoom = 1;
        newPanX = 0;
        newPanY = 0;
      } else {
        const bound = maxPan * newZoom;
        newPanX = Math.max(-bound, Math.min(bound, newPanX));
        newPanY = Math.max(-bound, Math.min(bound, newPanY));
      }

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
  }, [minZoom, maxZoom, maxPan, snapThreshold, zoom, pan]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    if (pinchRef.current || isPanning) {
      pinchRef.current = null;
      setIsPanning(false);
    }
  }, [isPanning]);

  // Trackpad pinch-to-zoom & mouse wheel listener
  useEffect(() => {
    if (!enableWheel) return;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.ctrlKey ? -e.deltaY * 0.01 : -e.deltaY * 0.002;
      setZoom(prev => {
        const next = Math.min(Math.max(prev + zoomFactor, minZoom), maxZoom);
        if (next <= snapThreshold) {
          setPan({ x: 0, y: 0 });
          return 1;
        }
        return next;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [enableWheel, minZoom, maxZoom, snapThreshold]);

  return {
    zoom,
    setZoom,
    pan,
    setPan,
    isPanning,
    setIsPanning,
    pinchRef,
    containerRef,
    resetZoom,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
