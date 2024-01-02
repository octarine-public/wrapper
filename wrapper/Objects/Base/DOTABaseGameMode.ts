import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTAHUDVisibility } from "../../Enums/DOTAHUDVisibility"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity } from "./Entity"

// only local server
@WrapperClass("CDOTABaseGameMode")
export class DOTABaseGameMode extends Entity {
	@NetworkedBasicField("m_nHUDVisibilityBits")
	public HUDVisibilityBits: bigint = 0xffffffffffffffffn

	@NetworkedBasicField("m_flMaximumAttackSpeed")
	public MaximumAttackSpeed: number = 0

	@NetworkedBasicField("m_flMinimumAttackSpeed")
	public MinimumAttackSpeed: number = 0

	@NetworkedBasicField("m_nCustomGameForceHeroSelectionId")
	public CustomGameForceHeroSelectionId: number = -1

	public IsHUDVisible(elem: DOTAHUDVisibility): boolean {
		return this.HUDVisibilityBits.hasBit(BigInt(elem))
	}
}

export let GameMode: Nullable<DOTABaseGameMode>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof DOTABaseGameMode) {
		GameMode = ent
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (GameMode === ent) {
		GameMode = undefined
	}
})
