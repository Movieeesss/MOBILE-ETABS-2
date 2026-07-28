import React, { useState } from 'react';
import { useModelStore } from '../store/useModelStore';

const PlanCanvas = ({ currentStory }) => {
  const [elements, setElements] = useState([]);
  const [startNode, setStartNode] = useState(null);
  
  // Get dynamic grids from store
  const { xSpacing, ySpacing } = useModelStore();

  let currentX = 0;
  const gridX = [0, ...xSpacing.map(dx => currentX += dx)];
  
  let currentY = 0;
  const gridY = [0, ...ySpacing.map(dy => currentY += dy)];

  const scale = 50; // 1 meter = 50 pixels

  const handleSVGClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find nearest grid intersection to snap
    const snappedX = gridX.reduce((prev, curr) => Math.abs(curr * scale - x) < Math.abs(prev * scale - x) ? curr : prev) * scale;
    const snappedY = gridY.reduce((prev, curr) => Math.abs(curr * scale - y) < Math.abs(prev * scale - y) ? curr : prev) * scale;

    if (!startNode) {
      setStartNode({ x: snappedX, y: snappedY });
    } else {
      setElements([...elements, { x1: startNode.x, y1: startNode.y, x2: snappedX, y2: snappedY }]);
      setStartNode(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-white mb-2 font-bold text-sm">2D Plan Modeler - {currentStory}</h3>
      <p className="text-xs text-slate-400 mb-4">Click on grid intersections to draw beams.</p>
      
      <div className="relative bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
        <svg 
          width={800} 
          height={600} 
          onClick={handleSVGClick}
          className="cursor-crosshair bg-[#0a0f1c]"
        >
          {/* Draw Grid Lines */}
          {gridX.map((x, i) => (
            <line key={`vx-${i}`} x1={x * scale} y1={0} x2={x * scale} y2={600} stroke="#334155" strokeWidth="1" strokeDasharray="4" />
          ))}
          {gridY.map((y, i) => (
            <line key={`hy-${i}`} x1={0} y1={y * scale} x2={800} y2={y * scale} stroke="#334155" strokeWidth="1" strokeDasharray="4" />
          ))}

          {/* Draw Drawn Elements (Beams) */}
          {elements.map((el, i) => (
            <line key={i} x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke="#22c55e" strokeWidth="4" />
          ))}

          {/* Draw current drawing node */}
          {startNode && (
            <circle cx={startNode.x} cy={startNode.y} r="6" fill="#ef4444" />
          )}
        </svg>
      </div>
    </div>
  );
};

export default PlanCanvas;
