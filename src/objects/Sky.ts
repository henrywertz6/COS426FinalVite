import {
    Group,
    PlaneGeometry,
    Vector3,
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
} from 'three';

class Sky extends Group {
    state: {
        sky: Mesh;
    };
    constructor(day: boolean) {
        // Call parent Group() constructor
        super();
        this.name = 'sky';
        let points = [];
        points.push(new Vector3(-25, 4, 50));
        points.push(new Vector3(-25, 4, -50));
        points.push(new Vector3(-25, 50, 50));
        points.push(new Vector3(-25, 50, -50));

        const geometry = new PlaneGeometry().setFromPoints(points);
        let material = new MeshBasicMaterial({
            color: 0xADD8E6,
            side: DoubleSide,
            transparent: true,
            opacity: 1,
        });
        const material2 = new MeshBasicMaterial({
            color: 0x0c1445,
            side: DoubleSide,
            transparent: true,
            opacity: 1,
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
