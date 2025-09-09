// DO NOT MODIFY THIS FILE

import {Cube, Vector3Array} from "./base";

function _getId(): string {
    return window.crypto.randomUUID();
}

function _getCubes(): Record<string, Cube> {
    const cubesStr = localStorage.getItem("cubes");
    return cubesStr !== null ? JSON.parse(cubesStr) : {};
}

function _getRandomTimeout(): number {
    return Math.random() * 4500 + 250;
}

function getCubes(): Promise<Record<string, Cube>> {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            resolve(_getCubes());
        }, _getRandomTimeout());
    })
}

function createCube(position: Vector3Array, rotation: Vector3Array, color: number): Promise<{ id: string }> {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            const id = _getId();
            const existingCubes = _getCubes();
            localStorage.setItem("cubes", JSON.stringify({
                ...existingCubes,
                [id]: {id: id, position, rotation, color}
            }));
            resolve({id});
        }, _getRandomTimeout());
    });
}

function deleteCube(id: string): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            const cubes = _getCubes();


            localStorage.setItem("cubes", JSON.stringify(
                Object.fromEntries(Object.entries(cubes).filter(([, cube]) => cube.id !== id))
            ));
            resolve();
        }, _getRandomTimeout());
    });
}

function updateCube(id: string, position: Vector3Array, rotation: Vector3Array, color: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            const cubes = _getCubes();
            const cube = cubes[id];

            if (cube) {
                cube.position = position;
                cube.rotation = rotation;
                cube.color = color;
            }

            localStorage.setItem("cubes", JSON.stringify(cubes));

            resolve();
        }, _getRandomTimeout());
    })
}

const API = {
    getCubes,
    createCube,
    deleteCube,
    updateCube,
};

export default API;