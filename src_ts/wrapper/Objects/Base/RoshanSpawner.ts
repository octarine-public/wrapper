import Entity from "./Entity"

export default class RoshanSpawner extends Entity {
	public NativeEntity: Nullable<C_DOTA_RoshanSpawner>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_RoshanSpawner", RoshanSpawner)
