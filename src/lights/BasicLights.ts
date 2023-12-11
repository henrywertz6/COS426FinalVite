import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor() {
        // Invoke parent Group() constructor
        super();

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 5);
        const ambi2 = new AmbientLight(0x404040, 5);
        const ambi3 = new AmbientLight(0x404040, 5);
        const amb4 = new AmbientLight(0x404040, 5);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        dir.position.set(10, 2, 5);
        dir.target.position.set(0, 0, 0);

        this.add(ambi, ambi2, ambi3, amb4, hemi, dir);
    }
}

export default BasicLights;
