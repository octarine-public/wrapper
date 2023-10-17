import { QAngle } from "../../Base/QAngle"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Building")
export class Building extends Unit {
	/**
	 * The owner player ID of the hero statue.
	 * @readonly
	 * @description Represents the owner player ID of the hero statue.
	 */
	@NetworkedBasicField("m_iHeroStatueOwnerPlayerID")
	public HeroStatueOwnerPlayerID: number = -1

	/**
	 * The status of the hero statue.
	 * @readonly
	 * @description Represents the status of the hero statue.
	 */
	@NetworkedBasicField("m_bHeroStatue")
	public IsHeroStatue: boolean = false

	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsBuilding = true
	}

	public get RingRadius(): number {
		return 64
	}
}

export const Buildings = EntityManager.GetEntitiesByClass(Building)
RegisterFieldHandler(Building, "m_angInitialAngles", (ent, newVal) => {
	ent.NetworkedAngles_.CopyFrom(newVal as QAngle)
	ent.UpdatePositions()
})
