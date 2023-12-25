import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
import { AbilityData } from "../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_smoke_of_deceit extends Modifier {
	protected SetAmplifierMoveSpeed(specialName = "bonus_movement_speed"): void {
		const level = this.AbilityLevel
		const abilName = this.Name.replace("modifier_", "item_")
		const abilityData = AbilityData.GetAbilityByName(abilName)
		const specialValue = abilityData?.GetSpecialValue(specialName, level) ?? 0
		this.BonusMoveSpeedAmplifier = specialValue / 100
	}
}
