// DO NOT MODIFY THIS FILE

import API from "./api";
import {Cube, Vector3Array} from "./base";

const _ACTIONS = ['addCube', 'deleteCube', 'updateColor', 'updatePosition', 'updateRotation'] as const;
const _P_DIST = [0, 0, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];

function _randomColor(): number {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return (r << 16) | (g << 8) | b;
}

function _randomPosition(): Vector3Array {
    return [
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
    ]
}

function _randomRotation(): Vector3Array {
   return [
       2.0 * Math.random() * Math.PI,
       2.0 * Math.random() * Math.PI,
       2.0 * Math.random() * Math.PI,
   ];
}

function _randomExistingCube(): Cube | null {
    const cubesStr = localStorage.getItem("cubes");
    const cubesMap: Record<string, Cube> = cubesStr !== null ? JSON.parse(cubesStr) : {};
    const cubes = Object.values(cubesMap);
    if (cubes.length === 0) {
        return null;
    }
    const randomIdx = Math.floor(Math.random() * cubes.length);
    return cubes[randomIdx];
}

function doSomething() {
    const pDistIdx = Math.floor(Math.random() * _P_DIST.length);
    const actionIdx = _P_DIST[pDistIdx];
    let apiAction: Promise<unknown> = Promise.resolve();

    switch (_ACTIONS[actionIdx]) {
        case "addCube": {
            apiAction = API.createCube(_randomPosition(), _randomRotation(), _randomColor());
            break;
        }
        case "deleteCube": {
            const cube = _randomExistingCube();
            if (cube !== null) {
                apiAction = API.deleteCube(cube.id);
            }
            break;
        }
        case "updateColor": {
            const cube = _randomExistingCube();
            if (cube !== null) {
                apiAction = API.updateCube(cube.id, cube.position, cube.rotation, _randomColor());
            }
            break;
        }
        case "updatePosition": {
            const cube = _randomExistingCube();
            if (cube !== null) {
                apiAction = API.updateCube(cube.id, _randomPosition(), cube.rotation, cube.color);
            }
            break;
        }
        case "updateRotation": {
            const cube = _randomExistingCube();
            if (cube !== null) {
                apiAction = API.updateCube(cube.id, cube.position, _randomRotation(), cube.color);
            }
            break;
        }
    }

    apiAction.then(() => {
        window.setTimeout(() => {
            doSomething();
        }, Math.random() * 2000 + 1000);
    });
}

doSomething();