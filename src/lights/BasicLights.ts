import {
    Group,
    SpotLight,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
} from 'three';

class BasicLights extends Group {
    constructor() {
        // Invoke parent Group() constructor
        super();

        // const dir = new SpotLight(0xffffff, 1.6, 15, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 5);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        // dir.position.set(10, 2, 5);
        ambi.position.set(10, 2, 5);
        // dir.target.position.set(0, 0, 0);

        let hemiLight = new HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 300, 0);

        let dirLight = new DirectionalLight(0xffffff, 3);
        dirLight.position.set(75, 300, -75);
        let dirLight2 = new DirectionalLight(0xffffff, 3);
        dirLight.position.set(75, -300, -75);

        this.add(ambi, hemi, dirLight, hemiLight, dirLight2);
    }
}

export default BasicLights;
