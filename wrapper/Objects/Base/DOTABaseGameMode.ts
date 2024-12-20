import {
	AttackSpeedData,
	SetArmorPerAgilityInternal,
	SetHealthGainPerStrengthInternal,
	SetMagicResistPerIntellectInternal,
	SetMeleeDamageBlockAmountInternal
} from "../../Data/GameData"
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
	public readonly AttackSpeedMax: number = 0
	@NetworkedBasicField("m_flMinimumAttackSpeed")
	public readonly AttackSpeedMin: number = 0
	@NetworkedBasicField("m_nCustomGameForceHeroSelectionId", EPropertyType.UINT32)
	public readonly CustomGameForceHeroSelectionId: number = -1
	@NetworkedBasicField("m_flAgilityArmor")
	public readonly AgilityArmor: number = 0
	@NetworkedBasicField("m_flIntelligenceMres")
	public readonly IntelligenceMres: number = 0
	@NetworkedBasicField("m_nInnateMeleeDamageBlockAmount")
	public readonly InnateMeleeDamageBlockAmount: number = 0
	@NetworkedBasicField("m_nInnateMeleeDamageBlockPct")
	public readonly InnateMeleeDamageBlockPct: number = 0
	@NetworkedBasicField("m_nInnateMeleeDamageBlockPerLevelAmount")
	public readonly InnateMeleeDamageBlockPerLevelAmount: number = 0

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
	SetArmorPerAgilityInternal(ent.AgilityArmor)
	SetHealthGainPerStrengthInternal(ent.StrengthHP)
	SetMagicResistPerIntellectInternal(ent.IntelligenceMres)
	SetMeleeDamageBlockAmountInternal(ent.InnateMeleeDamageBlockAmount)
	AttackSpeedData.SetMinMaxFactorInternal(ent.AttackSpeedMin, ent.AttackSpeedMax)
})

EventsSDK.on("EntityDestroyed", ent => {
	if (GameMode === ent) {
		GameMode = undefined
	}
})
