import { create } from 'zustand';

interface Point {
  x: number;
  y: number;
}

interface MovableObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface DrawingStore {
  paths: Point[][];
  currentPath: Point[];
  movableObjects: MovableObject[];
  selectedObjectId: string | null;
  isDrawing: boolean;
  isPinching: boolean;
  
  startNewPath: (point: Point) => void;
  addPointToPath: (point: Point) => void;
  endPath: () => void;
  
  setPinching: (pinching: boolean) => void;
  setDrawing: (drawing: boolean) => void;
  
  addObject: (obj: MovableObject) => void;
  addRandomObject: () => void;
  selectObject: (id: string | null) => void;
  moveObject: (id: string, x: number, y: number) => void;
  
  clearPaths: () => void;
  clearAll: () => void;
}

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981'];

export const useDrawingStore = create<DrawingStore>((set) => ({
  paths: [],
  currentPath: [],
  movableObjects: [
    { id: '1', x: 0.45, y: 0.45, width: 0.1, height: 0.1, color: '#3b82f6' },
  ],
  selectedObjectId: null,
  isDrawing: false,
  isPinching: false,

  startNewPath: (point) => set((state) => ({ 
    currentPath: [point],
    isDrawing: true 
  })),

  addPointToPath: (point) => set((state) => ({ 
    currentPath: [...state.currentPath, point] 
  })),

  endPath: () => set((state) => ({ 
    paths: [...state.paths, state.currentPath],
    currentPath: [],
    isDrawing: false
  })),

  setPinching: (pinching) => set({ isPinching: pinching }),
  setDrawing: (drawing) => set({ isDrawing: drawing }),

  addObject: (obj) => set((state) => ({ 
    movableObjects: [...state.movableObjects, obj] 
  })),

  addRandomObject: () => set((state) => {
    const id = Math.random().toString(36).substr(2, 9);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newObj = {
      id,
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6,
      width: 0.08,
      height: 0.08,
      color
    };
    return { movableObjects: [...state.movableObjects, newObj] };
  }),

  selectObject: (id) => set({ selectedObjectId: id }),

  moveObject: (id, x, y) => set((state) => ({
    movableObjects: state.movableObjects.map(obj => 
      obj.id === id ? { ...obj, x, y } : obj
    )
  })),
  
  clearPaths: () => set({ paths: [], currentPath: [] }),
  clearAll: () => set({ paths: [], currentPath: [], movableObjects: [] }),
}));
