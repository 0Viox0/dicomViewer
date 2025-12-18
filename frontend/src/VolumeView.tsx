import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const STEP = 2;

export default function VolumeView({ volume, useStep }: any) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(1000, 1000);
    ref.current!.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.update();

    const geometry = new THREE.BufferGeometry();
    const points: number[] = [];

    const cx = volume.width / 2;
    const cy = volume.height / 2;
    const cz = volume.depth / 2;

    volume.mask.forEach((slice: number[], z: number) => {
      for (let i = 0; i < slice.length; i += STEP) {
        if (slice[i]) {
          const x = (i % volume.width) - cx;
          const y = Math.floor(i / volume.width) - cy;
          const zPos = z - cz;
          points.push(x, y, zPos);
        }
      }
    });

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );

    const material = new THREE.PointsMaterial({ size: 1 });
    const mesh = new THREE.Points(geometry, material);

    scene.add(mesh);

    let frameId: number;

    function animate() {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameId);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      controls.dispose();

      scene.clear();

      ref.current?.removeChild(renderer.domElement);
    };
  }, [volume]);

  return <div ref={ref} />;
}
