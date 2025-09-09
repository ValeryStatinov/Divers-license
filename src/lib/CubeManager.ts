// DO NOT MODIFY THIS FILE

import {BoxGeometry, BufferGeometry, Color, Mesh, MeshPhongMaterial, Scene} from "three";
import {Vector3Array} from "./base";

export default class CubeManager {
    protected _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    /**
     * Creates a new cube and adds it to the scene at the given position.
     *
     * @param position - 3-tuple of numbers corresponding to x, y, z
     * @param rotation - 3-tuple of euler angles
     * @param color
     *
     * @returns Viewport Object ID
     */
    addCube(position: Vector3Array, rotation: Vector3Array, color: number): number {
        const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshPhongMaterial({
            color,
        }))
        cube.position.set(position[0], position[1], position[2]);
        cube.rotation.set(rotation[0], rotation[1], rotation[2]);

        this._scene.add(cube);

        return cube.id;
    }

    /**
     * Remove cube from scene.
     *
     * @param id - Viewport Object ID
     */
    removeCube(id: number) {
        const cube = this._getCube(id);
        cube?.removeFromParent();
    }

    /**
     * Sets the cube's color.
     *
     * @param id - Viewport Object ID
     * @param color - RGB color encoded as a number. E.g. 0xff0000 for red or 0xffff00 for yellow
     */
    setCubeColor(id: number, color: number) {
        const cube = this._getCube(id);
        if (cube === undefined) {
            return;
        }
        cube.material.color = new Color(color);
    }

    /**
     * Sets the cube's position.
     *
     * @param id - Viewport Object ID
     * @param position - 3-tuple of numbers corresponding to x, y, z
     */
    setCubePosition(id: number, position: Vector3Array) {
        const cube = this._getCube(id);
        cube?.position.set(position[0], position[1], position[2]);
    }

    /**
     * Sets the cube's rotation as euler angles in radians.
     *
     * @param id - Viewport Object ID
     * @param rotation - 3-tuple of euler angles in radians.
     */
    setCubeRotation(id: number, rotation: Vector3Array) {
        const cube = this._getCube(id);
        cube?.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    protected _getCube(id: number): Mesh<BufferGeometry, MeshPhongMaterial> | undefined {
        const cube = this._scene.getObjectById(id);
        if (cube === undefined || !(cube instanceof Mesh) || !(cube.material instanceof MeshPhongMaterial)) {
            return;
        }
        return cube as Mesh<BufferGeometry, MeshPhongMaterial>;
    }
}