import {
    Group,
    PlaneGeometry,
    Vector3,
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
    ObjectSpaceNormalMap,
    LoadingManager,
    ShaderMaterial
} from 'three';

import SeedScene from '../scenes/SeaScene';

class Ocean extends Group {
    state: {
        ocean: Mesh;
    };
    constructor(parent: SeedScene) {
        // Call parent Group() constructor
        super();
        this.name = 'ocean';
        const geometry = new PlaneGeometry(80, 50, 50, 50); // Adjust size and segments as needed

        // Create custom shader material for water effect
        const material = new ShaderMaterial({
        vertexShader: `
            varying vec2 vUv;

            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;

            void main() {
            float color = sin(vUv.x * 10.0) * 0.1 + sin(vUv.y * 10.0) * 0.1;
            gl_FragColor = vec4(0.0, 0.5, 1.0, 1.0 - color);
            }
        `,
        });
        const mesh = new Mesh(geometry, material);
        mesh.lookAt(new Vector3(0.2, 0.9, 0));
        mesh.position.y = 7.6;
        mesh.position.x = -23.8;


        this.state = {
            ocean: mesh,
        };
        this.add(this.state.ocean);
    }
    update(timeStamp: number): void {
        //this.state.ocean.rotation.x += timeStamp;
        // this.state.ocean.rotation.y += timeStamp;
    }
}

export default Ocean;


