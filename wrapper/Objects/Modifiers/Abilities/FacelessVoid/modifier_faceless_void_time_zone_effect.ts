import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_faceless_void_time_zone_effect extends Modifier {
	private cachedSpeed = 0
	private cachedTurnRate = 0
	private cachedCastTime = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CASTTIME_PERCENTAGE,
			this.GetCastTimePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE,
			this.GetTurnRatePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetCastTimePercentage(): [number, boolean] {
		return [this.getValueByTeam(this.cachedCastTime), this.IsMagicImmune()]
	}

	protected GetTurnRatePercentage(): [number, boolean] {
		return [this.getValueByTeam(this.cachedTurnRate), this.IsMagicImmune()]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.getValueByTeam(this.cachedSpeed), this.IsMagicImmune()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.getValueByTeam(this.cachedAttackSpeed), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "faceless_void_time_zone"
		this.cachedSpeed = this.GetSpecialValue("bonus_move_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		this.cachedTurnRate = this.GetSpecialValue("bonus_turn_speed", name)
		this.cachedCastTime = this.GetSpecialValue("bonus_cast_speed", name)
	}

	private getValueByTeam(currValue: number) {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return 0
		}
		return owner.IsEnemy(caster) ? -currValue : currValue
	}
}
