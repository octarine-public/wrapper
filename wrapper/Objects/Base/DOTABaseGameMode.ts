import { AttackSpeedData, SetHealthGainPerStrength } from "../../Data/GameData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTAHUDVisibility } from "../../Enums/DOTAHUDVisibility"
import { EPropertyType } from "../../Enums/PropertyType"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity } from "./Entity"

// only local server
@WrapperClass("CDOTABaseGameMode")
export class DOTABaseGameMode extends Entity {
	@NetworkedBasicField("m_flStrengthHP")
	public readonly StrengthHP: number = 0
	@NetworkedBasicField("m_nHUDVisibilityBits")
	public readonly HUDVisibilityBits: bigint = 0xffffffffffffffffn
	@NetworkedBasicField("m_flMaximumAttackSpeed")
	public readonly MaximumAttackSpeed: number = 0
	@NetworkedBasicField("m_flMinimumAttackSpeed")
	public readonly MinimumAttackSpeed: number = 0
	@NetworkedBasicField("m_nCustomGameForceHeroSelectionId", EPropertyType.UINT32)
	public readonly CustomGameForceHeroSelectionId: number = -1
	public IsHUDVisible(elem: DOTAHUDVisibility): boolean {
		return this.HUDVisibilityBits.hasBit(BigInt(elem))
	}
}

export let GameMode: Nullable<DOTABaseGameMode>
EventsSDK.on("PreEntityCreated", ent => {
	if (!(ent instanceof DOTABaseGameMode)) {
		return
	}
	GameMode = ent
	SetHealthGainPerStrength(ent.StrengthHP)
	AttackSpeedData._UpdateMinMax(ent.MinimumAttackSpeed, ent.MaximumAttackSpeed)
})

EventsSDK.on("EntityDestroyed", ent => {
	if (GameMode === ent) {
		GameMode = undefined
	}
})
