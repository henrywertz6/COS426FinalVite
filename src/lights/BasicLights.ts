import {
    Group,
    SpotLight,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    SpotLightHelper,
} from 'three';

class BasicLights extends Group {
    constructor() {
        // Invoke parent Group() constructor
        super();

        const ambi = new AmbientLight(0x404040, 5);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        ambi.position.set(10, 2, 5);

        let hemiLight = new HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 300, 0);

        let dirLight = new DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(75, -10, -75);
        let dirLight2 = new DirectionalLight(0xffffff, 1.5);
        dirLight2.position.set(75, -10, 75);

        let regularLight = new SpotLight(0xffffff, 3);
        regularLight.position.set(0, 2, 0);
        regularLight.intensity = 100;
        regularLight.target.position.set(0, 20, 0);
        regularLight.power = 30;
        regularLight.decay = 0;
        regularLight.angle = Math.PI / 2;

        let helper1 = new SpotLightHelper(regularLight);
        helper1 = helper1;

        this.add(ambi, hemi, dirLight, dirLight2, hemiLight, regularLight);
    }
}

export default BasicLights;
