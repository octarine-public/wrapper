import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Unit } from "../Base/Unit"

@WrapperClass("CDOTA_Unit_Tidehunter_Anchor")
export class npc_dota_unit_tidehunter_anchor extends Unit {
	@NetworkedBasicField("m_hTarget")
	private readonly targetHandle_ = 0
	public get Target() {
		return EntityManager.EntityByIndex<Unit>(this.targetHandle_)
	}
}
