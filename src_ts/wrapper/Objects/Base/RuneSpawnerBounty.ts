import Entity from "./Entity"

export default class RuneSpawnerBounty extends Entity {
	public NativeEntity: Nullable<C_DOTA_Item_RuneSpawner_Bounty>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Item_RuneSpawner_Bounty", RuneSpawnerBounty)
