import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Building")
export class Building extends Unit {
	@NetworkedBasicField("m_iHeroStatueOwnerPlayerID")
	public HeroStatueOwnerPlayerID = -1
	@NetworkedBasicField("m_bHeroStatue")
	public IsHeroStatue = false

	public get RingRadius(): number {
		return 64
	}
}
export const Buildings = EntityManager.GetEntitiesByClass(Building)
