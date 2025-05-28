import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_giant_maul_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedCastTime = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CASTTIME_PERCENTAGE,
			this.GetCastTimePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_PERCENTAGE,
			this.GetAttackSpeedPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetCastTimePercentage(): [number, boolean] {
		return [-this.cachedCastTime, this.IsMagicImmune()]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}
	protected GetAttackSpeedPercentage(): [number, boolean] {
		return [-this.cachedAttackSpeed, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_giant_maul"
		this.cachedCastTime = this.GetSpecialValue("cast_slow", name)
		this.cachedSpeed = this.GetSpecialValue("movespeed_slow", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_slow", name)
	}
}
