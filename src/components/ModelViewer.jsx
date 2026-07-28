import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useModelStore } from '../store/useModelStore';
import dummyModel from '../data/dummyModel.json';

const mapCoords = (node, disp = { dx: 0, dy: 0, dz: 0 }, scale = 1) => {
  return [
    node.x + disp.dx * scale,
    node.z + disp.dz * scale,
    node.y + disp.dy * scale,
  ];
};

const ModelViewer = () => {
  const { 
    loadCase, resultType, showColumns, showBeams, showSlabs, 
    deformationScale, diagramScale 
  } = useModelStore();

  const { nodes, frames, slabs, results } = dummyModel;
  const currentResults = results[loadCase] || { displacements: {}, frameForces: {} };

  const getFrameLine = (frame) => {
    const startNode = nodes.find((n) => n.id === frame.startNode);
    const endNode = nodes.find((n) => n.id === frame.endNode);
    
    let dispStart = { dx: 0, dy: 0, dz: 0 };
    let dispEnd = { dx: 0, dy: 0, dz: 0 };

    if (resultType === 'deformed') {
      dispStart = currentResults.displacements[startNode.id] || dispStart;
      dispEnd = currentResults.displacements[endNode.id] || dispEnd;
    }

    const startPos = mapCoords(startNode, dispStart, deformationScale);
    const endPos = mapCoords(endNode, dispEnd, deformationScale);

    return { startPos, endPos };
  };

  return (
    <Canvas camera={{ position: [10, 10, 15], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls makeDefault />
      <gridHelper args={[20, 20]} />

      {frames.map((frame) => {
        if (frame.type === 'column' && !showColumns) return null;
        if (frame.type === 'beam' && !showBeams) return null;

        const { startPos, endPos } = getFrameLine(frame);
        const color = frame.type === 'column' ? '#3b82f6' : '#22c55e';

        return (
          <group key={frame.id}>
            <Line points={[startPos, endPos]} color={color} lineWidth={3} />
            {resultType === 'moment3_3' && currentResults.frameForces[frame.id]?.moment3_3 && (
              <Line
                points={[
                  startPos,
                  [
                    (startPos[0] + endPos[0]) / 2,
                    ((startPos[1] + endPos[1]) / 2) + (currentResults.frameForces[frame.id].moment3_3[1].value * diagramScale),
                    (startPos[2] + endPos[2]) / 2
                  ],
                  endPos
                ]}
                color="red"
                lineWidth={2}
              />
            )}
          </group>
        );
      })}

      {showSlabs && slabs.map((slab) => {
        const slabNodes = slab.nodeIds.map(id => nodes.find(n => n.id === id));
        const shape = new THREE.Shape();
        
        slabNodes.forEach((node, index) => {
          if (index === 0) shape.moveTo(node.x, node.y);
          else shape.lineTo(node.x, node.y);
        });
        shape.lineTo(slabNodes[0].x, slabNodes[0].y);

        const geometry = new THREE.ShapeGeometry(shape);
        geometry.rotateX(Math.PI / 2);
        geometry.translate(0, slabNodes[0].z, 0);

        return (
          <mesh key={slab.id} geometry={geometry}>
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </Canvas>
  );
};

export default ModelViewer;