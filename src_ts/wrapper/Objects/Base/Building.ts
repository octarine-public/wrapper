import Unit from "./Unit"

export default class Building extends Unit {
	public NativeEntity: Nullable<C_DOTA_BaseNPC_Building>
	public HeroStatueOwnerPlayerID = -1
	public IsHeroStatue = false
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Building", Building)
RegisterFieldHandler(Building, "m_iHeroStatueOwnerPlayerID", (building, new_val) => building.HeroStatueOwnerPlayerID = new_val as number)
RegisterFieldHandler(Building, "m_bHeroStatue", (building, new_val) => building.IsHeroStatue = new_val as boolean)

