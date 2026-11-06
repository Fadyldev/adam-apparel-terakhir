import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d, ZoomIn, Sparkles, RefreshCw } from 'lucide-react';

interface Mannequin3DCanvasProps {
  colorHex: string;
  category: string;
  name: string;
}

export default function Mannequin3DCanvas({ colorHex, category, name }: Mannequin3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensi
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.2);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainKeyLight.position.set(3, 4, 3);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    mainKeyLight.shadow.bias = -0.0001;
    scene.add(mainKeyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // 5. Studio Pedestal / Lantai Bayangan
    const floorGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -1.55;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid Lingkaran Pedestal Mewah
    const ringGeo = new THREE.RingGeometry(1.5, 1.55, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.505;
    scene.add(ringMesh);

    // 6. Root Group untuk Manekin Busana 3D
    const garmentGroup = new THREE.Group();
    scene.add(garmentGroup);

    // Stand Manekin Logam
    const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.2, 16);
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.1 });
    const poleMesh = new THREE.Mesh(poleGeo, chromeMat);
    poleMesh.position.y = -0.95;
    garmentGroup.add(poleMesh);

    // Leher Manekin Kayu Mahoni
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.35, 32);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5b3a29, roughness: 0.6 });
    const neckMesh = new THREE.Mesh(neckGeo, woodMat);
    neckMesh.position.y = 0.95;
    garmentGroup.add(neckMesh);

    // Tutup Leher Atas Kayu
    const capGeo = new THREE.SphereGeometry(0.14, 32, 16);
    const capMesh = new THREE.Mesh(capGeo, woodMat);
    capMesh.position.y = 1.12;
    capMesh.scale.set(1, 0.4, 1);
    garmentGroup.add(capMesh);

    // Material Kain Busana (Dinamis sesuai pilihan warna)
    const parsedColor = new THREE.Color(colorHex);
    const fabricMaterial = new THREE.MeshStandardMaterial({
      color: parsedColor,
      roughness: 0.75, // Karakter serat katun / drill
      metalness: 0.05,
      bumpScale: 0.05,
    });

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.5,
    });

    const isJubah = category.toLowerCase().includes('jubah') || category.toLowerCase().includes('gamis');
    const isJas = category.toLowerCase().includes('jas') || category.toLowerCase().includes('blazer');

    // Torso Utama / Dada Pria-Wanita Konveksi
    const torsoHeight = isJubah ? 2.1 : 1.4;
    const torsoGeo = new THREE.CylinderGeometry(
      0.38, // Bahu atas
      isJubah ? 0.55 : 0.33, // Pinggul bawah
      torsoHeight,
      32,
      16
    );
    // Skala bentuk tubuh (dada tebal, pinggang pipih)
    torsoGeo.scale(1.2, 1, 0.7);

    const torsoMesh = new THREE.Mesh(torsoGeo, fabricMaterial);
    torsoMesh.position.y = isJubah ? 0.05 : 0.25;
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    garmentGroup.add(torsoMesh);

    // Pundak / Bahu Bulat Ergonomis
    const leftShoulderGeo = new THREE.SphereGeometry(0.17, 32, 16);
    leftShoulderGeo.scale(1.1, 0.8, 0.7);
    const leftShoulder = new THREE.Mesh(leftShoulderGeo, fabricMaterial);
    leftShoulder.position.set(-0.52, isJubah ? 0.95 : 0.85, 0);
    leftShoulder.castShadow = true;
    garmentGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(leftShoulderGeo, fabricMaterial);
    rightShoulder.position.set(0.52, isJubah ? 0.95 : 0.85, 0);
    rightShoulder.castShadow = true;
    garmentGroup.add(rightShoulder);

    // Lengan Atas (Sleeves)
    const sleeveGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.5, 24);
    sleeveGeo.scale(1, 1, 0.75);
    const leftSleeve = new THREE.Mesh(sleeveGeo, fabricMaterial);
    leftSleeve.position.set(-0.58, isJubah ? 0.65 : 0.55, 0);
    leftSleeve.rotation.z = Math.PI / 18;
    leftSleeve.castShadow = true;
    garmentGroup.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo, fabricMaterial);
    rightSleeve.position.set(0.58, isJubah ? 0.65 : 0.55, 0);
    rightSleeve.rotation.z = -Math.PI / 18;
    rightSleeve.castShadow = true;
    garmentGroup.add(rightSleeve);

    // Kerah Pakaian 3D (Collar)
    const collarGeo = new THREE.TorusGeometry(0.2, 0.045, 16, 32);
    collarGeo.scale(1.1, 0.8, 1);
    const collarMesh = new THREE.Mesh(collarGeo, isJas ? trimMaterial : fabricMaterial);
    collarMesh.rotation.x = Math.PI / 2.3;
    collarMesh.position.set(0, isJubah ? 1.05 : 0.92, 0.03);
    collarMesh.castShadow = true;
    garmentGroup.add(collarMesh);

    // Saku Dada Bordir / Pocket 3D
    const pocketGeo = new THREE.BoxGeometry(0.16, 0.18, 0.02);
    const pocketMesh = new THREE.Mesh(pocketGeo, fabricMaterial);
    pocketMesh.position.set(-0.25, isJubah ? 0.65 : 0.55, 0.22);
    pocketMesh.rotation.y = -0.15;
    garmentGroup.add(pocketMesh);

    // Plaket Kancing Depan
    const placketGeo = new THREE.BoxGeometry(0.06, isJubah ? 1.4 : 1.1, 0.02);
    const placketMesh = new THREE.Mesh(placketGeo, isJas ? trimMaterial : fabricMaterial);
    placketMesh.position.set(0, isJubah ? 0.4 : 0.35, 0.23);
    garmentGroup.add(placketMesh);

    // Kancing 3D (3 Butir)
    for (let i = 0; i < 4; i++) {
      const buttonGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.01, 16);
      const buttonMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, metalness: 0.8, roughness: 0.2 });
      const buttonMesh = new THREE.Mesh(buttonGeo, buttonMat);
      buttonMesh.rotation.x = Math.PI / 2;
      buttonMesh.position.set(0, 0.7 - i * 0.18, 0.245);
      garmentGroup.add(buttonMesh);
    }

    // 7. Mouse / Touch Orbit Controls (Interaksi Putar 360 Derajat)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0.004; // Auto-rotate lambat & anggun
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      setHintVisible(false);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      rotationVelocityX = 0;
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
      // Kembali berputar pelan setelah dilepas
      setTimeout(() => {
        rotationVelocityX = 0.003;
      }, 1000);
    };

    // Touch Support untuk HP Android / iPhone
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsInteracting(true);
        setHintVisible(false);
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      targetRotationY += deltaX * 0.01;
      rotationVelocityX = 0;
    };

    const onTouchEnd = () => {
      isDragging = false;
      setIsInteracting(false);
      setTimeout(() => {
        rotationVelocityX = 0.003;
      }, 1000);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotasi halus
      if (!isDragging) {
        targetRotationY += rotationVelocityX;
      }
      garmentGroup.rotation.y += (targetRotationY - garmentGroup.rotation.y) * 0.1;

      // Pantulan cahaya melayang
      garmentGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [colorHex, category]);

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950">
      {/* Canvas 3D */}
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing min-h-[360px] sm:min-h-[460px]" />

      {/* Petunjuk Interaksi 360° */}
      {hintVisible && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center animate-bounce">
          <div className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-950/85 px-4 py-2 text-xs font-bold text-amber-300 shadow-xl backdrop-blur-md">
            <Rotate3d className="h-4 w-4 animate-spin text-amber-400" />
            <span>Geser / Sentuh Layar untuk Putar 360°</span>
          </div>
        </div>
      )}

      {/* Badge Atas: WebGL 3D Active */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-slate-950/80 px-3 py-1 text-[11px] font-black text-emerald-400 backdrop-blur-md shadow-lg">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CANVAS 3D WEBGL AKTIF</span>
        </span>
        <span className="hidden sm:inline-flex rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-md">
          {name}
        </span>
      </div>

      {/* Kontrol Bawah: Status Warna Kain 3D */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-1.5 backdrop-blur-md">
          <div
            className="h-4 w-4 rounded-full border border-white/40 shadow-xs"
            style={{ backgroundColor: colorHex }}
          />
          <span className="text-xs font-bold text-slate-200">Tekstur Kain 3D</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 backdrop-blur-md flex items-center gap-1">
            <RefreshCw className="h-3 w-3 text-amber-400 animate-spin" />
            Auto 360°
          </span>
        </div>
      </div>
    </div>
  );
}
