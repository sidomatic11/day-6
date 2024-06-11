import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//SECTION - Scene Setup

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		console.log("go full");
		renderer.domElement.requestFullscreen();
	} else {
		console.log("leave full");
		document.exitFullscreen();
	}
});

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 15;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//SECTION - Objects

const sceneGroup = new THREE.Group();
sceneGroup.userData.update = function (t) {
	sceneGroup.children.forEach((c) => c.userData.update?.(t));
};
scene.add(sceneGroup);

const count = 20;
const meshes = [];
for (let i = 0; i < count; i++) {
	// const size = 1 + i * (i / 20);
	const size = i + 1;
	const geometry = new THREE.PlaneGeometry(size, size);
	const material = new THREE.MeshBasicMaterial({
		color: `hsl(200, 100%, ${100 - i * 5}%)`,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 1 - i / count,
	});
	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.z = -i / 2;
	const rate = -i * 0.12;
	mesh.userData.update = function (t) {
		mesh.position.x = Math.cos(t + rate) * 0.5;
		mesh.position.y = Math.cos(t + rate) * 0.5;
		mesh.position.z = Math.cos(t + rate) * 0.5;
		mesh.rotation.z = Math.sin(t + rate) * 0.5;
	};
	meshes.push();
	sceneGroup.add(mesh);
}

//SECTION - Animate
const clock = new THREE.Clock();

const tick = (t) => {
	const elapsedTime = clock.getElapsedTime();

	// mesh.rotation.z -= 0.01;
	sceneGroup.userData.update(t * 0.001);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
