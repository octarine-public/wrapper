import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_yasha_and_kaya extends Modifier {
	private cachedSpeed = 0
	private cachedCastTime = 0
	private cachedAttackSpeed = 0
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CASTTIME_PERCENTAGE,
			this.GetCastTimePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
			this.GetSpellAmplifyPercentageUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
			this.GetMoveSpeedBonusPercentageUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetCastTimePercentage(): [number, boolean] {
		return [this.cachedCastTime, false]
	}

	protected GetSpellAmplifyPercentageUnique(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}

	protected GetMoveSpeedBonusPercentageUnique(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_yasha_and_kaya"
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amp", name)
		this.cachedCastTime = this.GetSpecialValue("cast_speed_pct", name)
		this.cachedSpeed = this.GetSpecialValue("movement_speed_percent_bonus", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
