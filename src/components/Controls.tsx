import React from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { Trash2, Plus, Eraser, MousePointer2, Pencil } from 'lucide-react';

export const Controls: React.FC = () => {
  const { clearPaths, addRandomObject, isPinching, isDrawing } = useDrawingStore();

  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
      {/* Estado del Gesto */}
      <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-3">
        <div className={`p-3 rounded-xl transition-colors ${isDrawing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'}`}>
          <Pencil size={24} />
        </div>
        <div className={`p-3 rounded-xl transition-colors ${isPinching ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/20'}`}>
          <MousePointer2 size={24} />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 p-2 rounded-2xl flex flex-col gap-2">
        <button 
          onClick={addRandomObject}
          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 group"
          title="Añadir Objeto"
        >
          <Plus size={24} className="group-hover:text-blue-400 transition-colors" />
        </button>
        
        <button 
          onClick={clearPaths}
          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 group"
          title="Limpiar Dibujo"
        >
          <Eraser size={24} className="group-hover:text-emerald-400 transition-colors" />
        </button>
        
        <button 
          onClick={() => useDrawingStore.getState().clearAll()}
          className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all active:scale-95"
          title="Borrar Todo"
        >
          <Trash2 size={24} />
        </button>
      </div>
    </div>
  );
};
