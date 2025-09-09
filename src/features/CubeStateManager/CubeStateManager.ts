import { isVector3ArrayEqual, Vector3Array } from "../../core/utils/float";
import { API, viewportManager, viewportManager as viewportManagerLib } from "../../lib";
import { clientCubesStore } from "./store";
import { CubeStateUpdate, ServerCube, ServerCubeId } from "./types";

export class CubeStateManager {
  private viewportManager_: typeof viewportManagerLib;

  public constructor(viewportManager: typeof viewportManagerLib) {
    this.viewportManager_ = viewportManager;
  }

  public applyUpdates(toAdd: ServerCube[], toRemove: ServerCubeId[], toUpdate: CubeStateUpdate[]) {
    for (const serverCube of toAdd) {
      const clientCubeId = this.viewportManager_.cubeManager.addCube(serverCube.position, serverCube.rotation, serverCube.color);
      clientCubesStore.clientCubesUI[serverCube.id] = {
        ...serverCube,
        clientId: clientCubeId,
      };
    }

    for (const cubeStateUpdate of toUpdate) {
      const clientCube = clientCubesStore.clientCubesUI[cubeStateUpdate.serverCube.id];

      if (!clientCube) {
        console.error(`Failed to update cube state, client cube not found: ${cubeStateUpdate.serverCube.id}`);
        continue;
      }

      if (clientCube.id === clientCubesStore.currentEditingCube.id) {
        clientCubesStore.currentEditingCube.showUpdatedFromServerWarning = true;
      }

      switch (cubeStateUpdate.type) {
        case "color":
          this.viewportManager_.cubeManager.setCubeColor(clientCube.clientId, cubeStateUpdate.serverCube.color);
          // changing color is not supported yet
          // clientCubesStore.clientCubesUI[cubeStateUpdate.serverCube.id].color = cubeStateUpdate.serverCube.color;
          break;
        case "position":
          this.viewportManager_.cubeManager.setCubePosition(clientCube.clientId, cubeStateUpdate.serverCube.position);
          clientCubesStore.clientCubesUI[cubeStateUpdate.serverCube.id].position = cubeStateUpdate.serverCube.position;
          break;
        case "rotation":
          this.viewportManager_.cubeManager.setCubeRotation(clientCube.clientId, cubeStateUpdate.serverCube.rotation);
          clientCubesStore.clientCubesUI[cubeStateUpdate.serverCube.id].rotation = cubeStateUpdate.serverCube.rotation;
          break;
        default:
          console.error(`Failed to update cube state, unknown cube state update type: ${cubeStateUpdate.type}`);
      }
    }

    for (const serverCubeId of toRemove) {
      const clientCube = clientCubesStore.clientCubesUI[serverCubeId];

      if (!clientCube) {
        console.error(`Failed to remove cube, client cube not found: ${serverCubeId}`);
        continue;
      }

      if (clientCube.id === clientCubesStore.currentEditingCube.id) {
        clientCubesStore.currentEditingCube.showUpdatedFromServerWarning = true;
      }

      this.viewportManager_.cubeManager.removeCube(clientCube.clientId);
      delete clientCubesStore.clientCubesUI[serverCubeId];
    }

    console.log('clientCubesStore.clientCubesUI', clientCubesStore.clientCubesUI);
  }

  protected detectChanges(serverCubes: Record<string, ServerCube>) {
    const toAdd: ServerCube[] = [];
    const toRemove: ServerCubeId[] = [];
    const toUpdate: CubeStateUpdate[] = [];

    for (const serverCube of Object.values(serverCubes)) {
      const clientCube = clientCubesStore.clientCubesUI[serverCube.id];

      if (!clientCube) {
        toAdd.push(serverCube);

        continue;
      }

      if (clientCube.color !== serverCube.color) {
        toUpdate.push({
          serverCube,
          clientCubeId: clientCube.clientId,
          type: "color",
        });
      }

      if (!isVector3ArrayEqual(clientCube.position, serverCube.position)) {
        toUpdate.push({
          serverCube,
          clientCubeId: clientCube.clientId,
          type: "position",
        });
      }

      if (!isVector3ArrayEqual(clientCube.rotation, serverCube.rotation)) {
        toUpdate.push({
          serverCube,
          clientCubeId: clientCube.clientId,
          type: "rotation",
        });
      }
    }

    for (const clientCube of Object.values(clientCubesStore.clientCubesUI)) {
      if (!serverCubes[clientCube.id]) {
        toRemove.push(clientCube.id);
      }
    }

    return { toAdd, toRemove, toUpdate };
  }

  public syncCubes(serverCubes: Record<string, ServerCube>) {
    const { toAdd, toRemove, toUpdate } = this.detectChanges(serverCubes);

    console.log('toAdd', toAdd);
    console.log('toRemove', toRemove);
    console.log('toUpdate', toUpdate);

    if (toAdd.length > 0 || toRemove.length > 0 || toUpdate.length > 0) {
      this.applyUpdates(toAdd, toRemove, toUpdate);
    }
  }

  public async fetchAndSyncCubes() {
    const result = await API.getCubes();

    this.syncCubes(result);
  }
  
  public async updateCube(cubeId: ServerCubeId, position: Vector3Array, rotation: Vector3Array, color: number) {
    await API.updateCube(cubeId, position, rotation, color);
    await this.fetchAndSyncCubes();
  }

  public async createCube(position: Vector3Array, rotation: Vector3Array, color: number) {
    await API.createCube(position, rotation, color);
    await this.fetchAndSyncCubes();
  }

  public async deleteCube(cubeId: ServerCubeId) {
    await API.deleteCube(cubeId);
    await this.fetchAndSyncCubes();
  }
};

export const cubeStateManager = new CubeStateManager(viewportManager);
