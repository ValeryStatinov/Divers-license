import { useEffect, useState } from 'react';
import { clientCubesStore } from '../CubeStateManager/store';
import { useSnapshot } from 'valtio';
import { cn } from '../../core/utils/cn';
import { Vector3Array, isVector3ArrayEqual } from '../../core/utils/float';
import { cubeStateManager } from '../CubeStateManager/CubeStateManager';

interface PositionData {
  x: string;
  y: string;
  z: string;
}

interface RotationData {
  x: string;
  y: string;
  z: string;
}

const axises = ['x', 'y', 'z'] as const;

const checkRegex = (value: string) => {
  return !!value.match(/^-?([0-9]{1,})?(\.)?([0-9]{1,})?$/)
}

const getVector3Array = (v: PositionData | RotationData) => {
  return [
    parseFloat(v.x),
    parseFloat(v.y),
    parseFloat(v.z),
  ] as Vector3Array;
}

export const FloatingPositionEditor = () => {
  const clientCubesSnapshot = useSnapshot(clientCubesStore);
  const clientCubesUI = clientCubesSnapshot.clientCubesUI;
  const cubeServerId = clientCubesSnapshot.currentEditingCube.id ?? '';
  const isUpdatedFromServer = clientCubesSnapshot.currentEditingCube.showUpdatedFromServerWarning;
  const cube = clientCubesUI[cubeServerId];

  const [position, setPosition] = useState<PositionData>({
    x: cube?.position[0].toString() || '0',
    y: cube?.position[1].toString() || '0',
    z: cube?.position[2].toString() || '0',
  });
  const [rotation, setRotation] = useState<RotationData>({
    x: cube?.rotation[0].toString() || '0',
    y: cube?.rotation[1].toString() || '0',
    z: cube?.rotation[2].toString() || '0',
  });

  useEffect(() => {
    if (!cube) {
      return;
    }

    if (isUpdatedFromServer &&
      isVector3ArrayEqual(cube.position as Vector3Array, getVector3Array(position)) &&
      isVector3ArrayEqual(cube.rotation as Vector3Array, getVector3Array(rotation))) {
      clientCubesStore.currentEditingCube.showUpdatedFromServerWarning = false;
    }
  }, [cube, isUpdatedFromServer, position, rotation]);

  const handlePositionChange = (axis: keyof PositionData, value: string) => {
    if (checkRegex(value)) {
      setPosition({ ...position, [axis]: value });
    }
  };

  const handleRotationChange = (axis: keyof RotationData, value: string) => {
    if (checkRegex(value)) {
      setRotation({ ...rotation, [axis]: value });
    }
  };

  const handleBlur = async () => {
    if (!cube || isUpdatedFromServer) {
      return;
    }

    const newPosition: Vector3Array = [
      parseFloat(position.x) || 0,
      parseFloat(position.y) || 0,
      parseFloat(position.z) || 0,
    ]
    const newRotation: Vector3Array = [
      parseFloat(rotation.x) || 0,
      parseFloat(rotation.y) || 0,
      parseFloat(rotation.z) || 0,
    ]

    setPosition({
      x: newPosition[0].toString(),
      y: newPosition[1].toString(),
      z: newPosition[2].toString(),
    })

    setRotation({
      x: newRotation[0].toString(),
      y: newRotation[1].toString(),
      z: newRotation[2].toString(),
    })

    try {
      await cubeStateManager.updateCube(
        cubeServerId,
        newPosition,
        newRotation,
        cube?.color || 0,
      )
    } catch (error) {
      console.error(error);
    }
  }

  const handleRefresh = () => {
    clientCubesStore.currentEditingCube.showUpdatedFromServerWarning = false;

    if (!cube) {
      clientCubesStore.currentEditingCube.id = undefined;

      return;
    }

    setPosition({
      x: cube.position[0].toString(),
      y: cube.position[1].toString(),
      z: cube.position[2].toString(),
    })
    setRotation({
      x: cube.rotation[0].toString(),
      y: cube.rotation[1].toString(),
      z: cube.rotation[2].toString(),
    })
  }

  const warningMessage = !cube ? "Cube was deleted" : "Cube was updated";
  const refreshMessage = !cube ? "Close" : "Refresh";

  return (
    <div className="bg-white shadow-sm w-[280px] fixed right-[40px] bottom-[40px] border-1 border-[#CED4DE] rounded-t-[3px]">
      <div className={cn("flex items-center justify-between bg-[#575F6B] text-white px-[16px] py-[14px] rounded-t-[3px]", isUpdatedFromServer && "bg-[#ff8686]")}>
        <h3 className="text-lg font-bold">Position</h3>
        {isUpdatedFromServer &&
          <div className="text-white text-sm">
            <div>{warningMessage}</div>
            <button className="text-white text-sm p-1 border-1 border-white rounded-md cursor-pointer" onClick={handleRefresh}>{refreshMessage}</button>
          </div>
        }
      </div>

      <div className="bg-[#EDEFF2] px-[32px] py-[10px]">
        <h4 className="text-sm font-medium text-gray-800">Positon</h4>
      </div>

      <div className="px-[40px] py-[16px]">
        <div className="flex flex-col gap-[8px] text-sm">
          {axises.map((axis) => (
            <div key={axis} className="flex items-center">
              {axis}:
              <input
                value={position[axis]}
                onChange={(e) => handlePositionChange(axis, e.target.value)}
                onBlur={handleBlur}
                className="w-full ml-[8px] px-2 py-1 text-sm border border-[#CED4DE] rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                disabled={isUpdatedFromServer}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#EDEFF2] px-[32px] py-[10px]">
        <h4 className="text-sm font-medium text-gray-800">Rotation</h4>
      </div>

      <div className="px-[40px] py-[16px]">
        <div className="flex flex-col gap-[8px] text-sm">
          {axises.map((axis) => (
            <div key={axis} className="flex items-center">
              {axis}:
              <input
                value={rotation[axis]}
                onChange={(e) => handleRotationChange(axis, e.target.value)}
                onBlur={handleBlur}
                className="w-full ml-[8px] px-2 py-1 text-sm border border-[#CED4DE] rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                disabled={isUpdatedFromServer}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#EDEFF2] px-[32px] py-[10px]">
        <h4 className="text-sm font-medium text-gray-800">Color</h4>
      </div>

      <div className="px-[40px] py-[16px] text-sm">Color: {cube?.color.toString(16)}</div>
    </div>
  );
};
