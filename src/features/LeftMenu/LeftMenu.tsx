import AddCubeIcon from '../../core/icons/DIVE_add-cube_24px.svg?react';
import { cubeStateManager } from '../CubeStateManager/CubeStateManager';

export const LeftMenu = () => {
  const handleClick = async () => {
    try {
      await cubeStateManager.createCube([0, 0, 0], [0, 0, 0], 0);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-[72px] bg-white">
      <div className="pt-[16px] pl-[23px] pr-[23px] font-bold text-sm">
        Add
      </div>
      <div className="mt-[4px] ml-[16px] mr-[16px] border-t-2 border-gray-200" />

      <button className="flex flex-col items-center mt-[8px] w-full h-[75px] cursor-pointer" onClick={handleClick}>
        <AddCubeIcon />
        <div className="text-xs mt-[2px]">Cube</div>
      </button>
    </nav>
  )
}