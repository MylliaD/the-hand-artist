import { HandCanvas } from './components/HandCanvas'
import { Controls } from './components/Controls'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-black overflow-hidden select-none">
      {/* HUD Superior */}
      <header className="absolute top-0 left-0 w-full p-8 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">
            The Hand Artist
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-500/80 font-mono text-[10px] uppercase tracking-widest">
              Vision Core Active • 60 FPS
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
            <p className="text-white/40 font-mono text-[10px] uppercase mb-1">Status</p>
            <p className="text-white font-mono text-xs uppercase tracking-wider">Ready to Draw</p>
          </div>
        </div>
      </header>
      
      {/* Lienzo Principal */}
      <main className="w-full h-screen relative">
        <HandCanvas />
        <Controls />
      </main>

      {/* Guía Inferior */}
      <footer className="absolute bottom-0 left-0 w-full p-8 z-10 flex justify-between items-end pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-1 bg-emerald-500" />
            <span className="text-white/60 font-mono text-[10px] uppercase">Index Up → Draw</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-1 bg-blue-500" />
            <span className="text-white/60 font-mono text-[10px] uppercase">Pinch → Grab</span>
          </div>
        </div>
        
        <div className="text-white/20 font-mono text-[10px] uppercase tracking-[0.2em]">
          MediaPipe Hands v0.10
        </div>
      </footer>
    </div>
  )
}

export default App
