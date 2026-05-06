import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_summon_wolves_hightail extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMinSpeed = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [this.cachedMinSpeed, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "lycan_summon_wolves_hightail"
		this.cachedMinSpeed = this.GetSpecialValue("min_movespeed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
