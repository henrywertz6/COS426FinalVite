import {
    Group,
    PlaneGeometry,
    Vector3,
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
} from 'three';

import SeedScene from '../scenes/SeaScene';

class Sky extends Group {
    state: {
        sky: Mesh;
    };
    constructor(parent: SeedScene, day: boolean) {
        // Call parent Group() constructor
        super();
        this.name = 'sky';
        let points = [];
        points.push(new Vector3(-30, 0, 50));
        points.push(new Vector3(-30, 0, -50));
        points.push(new Vector3(-30, 50, 50));
        points.push(new Vector3(-30, 50, -50));

        const geometry = new PlaneGeometry().setFromPoints(points);
        let material = new MeshBasicMaterial({
            color: 0x87CEEB,
            side: DoubleSide,
            transparent: true,
            opacity: 0.8,
        });
        const material2 = new MeshBasicMaterial({
            color: 0x0c1445,
            transparent: true,
            opacity: 0.8,
        });
        if(!day) {
            material = material2;
        }
        const plane = new Mesh(geometry, material);
        this.state = {
            sky: plane,
        };
        this.add(this.state.sky);
    }
}

export default Sky;
