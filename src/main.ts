import * as THREE from "three";

class Program {
    private container: HTMLElement;

    constructor() {
        const container: HTMLElement | null = document.getElementById("root")!;
        this.container = container
    }

    public run(): void {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        const map: HTMLCanvasElement | null = this.container.querySelector("#map")!;

        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
            antialias: true, canvas: map
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);
        document.body.appendChild(renderer.domElement);

        function animate() {

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);

        }
    }
}

const program = new Program();
program.run();

