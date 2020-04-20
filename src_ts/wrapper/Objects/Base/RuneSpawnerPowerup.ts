import Entity from "./Entity"

export default class RuneSpawnerPowerup extends Entity {
	public NativeEntity: Nullable<C_DOTA_Item_RuneSpawner_Powerup>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Item_RuneSpawner_Powerup", RuneSpawnerPowerup)
