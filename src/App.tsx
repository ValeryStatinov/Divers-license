import './App.css';
import { Viewport } from './lib';
import { useEffect } from 'react';
import { cubeStateManager } from './features/CubeStateManager/CubeStateManager';
import { clientCubesStore } from './features/CubeStateManager/store';
import { LeftMenu } from './features/LeftMenu/LeftMenu';
import { CubesList } from './features/CubesList/CubesList';
import { FloatingPositionEditor } from './features/FloatingPositionEditor/FloatingPositionEditor';
import { useSnapshot } from 'valtio';


function App() {
  const clientCubesSnapshot = useSnapshot(clientCubesStore);
  const cubeServerId = clientCubesSnapshot.currentEditingCube.id ?? '';

  useEffect(() => {
    const fetchCubes = async () => {
      try {
        await cubeStateManager.fetchAndSyncCubes();
      } catch (error) {
        console.error(error);
      }
    }
    fetchCubes();

    const interval = setInterval(() => fetchCubes(), 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App" style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <LeftMenu />
      <CubesList />
      {cubeServerId && <FloatingPositionEditor key={cubeServerId} />}
      <Viewport />
    </div>
  );
}

export default App;
