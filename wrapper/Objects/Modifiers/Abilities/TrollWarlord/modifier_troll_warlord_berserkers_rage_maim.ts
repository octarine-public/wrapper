import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_berserkers_rage_maim extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0

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

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedAttackSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "troll_warlord_berserkers_rage"
		this.cachedSpeed = this.GetSpecialValue("maim_slow", name)
		// "maim_attack_slow" "8 16 24 32" //note:currently unused in code, just tooltips.
		this.cachedAttackSpeed = this.cachedSpeed
	}
}
