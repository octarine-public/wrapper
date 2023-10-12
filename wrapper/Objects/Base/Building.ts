import { QAngle } from "../../Base/QAngle"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { RegisterFieldHandler } from "../NativeToSDK"
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

RegisterFieldHandler(Building, "m_angInitialAngles", (ent, newVal) => {
	ent.NetworkedAngles_.CopyFrom(newVal as QAngle)
	ent.UpdatePositions()
})
