import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_slark_shadow_dance extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const caster = this.Caster
		if (caster === undefined) {
			this.cachedSpeed = 0
			this.cachedAttackSpeed = 0
			return
		}
		this.updateMoveSpeed(caster)
		this.cachedAttackSpeed = this.getSpeedByAbilityName(
			"special_bonus_unique_slark_7",
			"value",
			caster
		)
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	private getSpeedByAbilityName(abilName: string, specialName: string, owner: Unit) {
		const abil = owner.GetAbilityByName(abilName)
		if (abil === undefined || abil.Level === 0) {
			return 0
		}
		return abil.GetSpecialValue(specialName)
	}

	private updateMoveSpeed(caster: Unit) {
		const modifier = caster.GetBuffByName("modifier_slark_shadow_dance_passive_regen")
		if (modifier !== undefined || caster.IsPassiveDisabled) {
			this.cachedSpeed = 0
			return
		}
		this.cachedSpeed = this.getSpeedByAbilityName(
			"slark_barracuda",
			"bonus_movement_speed",
			caster
		)
	}
}
