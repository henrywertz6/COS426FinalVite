import {
    Group,
    PlaneGeometry,
    Vector3,
    Mesh,
    Clock,
    DoubleSide,
    ShaderMaterial
} from 'three';

class Ocean extends Group {
    state: {
        ocean: Mesh;
        clock: Clock;
    };
    constructor(day: boolean) {
        // Call parent Group() constructor
        super();
        this.name = 'ocean';
        const geometry = new PlaneGeometry(70, 120, 40, 40); // Adjust size and segments as needed

        // Create custom shader material for water effect
        let material = new ShaderMaterial({
        side: DoubleSide,
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
        const material2 = new ShaderMaterial({
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
                vec3 darkBlue = vec3(0.0, 0.2, 0.4); // Adjust the RGB values for a darker shade
                gl_FragColor = vec4(darkBlue, 1.0 - color);
              }
            `,
          });
          if(!day){
            material = material2;
          }
        const mesh = new Mesh(geometry, material);
        // mesh.lookAt(new Vector3(0.2, 0.9, 0));
        // mesh.position.y = 7.6;
        // mesh.position.x = -23.8;
        mesh.lookAt(new Vector3(0, -1, 0));
        mesh.position.y = -0.8;
        mesh.position.x = -33;
        mesh.rotateY(Math.PI/32);

        this.state = {
            ocean: mesh,
            clock: new Clock(),
        };
        this.add(this.state.ocean);
    }
}

export default Ocean;


