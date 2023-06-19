import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xA3A3A3);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    24,
    window.innerWidth / window.innerHeight,
    1,
    2000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(4, 1, 1);
camera.lookAt(0, 0, 0);

orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 8, 1);
spotLight.position.set(-3, 3, 10);
spotLight.target.position.set(0, 0, 0);

scene.add(spotLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, -10);
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const Nx = 15;
const Ny = 15;
const mass = 1;
const clothSize = 1;
const dist = clothSize / Nx;

const shape = new CANNON.Particle();

const particles = [];

for(let i = 0; i < Nx + 1; i++) {
    particles.push([]);
    for(let j = 0; j < Ny + 1; j++) {
        const particle = new CANNON.Body({
            mass: j=== Ny ? 0 : mass,
            shape,
            position: new CANNON.Vec3((i - Nx * 0.5) * dist, (j - Ny * 0.5) * dist, 0),
            velocity: new CANNON.Vec3(0, 0, -0.1 * (Ny - j))
        });
        particles[i].push(particle);
        world.addBody(particle);
    }
}

function connect(i1, j1, i2, j2) {
    world.addConstraint(new CANNON.DistanceConstraint(
        particles[i1][j1],
        particles[i2][j2],
        dist
    ));
}

for(let i = 0; i < Nx + 1; i++) {
    for(let j = 0; j < Ny + 1; j++) {
        if(i < Nx)
            connect(i, j, i + 1, j);
        if(j < Ny)
            connect(i, j, i, j + 1);
    }
}

const clothGeometry = new THREE.PlaneGeometry(1, 1, Nx, Ny);

const clothMat = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    //wireframe: true,
    map: new THREE.TextureLoader().load('./texture.jpg')
});

const clothMesh = new THREE.Mesh(clothGeometry, clothMat);
scene.add(clothMesh);

function updateParticules() {
    for(let i = 0; i < Nx + 1; i++) {
        for(let j = 0; j < Ny + 1; j++) {
            const index = j * (Nx + 1) + i;

            const positionAttribute = clothGeometry.attributes.position;

            const position = particles[i][Ny - j].position;

            positionAttribute.setXYZ(index, position.x, position.y, position.z);

            positionAttribute.needsUpdate = true;
        }
    }
}

const sphereSize = 0.1;
const movementRadius = 0.2;

const sphereGeometry = new THREE.SphereGeometry(sphereSize);
const sphereMat = new THREE.MeshPhongMaterial();

const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMat);
scene.add(sphereMesh);

const sphereShape = new CANNON.Sphere(sphereSize * 1.3);
const sphereBody = new CANNON.Body({
    shape: sphereShape
});
world.addBody(sphereBody);

const timeStep = 1 / 60;
function animate(time) {
    world.step(timeStep);
    updateParticules();

    sphereBody.position.set(
        movementRadius * Math.sin(time / 500),
        5,
        movementRadius * Math.cos(time / 500) + 1.1
    )
    sphereBody.position.copy(sphereBody.position)
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});