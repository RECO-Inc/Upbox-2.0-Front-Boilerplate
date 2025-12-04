<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

// DOM 요소 참조
const threeContainer = ref<HTMLElement | null>(null);

// 트럭 및 카메라 속성
let truck: THREE.Object3D | null = null;
const moveSpeed = 0.005; // 트럭이 구체 위를 이동하는 속도
const sphereRadius = 8; // 구체의 반지름 (10에서 8로 감소)
const truckOffset = 0.8; // 트럭과 구체 표면 사이의 거리 조정값

// 트럭의 구체 상 위치 각도
let truckAngle = 0;
let truckLatitude = 0; // 위도 (수직 각도)

// 카메라 설정
const cameraHeight = -15; // 카메라의 높이를 음수로 변경하여 상하 반전

// 마우스 위치 추적
const mouse = {
  x: 0,
  y: 0
};

// 기본 Three.js 변수
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let animationFrameId: number;
let sphere: THREE.Mesh; // 구체 메쉬
let stars: THREE.Points; // 별 파티클
const mainLight: THREE.SpotLight | null = null;
let frontLight: THREE.DirectionalLight | null = null; // 전면 조명 추가
let truckLight: THREE.SpotLight | null = null; // 트럭 전용 조명 추가
let truckPointLight: THREE.PointLight | null = null; // 트럭 주변을 비추는 포인트 라이트 추가

// 구체 질감 색상 - 트렌디한 배색
const EARTH_COLORS = {
  LAND: 0x36B37E, // 모던한 틸 그린
  WATER: 0x2684FF, // 밝은 블루
  HIGHLIGHT: 0x00E7FF, // 하이라이트 색상
  GRID: 0xFFFFFF,  // 그리드 색상 (흰색)
};

// 별 생성 함수
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.2,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  
  // 별 100개 생성
  const starsCount = 100;
  const starsRadius = 80; // 별이 배치될 구 반경
  const starsPositions = new Float32Array(starsCount * 3);
  
  for (let i = 0; i < starsCount; i++) {
    const i3 = i * 3;
    
    // 구 표면 위의 랜덤 위치 생성 (극좌표계 사용)
    const theta = 2 * Math.PI * Math.random(); // 경도(0-2π)
    const phi = Math.acos(2 * Math.random() - 1); // 위도(0-π)
    
    // 구 표면 위의 좌표로 변환
    starsPositions[i3] = starsRadius * Math.sin(phi) * Math.cos(theta);
    starsPositions[i3 + 1] = starsRadius * Math.sin(phi) * Math.sin(theta);
    starsPositions[i3 + 2] = starsRadius * Math.cos(phi);
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
  stars = new THREE.Points(starsGeometry, starsMaterial);
  
  return stars;
}

// 마우스 이동 이벤트 핸들러
function onMouseMove(event: MouseEvent) {
  // 마우스 좌표를 -1에서 1 사이의 값으로 정규화
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Three.js 세팅 초기화
function initThree() {
  if (!threeContainer.value) return;

  // 씬 생성
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814); // 어두운 우주 배경색

  // 원근 카메라 설정
  const aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(
    60, // 시야각
    aspectRatio,
    0.2,
    1000
  );

  // 카메라 초기 위치 설정
  camera.position.set(-15, cameraHeight, -15);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 렌더러 설정
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  threeContainer.value.appendChild(renderer.domElement);

  // 오비트 컨트롤 설정 (제한적으로 사용)
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.minDistance = 15;
  controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI / 2 + 0.2; // 상하 반전을 위해 각도 조정
  controls.minPolarAngle = Math.PI / 2 - 0.1; // 상하 반전을 위해 각도 조정

  // 조명 설정
  // 주변광을 약간 어둡게 조정하여 우주 느낌 강화
  const ambientLight = new THREE.AmbientLight(0x334455, 0.25); // 주변광 밝기 증가
  scene.add(ambientLight);

  // 메인 조명을 카메라와 함께 움직이도록 설정
  const mainLight = new THREE.SpotLight(0xCCDDFF, 5.5); // 스팟라이트 강도 증가
  mainLight.position.set(-15, cameraHeight, -15); // 카메라와 동일한 위치에서 시작
  mainLight.target.position.set(0, 0, 0); // 구체 중심을 향하도록
  mainLight.angle = Math.PI / 4; // 스팟라이트 각도를 넓게 조정
  mainLight.penumbra = 0.2; // 부드러운 가장자리
  mainLight.decay = 1.0; // 거리에 따른 감쇠 감소
  mainLight.distance = 150; // 조명 범위 증가
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);
  scene.add(mainLight.target);

  // 카메라 정면에서 직접 비추는 조명 추가
  frontLight = new THREE.DirectionalLight(0xFFFFFF, 0); // 밝기를 0.4에서 0.8로 증가
  frontLight.position.copy(camera.position);
  frontLight.target.position.set(0, 0, 0);
  // frontLight.castShadow = true;
  // frontLight.shadow.mapSize.width = 1024;
  // frontLight.shadow.mapSize.height = 1024;
  scene.add(frontLight);
  scene.add(frontLight.target);

  // 트럭 전용 스팟라이트 추가 (트럭을 전면에서 비추도록)
  truckLight = new THREE.SpotLight(0xFFFFFF, 2.0);
  truckLight.angle = Math.PI / 8; // 좁은 각도로 트럭만 집중 조명
  truckLight.penumbra = 0.2; // 부드러운 가장자리
  truckLight.decay = 0.5; // 감쇠 감소
  truckLight.distance = 30; // 조명 범위
  truckLight.castShadow = true;
  truckLight.shadow.mapSize.width = 1024;
  truckLight.shadow.mapSize.height = 1024;
  scene.add(truckLight);
  scene.add(truckLight.target);
  
  // 트럭 전용 포인트 라이트 추가 (트럭을 모든 방향에서 밝게 하기 위해)
  truckPointLight = new THREE.PointLight(0xFFFFFF, 1.5);
  truckPointLight.distance = 15; // 조명 범위 (트럭 주변만 밝게)
  truckPointLight.decay = 1; // 거리에 따른 감쇠
  scene.add(truckPointLight);

  // 약간의 림 라이트 효과 (구체의 외곽선만 약하게 비춤)
  const rimLight = new THREE.DirectionalLight(0x2255BB, 0.4); // 림 라이트 강도 증가
  rimLight.position.set(15, 5, 15); // 카메라 반대편에서 약간 비춤
  scene.add(rimLight);

  // 구체 자체가 약간 발광하도록 설정
  const sphereLight = new THREE.PointLight(0x00AAFF, 0.3); // 구체 발광 강도 증가
  sphereLight.position.set(0, 0, 0); // 구체 중앙에 위치
  sphereLight.distance = sphereRadius * 4; // 구체 발광 범위 증가
  scene.add(sphereLight);

  // 별 추가
  const starsObj = createStars();
  scene.add(starsObj);

  // 구체 생성
  sphere = createEarthSphere();
  scene.add(sphere);

  // 구체 위에 경도/위도 라인 추가 (선택 사항)
  addGridLinesForSphere();

  // 모델 로드
  const loader = new GLTFLoader();
  loader.load("/3dmodels/upbox-truck-toy.glb", (gltf: any) => {
    truck = gltf.scene;
    if (!truck) return;
    truck.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // 트럭 재질에 약간의 발광 속성 추가 (더 잘 보이도록)
        if (child.material) {
          // 단일 재질인 경우
          if (!Array.isArray(child.material)) {
            enhanceMaterial(child.material);
          } 
          // 여러 재질인 경우
          else {
            child.material.forEach((mat: THREE.Material) => enhanceMaterial(mat));
          }
        }
      }
    });
    scene.add(truck);

    // 모델 스케일 조정
    truck.scale.set(1.2, 1.2, 1.2); // 스케일 0.8에서 1.2로 증가

    // 트럭을 구체 위에 위치시키기
    positionTruckOnSphere();
  }, undefined, (error: any) => {
    console.error("GLB 모델 로드 중 오류 발생:", error);
  });

  // 트럭 재질 향상 함수
  function enhanceMaterial(material: THREE.Material) {
    if (material instanceof THREE.MeshStandardMaterial || 
        material instanceof THREE.MeshPhysicalMaterial) {
      // 약간의 발광 효과 추가
      material.emissive = new THREE.Color(0x555555);
      material.emissiveIntensity = 0.2;
      
      // 반사율 조정 (더 잘 조명을 반사하도록)
      material.roughness = Math.max(0.2, material.roughness * 0.7);
      
      // 금속성 약간 증가 (하이라이트 반사 강화)
      material.metalness = Math.min(0.8, (material.metalness || 0) + 0.2);
    }
  }

  // 마우스 이벤트 리스너 추가
  window.addEventListener('mousemove', onMouseMove);

  // 애니메이션 루프 시작
  animate();

  // 윈도우 리사이즈 대응
  window.addEventListener("resize", onWindowResize);

  // 안개 효과 제거 (우주는 안개가 없음)
}

// 구체 위에 격자선 추가 (시각적 도움을 위해)
function addGridLinesForSphere() {
  // 경도선 (세로선)
  for (let i = 0; i < 12; i++) {
    const longitude = (i / 12) * Math.PI * 2;
    const points = [];
    for (let j = 0; j <= 100; j++) {
      const latitude = (j / 100) * Math.PI - Math.PI / 2;
      const x = sphereRadius * Math.cos(latitude) * Math.cos(longitude);
      const y = sphereRadius * Math.sin(latitude);
      const z = sphereRadius * Math.cos(latitude) * Math.sin(longitude);
      points.push(new THREE.Vector3(x, y, z));
    }
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: EARTH_COLORS.GRID, 
      transparent: true, 
      opacity: 0.2 
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.renderOrder = 1; // 렌더링 순서 설정으로 선이 위에 그려지도록
    scene.add(line);
  }

  // 위도선 (가로선)
  for (let i = 1; i < 6; i++) {
    const latitude = (i / 6) * Math.PI - Math.PI / 2;
    const points = [];
    for (let j = 0; j <= 100; j++) {
      const longitude = (j / 100) * Math.PI * 2;
      const x = sphereRadius * Math.cos(latitude) * Math.cos(longitude);
      const y = sphereRadius * Math.sin(latitude);
      const z = sphereRadius * Math.cos(latitude) * Math.sin(longitude);
      points.push(new THREE.Vector3(x, y, z));
    }
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: EARTH_COLORS.GRID, 
      transparent: true, 
      opacity: 0.2 
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.renderOrder = 1; // 렌더링 순서 설정
    scene.add(line);
  }
}

// 구체 생성
function createEarthSphere() {
  // 구체 기본 형태
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
  
  // 구체 기본 텍스처를 생성
  const textureCanvas = document.createElement("canvas");
  const ctx = textureCanvas.getContext("2d");
  if (!ctx) return new THREE.Mesh(sphereGeometry);
  
  // 캔버스 크기 설정
  textureCanvas.width = 1024;
  textureCanvas.height = 512;
  
  // 배경색 (바다)
  ctx.fillStyle = `#${EARTH_COLORS.WATER.toString(16).padStart(6, '0')}`;
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
  
  // 랜덤 대륙 생성 (트렌디한 미니멀 스타일)
  ctx.fillStyle = `#${EARTH_COLORS.LAND.toString(16).padStart(6, '0')}`;
  
  // 대륙 형태를 여러 개의 원과 사각형 조합으로 표현
  interface CircleContinent { x: number, y: number, r: number, type: 'circle' }
  interface RectContinent { x: number, y: number, width: number, height: number, type: 'rect' }
  type Continent = CircleContinent | RectContinent;
  
  const continents: Continent[] = [
    { x: 200, y: 150, r: 80, type: 'circle' },
    { x: 300, y: 200, r: 100, type: 'circle' },
    { x: 500, y: 250, width: 150, height: 80, type: 'rect' },
    { x: 700, y: 150, r: 70, type: 'circle' },
    { x: 400, y: 350, width: 200, height: 60, type: 'rect' },
    { x: 600, y: 100, width: 100, height: 40, type: 'rect' },
  ];
  
  // 대륙 그리기
  continents.forEach(c => {
    if (c.type === 'circle') {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(c.x, c.y, c.width, c.height);
    }
  });
  
  // 하이라이트 효과 추가
  ctx.strokeStyle = `#${EARTH_COLORS.HIGHLIGHT.toString(16).padStart(6, '0')}`;
  ctx.lineWidth = 2;
  continents.forEach(c => {
    if (c.type === 'circle') {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r + 5, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeRect(c.x - 5, c.y - 5, c.width + 10, c.height + 10);
    }
  });
  
  // 텍스처 생성
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.needsUpdate = true;
  
  // 구체 재질 설정 - 우주 환경에 맞게 발광 효과 강화
  const sphereMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.4,
    metalness: 0.1,
    emissive: 0x223344,
    emissiveIntensity: 0.3, // 발광 강도 증가
  });
  
  const earth = new THREE.Mesh(sphereGeometry, sphereMaterial);
  earth.castShadow = false;
  earth.receiveShadow = true;
  
  // 구체 회전
  earth.rotation.y = Math.PI; // 회전시켜서 대륙 위치 조정
  
  return earth;
}

// 트럭을 구체 위에 위치시키는 함수
function positionTruckOnSphere() {
  if (!truck) return;

  // 초기 위치 설정 (좌측 상단, 약 225도)
  truckAngle = (195 * Math.PI) / 180;
  truckLatitude = Math.PI / 7; // 위도 (45도)

  // 구체 위의 좌표 계산
  const normalVector = new THREE.Vector3(
    Math.cos(truckLatitude) * Math.cos(truckAngle),
    Math.sin(truckLatitude),
    Math.cos(truckLatitude) * Math.sin(truckAngle)
  ).normalize();
  
  // 구체 표면에서 offset만큼 바깥으로 위치
  const position = normalVector.clone().multiplyScalar(sphereRadius + truckOffset);
  
  // 트럭 위치 설정
  truck.position.copy(position);

  // 트럭이 표면에 접하도록 회전
  // 트럭의 Y축이 구체 중심을 향하도록 (반대 방향으로)
  truck.up.copy(normalVector); // Y축이 구체 중심에서 트럭 방향으로
  
  // 트럭이 앞쪽(Z축)이 이동 방향을 향하도록 하는 쿼터니언 계산
  const tangent = new THREE.Vector3(-Math.sin(truckAngle), 0, Math.cos(truckAngle));
  truck.lookAt(position.clone().add(tangent));
  
  // 앞면이 진행 방향을 향하도록 수정 (이전에는 Math.PI였음)
  truck.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0);
}

// 애니메이션 루프
function animate() {
  animationFrameId = requestAnimationFrame(animate);

  // 메인 라이트 위치 업데이트 - 항상 카메라와 같은 방향에서 구체를 비추도록
  if (mainLight) {
    mainLight.position.copy(camera.position);
  }
  
  // 정면 조명 위치 업데이트 - 항상 카메라 위치에서 비추도록
  if (frontLight) {
    frontLight.position.copy(camera.position);
    // 정면 조명의 강도를 카메라 거리에 따라 조정
    frontLight.intensity = 0.8 + (camera.position.length() / 50); // 카메라가 멀어질수록 조명 강화
  }

  // 트럭 전용 조명 업데이트
  if (truckLight && truck) {
    // 카메라 위치에서 살짝 앞으로 이동시켜 트럭을 정면에서 비추도록 조정
    const cameraDirection = new THREE.Vector3(0, 0, 0).sub(camera.position).normalize();
    // 카메라보다 약간 앞쪽에 위치
    truckLight.position.copy(camera.position).add(cameraDirection.multiplyScalar(3));
    // 트럭을 타겟으로 설정
    truckLight.target.position.copy(truck.position);
  }
  
  // 트럭 포인트 라이트 업데이트
  if (truckPointLight && truck) {
    // 트럭 위치에서 살짝 위로 이동하여 트럭을 전체적으로 비추기
    const truckPos = truck.position.clone();
    truckPos.y += 3; // 트럭 위에서 비추도록 Y축으로 살짝 이동
    truckPointLight.position.copy(truckPos);
  }

  // 트럭 이동 처리
  if (truck) {
    // 트럭의 각도 업데이트 (시계 방향으로 회전)
    truckAngle += moveSpeed;
    
    // 각도가 2π를 넘어가면 0으로 초기화
    if (truckAngle > Math.PI * 2) {
      truckAngle -= Math.PI * 2;
    }

    // 구체 표면의 방향 벡터 계산
    const normalVector = new THREE.Vector3(
      Math.cos(truckLatitude) * Math.cos(truckAngle),
      Math.sin(truckLatitude),
      Math.cos(truckLatitude) * Math.sin(truckAngle)
    ).normalize();
    
    // 구체 표면에서 offset만큼 바깥으로 위치
    const position = normalVector.clone().multiplyScalar(sphereRadius + truckOffset);
    
    // 트럭 위치 업데이트
    truck.position.copy(position);

    // 트럭 회전 업데이트 - 항상 구체 표면에 접하도록
    truck.up.copy(normalVector);
    
    // 트럭이 진행 방향을 바라보도록 설정
    const tangent = new THREE.Vector3(-Math.sin(truckAngle), 0, Math.cos(truckAngle));
    truck.lookAt(position.clone().add(tangent));
    
    // 앞면이 진행 방향을 향하도록 수정 (이전에는 Math.PI였음)
    truck.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0);
  }

  // 별 시점 이동 효과 (마우스 위치에 따른 시차 효과)
  if (stars) {
    // 마우스 위치에 따라 별들의 위치를 약간 이동시켜 시차(parallax) 효과 생성
    // 마우스 좌표에 따라 최대 5도까지 회전
    const rotX = mouse.y * 0.05;
    const rotY = mouse.x * 0.05;
    
    stars.rotation.x = rotX;
    stars.rotation.y = rotY;
  }

  // 컨트롤 업데이트
  controls.update();

  // 렌더링
  renderer.render(scene, camera);
}

// 윈도우 크기 변경 대응
function onWindowResize() {
  if (!camera || !renderer) return;
  
  const aspectRatio = window.innerWidth / window.innerHeight;
  
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = aspectRatio;
  }
  
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 라이프사이클 훅
onMounted(() => {
  initThree();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener('mousemove', onMouseMove);

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (threeContainer.value && renderer) {
    threeContainer.value.removeChild(renderer.domElement);
  }

  // 메모리 정리
  if (scene) {
    scene.traverse((object: any) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material: any) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  }

  if (renderer) {
    renderer.dispose();
  }
});
</script>

<template>
  <div class="truck-simulator">
    <div ref="threeContainer" class="three-container" />
  </div>
</template>

<style scoped>
.truck-simulator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.three-container {
  width: 100%;
  height: 100%;
}
</style> 