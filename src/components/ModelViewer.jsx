import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import schema from '../data/schema.json'; // Reading from new schema

const ModelViewer = () => {
  // Generate 3D Grid from schema
  const { xSpacing, ySpacing } = schema.grids;
  const stories = schema.stories;
  
  // Calculate cumulative distances for grid lines
  let currentX = 0;
  const gridX = [0, ...xSpacing.map(dx => currentX += dx)];
  
  let currentY = 0;
  const gridY = [0, ...ySpacing.map(dy => currentY += dy)];

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [15, 15, 20], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls makeDefault />
        
        {/* Draw 3D Base Grid */}
        <gridHelper args={[30, 30, '#1e293b', '#0f172a']} position={[0, 0, 0]} />

        {/* Render Columns at grid intersections up to story heights */}
        {gridX.map((x, ix) => 
          gridY.map((y, iy) => (
            <group key={`col-${ix}-${iy}`}>
              <Line 
                points={[[x, 0, y], [x, stories[1].elevation, y]]} 
                color="#3b82f6" 
                lineWidth={2} 
              />
            </group>
          ))
        )}

        {/* Render Floor Slabs (Translucent planes at story elevations) */}
        {stories.map((story) => (
          <mesh key={story.id} position={[gridX[gridX.length-1]/2, story.elevation, gridY[gridY.length-1]/2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[gridX[gridX.length-1], gridY[gridY.length-1]]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
