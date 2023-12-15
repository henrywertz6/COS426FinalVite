import {
    Group,
    LoadingManager,
    Line,
    BufferGeometry,
    LineBasicMaterial,
    Vector3,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

import SeedScene from '../scenes/SeaScene';
import { Geometry } from 'three/examples/jsm/deprecated/Geometry.js';

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
        // 5.5y 0.15z

        this.name = 'reel';
        this.add(this.state.line);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    // Function to make the line shake
    shakeLine() {
        const initialPosition = this.state.line.position.clone();
        console.log(initialPosition);

        const duration = 0.5; // Duration of the shake in seconds
        const magnitude = 0.1; // Magnitude of the shake

        const startTime = Date.now();

        const updatePosition = () => {
            const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
            if (elapsed < duration) {
                const progress = elapsed / duration;
                const angle = progress * Math.PI * 2;
                const offsetX = Math.sin(angle) * magnitude;
                const offsetY = Math.cos(angle) * magnitude;

                this.state.line.position.set(
                    initialPosition.x + offsetX,
                    initialPosition.y + offsetY,
                    initialPosition.z
                );

                requestAnimationFrame(updatePosition);
            } else {
                // Reset position after the shake is complete
                this.state.line.position.copy(initialPosition);
            }
        };

        updatePosition();
    }

    changeLength(y: number): void {
        const points = [];
        points.push(new Vector3(0, 5.8, 0));
        points.push(new Vector3(0, y, 0));
        let geo = new BufferGeometry().setFromPoints(points);
        this.state.line.geometry = geo;
    }
    update(timeStamp: number): void {}
}

export default Reel;
