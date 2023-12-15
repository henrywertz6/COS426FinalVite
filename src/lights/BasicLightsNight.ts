import {
    Group,
    SpotLight,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    DirectionalLightHelper,
    AxesHelper,
    SpotLightHelper,
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

        let dirLight = new SpotLight(0xffffff, 3);
        dirLight.position.set(5, 4, 8);
        dirLight.target.position.set(0, 5, 3);
        dirLight.decay = 0;
        dirLight.angle = Math.PI / 12;
        let dirLight2 = new SpotLight(0xffffff, 3);
        dirLight2.position.set(3, 5, -3);
        dirLight2.target.position.set(0, 5, 3);
        dirLight2.decay = 0;
        dirLight2.angle = Math.PI / 12;

        let waterLight = new SpotLight(0x12205e, 100);
        waterLight.position.set(0, 2, 0);
        waterLight.intensity = 100;
        waterLight.target.position.set(0, -20, 0);
        waterLight.power = 100;
        waterLight.decay = 0;
        waterLight.angle = Math.PI / 2;
        let regularLight = new SpotLight(0xffffff, 3);
        regularLight.position.set(0, 2, 0);
        regularLight.intensity = 100;
        regularLight.target.position.set(0, 20, 0);
        regularLight.power = 30;
        regularLight.decay = 0;
        regularLight.angle = Math.PI / 2;

        let waterLight2 = new SpotLight(0x12205e, 100);
        waterLight2.intensity = 100;
        waterLight2.position.set(15, 3, 0);
        waterLight2.target.position.set(0, -25, 0);
        waterLight2.decay = 0;
        waterLight2.power = 200;

        const helper1 = new SpotLightHelper(dirLight, 0xffffff);
        const helper2 = new SpotLightHelper(dirLight2, 0xffffff);
        const helper3 = new SpotLightHelper(waterLight, 0xffffff);
        const helper4 = new SpotLightHelper(waterLight2, 0xffffff);
        const helper5 = new SpotLightHelper(regularLight, 0xffffff);
        const axesHelper = new AxesHelper(2);
        this.add(
            dirLight,
            dirLight2,
            waterLight,
            waterLight2,
            regularLight,
            // helper5
        );
    }
}

export default BasicLights;
