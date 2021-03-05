import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTAHUDVisibility_t } from "../../Enums/DOTAHUDVisibility_t"
import { BitsExtensions } from "../../Imports"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "./Entity"

@WrapperClass("CDOTABaseGameMode")
export default class DOTABaseGameMode extends Entity {
	@NetworkedBasicField("m_nHUDVisibilityBits")
	public HUDVisibilityBits: bigint = 0xFFFFFFFFFFFFFFFFn

	public IsHUDVisible(elem: DOTAHUDVisibility_t): boolean {
		return BitsExtensions.HasBitBigInt(this.HUDVisibilityBits, BigInt(elem))
	}
}

export let GameMode: Nullable<DOTABaseGameMode>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof DOTABaseGameMode)
		GameMode = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (GameMode === ent)
		GameMode = undefined
})
