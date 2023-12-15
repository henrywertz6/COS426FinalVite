import {
    Group,
    Line,
    BufferGeometry,
    LineBasicMaterial,
    Vector3,
} from 'three';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax

class Reel extends Group {
    state: {
        geometry: BufferGeometry;
        material: LineBasicMaterial;
        line: Line;
    };
    constructor(parent: SeedScene) {
        // Call parent Group() constructor
        super();
        const points = [];
        points.push(new Vector3(0, 6, 0));
        points.push(new Vector3(0, 0, 0));
        let geo = new BufferGeometry().setFromPoints(points);
        let mat = new LineBasicMaterial({ color: 0xffffff });
        mat.linewidth = 20;
        this.state = {
            geometry: geo,
            material: mat,
            line: new Line(geo, mat),
        };
        // Init state

        this.name = 'reel';
        this.add(this.state.line);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }


    changeLength(y: number): void {
        const points = [];
        points.push(new Vector3(0, 5.8, 0));
        points.push(new Vector3(0, y, 0));
        let geo = new BufferGeometry().setFromPoints(points);
        this.state.line.geometry = geo;
    }
    update(timeStamp: number): void {
      timeStamp = timeStamp;
    }
}

export default Reel;
