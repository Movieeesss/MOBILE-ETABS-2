import React, { useState } from 'react';
import { useModelStore } from '../store/useModelStore';

const PlanCanvas = () => {
  const { 
    xSpacing, ySpacing, currentStoryId, stories, 
    drawMode, nodes, beams, columns, 
    addNode, addBeam, addColumn, currentSectionId 
  } = useModelStore();

  const [startNode, setStartNode] = useState(null);
  
  // Calculate Grid Coordinates
  let cx = 0; const gridX = [0, ...xSpacing.map(dx => cx += dx)];
  let cy = 0; const gridY = [0, ...ySpacing.map(dy => cy += dy)];
  const scale = 50; // 1 meter = 50 pixels

  const currentElevation = stories.find(s => s.id === currentStoryId)?.elevation || 0;

  // Helper to find or create a node at specific coordinates
  const getOrCreateNode = (x, y, z) => {
    let existing = nodes.find(n => n.x === x && n.y === y && n.z === z);
    if (!existing) {
      const newNode = { id: `N_${Date.now()}_${Math.floor(Math.random()*1000)}`, x, y, z };
      addNode(newNode);
      return newNode;
    }
    return existing;
  };

  const handleSVGClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / scale;
    const clickY = (e.clientY - rect.top) / scale;

    // Snap to nearest grid point
    const snappedX = gridX.reduce((prev, curr) => Math.abs(curr - clickX) < Math.abs(prev - clickX) ? curr : prev);
    const snappedY = gridY.reduce((prev, curr) => Math.abs(curr - clickY) < Math.abs(prev - clickY) ? curr : prev);

    if (drawMode === 'column') {
      const storyBelowIndex = stories.findIndex(s => s.id === currentStoryId) - 1;
      if (storyBelowIndex < 0) {
          alert("Cannot draw column on the Base level.");
          return;
      }
      const elevBelow = stories[storyBelowIndex].elevation;
      const nodeBottom = getOrCreateNode(snappedX, snappedY, elevBelow);
      const nodeTop = getOrCreateNode(snappedX, snappedY, currentElevation);
      
      addColumn({
          id: `C_${Date.now()}`,
          startNodeId: nodeBottom.id,
          endNodeId: nodeTop.id,
          sectionId: currentSectionId
      });
    } 
    else if (drawMode === 'beam') {
      const node = getOrCreateNode(snappedX, snappedY, currentElevation);
      if (!startNode) {
        setStartNode(node);
      } else {
        if (startNode.id !== node.id) { 
            addBeam({
                id: `B_${Date.now()}`,
                startNodeId: startNode.id,
                endNodeId: node.id,
                sectionId: currentSectionId
            });
        }
        setStartNode(null); 
      }
    }
  };

  const getXY = (nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      return node ? { cx: node.x * scale, cy: node.y * scale } : {cx:0, cy:0};
  };

  const storyBeams = beams.filter(b => {
      const n = nodes.find(n => n.id === b.startNodeId);
      return n && n.z === currentElevation;
  });

  const storyColumns = columns.filter(c => {
      const topNode = nodes.find(n => n.id === c.endNodeId);
      return topNode && topNode.z === currentElevation;
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-white mb-2 font-bold text-sm">2D Plan Modeler - {currentStoryId} (Z={currentElevation}m)</h3>
      <p className="text-xs text-slate-400 mb-4">
          {drawMode === 'beam' ? "Click two grid points to draw a Beam." : "Click a grid point to place a Column."}
      </p>
      
      <div className="relative bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
        <svg width={800} height={600} onClick={handleSVGClick} className="cursor-crosshair bg-[#0a0f1c]">
          
          {/* Grid Lines */}
          {gridX.map((x, i) => (
            <line key={`vx-${i}`} x1={x * scale} y1={0} x2={x * scale} y2={600} stroke="#334155" strokeWidth="1" strokeDasharray="4" />
          ))}
          {gridY.map((y, i) => (
            <line key={`hy-${i}`} x1={0} y1={y * scale} x2={800} y2={y * scale} stroke="#334155" strokeWidth="1" strokeDasharray="4" />
          ))}

          {/* Draw Columns */}
          {storyColumns.map((c) => {
              const pos = getXY(c.endNodeId);
              return <rect key={c.id} x={pos.cx - 8} y={pos.cy - 8} width="16" height="16" fill="#3b82f6" opacity="0.8" />
          })}

          {/* Draw Beams */}
          {storyBeams.map((b) => {
            const start = getXY(b.startNodeId);
            const end = getXY(b.endNodeId);
            return <line key={b.id} x1={start.cx} y1={start.cy} x2={end.cx} y2={end.cy} stroke="#22c55e" strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
          })}

          {/* Active node indicator */}
          {startNode && drawMode === 'beam' && (
            <circle cx={startNode.x * scale} cy={startNode.y * scale} r="6" fill="#ef4444" />
          )}
        </svg>
      </div>
    </div>
  );
};

export default PlanCanvas;
