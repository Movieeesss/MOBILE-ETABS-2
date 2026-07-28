import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useModelStore } from '../store/useModelStore';

const ModelViewer = () => {
  const { xSpacing, ySpacing, stories, nodes, beams, columns } = useModelStore();
  
  // Calculate Grid lengths for 3D Base
  let currentX = 0; const gridX = [0, ...xSpacing.map(dx => currentX += dx)];
  let currentY = 0; const gridY = [0, ...ySpacing.map(dy => currentY += dy)];
  const maxX = gridX[gridX.length - 1] || 10;
  const maxY = gridY[gridY.length - 1] || 10;

  // Helper to map (x,y,z) structural coords to Three.js (x,z,y)
  const getCoords = (nodeId) => {
    const n = nodes.find(n => n.id === nodeId);
    return n ? [n.x, n.z, n.y] : [0, 0, 0];
  };

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [15, 15, 20], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls makeDefault />
        
        {/* Draw 3D Base Grid */}
        <gridHelper args={[Math.max(maxX, maxY) * 2, 20, '#1e293b', '#0f172a']} position={[maxX/2, 0, maxY/2]} />

        {/* Render Drawn Columns */}
        {columns.map((c) => {
          const start = getCoords(c.startNodeId);
          const end = getCoords(c.endNodeId);
          return (
            <group key={c.id}>
              <Line points={[start, end]} color="#3b82f6" lineWidth={4} />
            </group>
          );
        })}

        {/* Render Drawn Beams */}
        {beams.map((b) => {
          const start = getCoords(b.startNodeId);
          const end = getCoords(b.endNodeId);
          return (
            <group key={b.id}>
              <Line points={[start, end]} color="#22c55e" lineWidth={4} />
            </group>
          );
        })}

        {/* Render Translucent Floor Slabs */}
        {stories.map((story) => {
          if (story.id === 'Base') return null;
          return (
            <mesh key={story.id} position={[maxX/2, story.elevation, maxY/2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[maxX, maxY]} />
              <meshBasicMaterial color="#94a3b8" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
