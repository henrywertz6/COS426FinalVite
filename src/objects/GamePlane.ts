import {
    Group,
    PlaneGeometry,
    Vector3,
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
} from 'three';

import SeedScene from '../scenes/SeaSceneNight';

class GamePlane extends Group {
    state: {
        gamePlane: Mesh;
    };
    constructor(parent: SeedScene) {
        // Call parent Group() constructor
        super();
        this.name = 'gamePlane';
        let points = [];
        points.push(new Vector3(0, -50, 50));
        points.push(new Vector3(0, 50, 50));
        points.push(new Vector3(0, -50, -50));
        points.push(new Vector3(0, 50, -50));

        const geometry = new PlaneGeometry().setFromPoints(points);
        const material = new MeshBasicMaterial({
            color: 0xffff00,
            side: DoubleSide,
        });
        material.transparent = true;
        material.opacity = 0;
        const plane = new Mesh(geometry, material);

        this.state = {
            gamePlane: plane,
        };
        this.add(this.state.gamePlane);
    }
}

export default GamePlane;
