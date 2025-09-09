import React from "react";
import { useSnapshot } from "valtio";
import { clientCubesStore } from "../CubeStateManager/store";
import { cn } from "../../core/utils/cn";
import CubeIcon from '../../core/icons/cube_16px.svg?react';
import DeleteIcon from '../../core/icons/delete_16px.svg?react';
import { cubeStateManager } from "../CubeStateManager/CubeStateManager";

export const CubesList = () => {
  const clientCubesSnapshot = useSnapshot(clientCubesStore);

  const handleDelete = async (cubeId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      await cubeStateManager.deleteCube(cubeId);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="fixed left-[72px] flex flex-col gap-[8px] top-0 h-full w-[264px] pt-[16px] pl-[8px] pr-[8px] border-l-1 border-[#CED4DE] border-r-1 bg-white">
      {Object.values(clientCubesSnapshot.clientCubesUI).map((cube) => (
        <button key={cube.id} className={cn("flex items-center justify-between w-full p-[4px] rounded-[4px] h-[24px] cursor-pointer",
          clientCubesSnapshot.currentEditingCube.id === cube.id && "bg-[#EDF5FC]")}
          onClick={() => {
            clientCubesStore.currentEditingCube.id = cube.id;
            clientCubesStore.currentEditingCube.showUpdatedFromServerWarning = false;
          }}
        >
          <div className="flex items-center gap-[4px]">
            <CubeIcon />
            <span>Cube</span>
          </div>
          <button onClick={(event) => handleDelete(cube.id, event)} className="cursor-pointer hover:text-red-500">
            <DeleteIcon />
          </button>
        </button>
      ))}
    </div>
  )
};
