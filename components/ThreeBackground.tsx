import React, { useRef, useEffect } from 'react';
import type * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let renderer: any | null = null;
    let mount: HTMLDivElement | null = null;
    let handleResize: (() => void) | null = null;
    let handleMouseMove: ((event: MouseEvent) => void) | null = null;
    const geometries: any[] = [];
    const materials: any[] = [];
    const planes: any[] = [];
    let mouse: THREE.Vector2 | null = null;


    const init = async () => {
      try {
        const THREE = await import('three');
        if (!mountNode.current) return;
        mount = mountNode.current;
        mouse = new THREE.Vector2(-100, -100); // Initialize off-screen

        const clock = new THREE.Clock();

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Camera position
        camera.position.z = 5;

        // Helper to calculate visible height/width at a given z-depth
        const getVisibleHeightAtZDepth = (depth: number, cam: THREE.PerspectiveCamera) => {
          const cameraOffset = cam.position.z;
          if (depth < cameraOffset) depth -= cameraOffset;
          else depth += cameraOffset;
          const vFOV = cam.fov * Math.PI / 180;
          return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
        };

        const getVisibleWidthAtZDepth = (depth: number, cam: THREE.PerspectiveCamera) => {
          const height = getVisibleHeightAtZDepth(depth, cam);
          return height * cam.aspect;
        };

        // Create planes (A4 aspect ratio)
        const planeCount = 50;
        const a4AspectRatio = 1 / Math.sqrt(2);
        const planeSize = 0.5;
        const colors = [0xffffff, 0x4f46e5, 0x38bdf8, 0xe0f2fe];

        for (let i = 0; i < planeCount; i++) {
          const geometry = new THREE.PlaneGeometry(planeSize, planeSize / a4AspectRatio, 10, 10);
          geometries.push(geometry);

          const material = new THREE.MeshStandardMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.1,
          });
          materials.push(material);
          
          const plane = new THREE.Mesh(geometry, material);

          (plane as any).originalPosition = geometry.attributes.position.clone();
          (plane as any).velocity = new THREE.Vector3();


          const visibleHeight = getVisibleHeightAtZDepth(0, camera);
          const visibleWidth = getVisibleWidthAtZDepth(0, camera);
          
          plane.position.x = (Math.random() - 0.5) * visibleWidth * 1.5;
          plane.position.y = (Math.random() - 0.5) * visibleHeight * 1.5;
          plane.position.z = (Math.random() - 0.5) * 8;
          
          plane.rotation.x = Math.random() * Math.PI;
          plane.rotation.y = Math.random() * Math.PI;
          plane.rotation.z = Math.random() * Math.PI;
          
          // Add custom properties for animation
          (plane as any).rotationSpeed = {
            x: (Math.random() - 0.5) * 0.008,
            y: (Math.random() - 0.5) * 0.008,
            z: (Math.random() - 0.5) * 0.008,
          };
          (plane as any).fallSpeed = 0.0001 + Math.random() * 0.0002;
          (plane as any).wave = {
            speed: Math.random() * 0.5 + 0.3,
            amplitude: Math.random() * 0.05 + 0.05,
            frequencyX: Math.random() * 3 + 2,
            frequencyY: Math.random() * 2 + 1,
          };
         
          scene.add(plane);
          planes.push(plane);
        }
        
        const interactionRadius = 0.3;
        const repelForce = 0.001;

        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          if (!renderer) return;

          const time = clock.getElapsedTime();
          const visibleHeight = getVisibleHeightAtZDepth(0, camera);
          const visibleWidth = getVisibleWidthAtZDepth(0, camera);
          const fallBounds = visibleHeight / 2 + planeSize * 1.5;
          const sideBounds = visibleWidth / 2 + planeSize * 1.5;
          
          planes.forEach(plane => {
            // Interaction with mouse
            const planeScreenPosition = plane.position.clone().project(camera);
            if(mouse) {
                const distance = mouse.distanceTo(planeScreenPosition);
                if (distance < interactionRadius) {
                    const repelDirection = new THREE.Vector2().subVectors(planeScreenPosition, mouse).normalize();
                    const forceStrength = (1 - distance / interactionRadius) * repelForce;
                    plane.velocity.x += repelDirection.x * forceStrength;
                    plane.velocity.y += repelDirection.y * forceStrength;
                }
            }

            // Apply forces (gravity, damping)
            plane.velocity.y -= (plane as any).fallSpeed;
            plane.velocity.multiplyScalar(0.98); // Damping/friction

            // Update position and rotation
            plane.position.add(plane.velocity);
            plane.rotation.x += (plane as any).rotationSpeed.x;
            plane.rotation.y += (plane as any).rotationSpeed.y;
            plane.rotation.z += (plane as any).rotationSpeed.z;

            // Reset plane when it goes off-screen
            if (plane.position.y < -fallBounds || Math.abs(plane.position.x) > sideBounds) {
              plane.position.y = fallBounds;
              plane.position.x = (Math.random() - 0.5) * visibleWidth * 1.2;
              plane.position.z = (Math.random() - 0.5) * 8;
              plane.velocity.set(0, 0, 0);
            }

            // Wave animation (flutter)
            const { wave } = plane as any;
            const positionAttribute = plane.geometry.attributes.position;
            const originalPosition = (plane as any).originalPosition;

            for (let i = 0; i < positionAttribute.count; i++) {
              const x = originalPosition.getX(i);
              const y = originalPosition.getY(i);
              
              const zDisplacement = 
                Math.sin(x * wave.frequencyX + time * wave.speed) * wave.amplitude +
                Math.cos(y * wave.frequencyY + time * wave.speed) * wave.amplitude;
              
              positionAttribute.setZ(i, zDisplacement);
            }
            positionAttribute.needsUpdate = true;
          });
          renderer.render(scene, camera);
        };
        animate();
        
        handleResize = () => {
          if (!renderer) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        handleMouseMove = (event: MouseEvent) => {
            if (mouse) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

      } catch (error) {
        console.error("Failed to load or initialize Three.js background:", error);
      }
    };

    init();

    return () => {
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (renderer && mount) {
        mount.removeChild(renderer.domElement);
      }
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={mountNode}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;
