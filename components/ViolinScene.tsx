"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

type ViolinSceneProps = {
  isPlaying: boolean;
};

export default function ViolinScene({ isPlaying }: ViolinSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playingRef = useRef(isPlaying);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // Capability check for a missing WebGL context — not derived render state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const CAMERA_DISTANCE = 3.4;
    camera.position.set(0, 0, CAMERA_DISTANCE);
    camera.lookAt(0, 0, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const pivot = new THREE.Group();
    scene.add(pivot);

    scene.add(new THREE.AmbientLight(0xfff4e6, 0.55));
    const key = new THREE.DirectionalLight(0xfff1d6, 1.6);
    key.position.set(2.4, 2.2, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb8c4ff, 0.45);
    fill.position.set(-2.2, 0.4, 1.5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xc9a66b, 0.7);
    rim.position.set(0, 1.6, -2.4);
    scene.add(rim);

    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    // Model dimensions in unscaled units, filled in after load.
    const modelSize = new THREE.Vector3();
    const FIT_MARGIN = 0.82;

    // Scale the pivot so the whole violin fits the visible frustum at the
    // current aspect ratio. The horizontal footprint uses the XZ diagonal,
    // since the model sweeps through it while spinning around Y.
    const fit = () => {
      if (modelSize.lengthSq() === 0) return;
      const visibleHeight =
        2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const visibleWidth = visibleHeight * camera.aspect;
      const footprint = Math.hypot(modelSize.x, modelSize.z);
      const scale = Math.min(
        (visibleHeight * FIT_MARGIN) / modelSize.y,
        (visibleWidth * FIT_MARGIN) / footprint,
      );
      pivot.scale.setScalar(scale);
    };

    let disposed = false;
    loader.load(
      "/models/violin.glb",
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        box.getSize(modelSize);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        pivot.add(model);
        fit();
      },
      undefined,
      () => {
        if (!disposed) setFailed(true);
      },
    );

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      fit();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let visible = false;
    let raf = 0;
    let last = performance.now();
    let speed = 0;

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      const target = playingRef.current ? 0.7 : 0;
      speed += (target - speed) * (1 - Math.exp(-delta * 4));
      pivot.rotation.y += speed * delta;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.12 },
    );
    io.observe(host);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      draco.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    return (
      <div className="works__placeholder">
        3D Violin Model
        <br />
        (unavailable)
      </div>
    );
  }

  return <div className="works__canvas" ref={hostRef} />;
}
