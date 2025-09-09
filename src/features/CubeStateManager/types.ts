import { Vector3Array } from "../../core/utils/float";

export type ServerCubeId = string;
export type ClientCubeId = number;

export type ServerCube = {
    id: ServerCubeId;
    position: Vector3Array;
    rotation: Vector3Array;
    color: number;
};

export type ClientCube = ServerCube & {
    clientId: ClientCubeId;
};

export type CubeStateUpdateType = "color" | "position" | "rotation";

export type CubeStateUpdate = {
  serverCube: ServerCube;
  clientCubeId: ClientCubeId;
  type: CubeStateUpdateType;
}

export type ClientCubesStore = {
  clientCubesUI: Record<ServerCubeId, ClientCube>;
  currentEditingCube: {
    id: ServerCubeId | undefined;
    showUpdatedFromServerWarning: boolean;
  }
}
