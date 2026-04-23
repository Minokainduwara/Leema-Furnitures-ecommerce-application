import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Mesh } from "three";
import { gsap } from "gsap";


const images: string[] = [
  "/images/sofa.jpg",
  "/images/chair.jpg",
  "/images/bed.jpg",
];


interface SliderMeshProps {
  index: number;
}

const SliderMesh: React.FC<SliderMeshProps> = ({ index }) => {
  
  const meshRef = useRef<Mesh>(null);
  const textures = useTexture(images);

  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      
      gsap.fromTo(
        meshRef.current.material,
        { opacity: 0 },
        { opacity: 1, duration: 1.2 }
      );
    }
  }, [index]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[7.5, 5]} />
      <meshBasicMaterial map={textures[index]} transparent opacity={1} />
    </mesh>
  );
};

const WebGLSlider: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full md:w-[650px] h-[450px] rounded-2xl overflow-hidden">
      <Canvas
        shadows
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight castShadow position={[5, 10, 5]} intensity={1.2} />
        <SliderMesh index={index} />
      </Canvas>
    </div>
  );
};

export default WebGLSlider;