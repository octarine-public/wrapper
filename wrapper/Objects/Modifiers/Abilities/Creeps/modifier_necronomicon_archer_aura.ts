import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_necronomicon_archer_aura extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	// private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
		// [
		// 	EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
		// 	this.GetAttackSpeedBonusConstant.bind(this)
		// ]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	// protected GetAttackSpeedBonusConstant(): [number, boolean] {
	// 	return [this.cachedAttackSpeed, false]
	// }

	protected UpdateSpecialValues(): void {
		const name = "necronomicon_archer_aoe"
		this.cachedSpeed = this.GetSpecialValue("ms_bonus", name)
		// this.cachedAttackSpeed = this.GetSpecialValue("as_bonus", name)
	}
}
