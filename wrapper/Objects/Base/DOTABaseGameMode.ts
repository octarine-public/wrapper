import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTAHUDVisibility } from "../../Enums/DOTAHUDVisibility"
import { EventsSDK } from "../../Managers/EventsSDK"
import { HasBitBigInt } from "../../Utils/BitsExtensions"
import { Entity } from "./Entity"

@WrapperClass("CDOTABaseGameMode")
export class DOTABaseGameMode extends Entity {
	@NetworkedBasicField("m_nHUDVisibilityBits")
	public HUDVisibilityBits: bigint = 0xffffffffffffffffn

	public IsHUDVisible(elem: DOTAHUDVisibility): boolean {
		return HasBitBigInt(this.HUDVisibilityBits, BigInt(elem))
	}
}

export let GameMode: Nullable<DOTABaseGameMode>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof DOTABaseGameMode) GameMode = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (GameMode === ent) GameMode = undefined
})
