import { proxy } from "valtio";
import { ClientCubesStore } from "./types";

export const clientCubesStore = proxy<ClientCubesStore>({
  clientCubesUI: {},
  currentEditingCube: { id: undefined, showUpdatedFromServerWarning: false },
});