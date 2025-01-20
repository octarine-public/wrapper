import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_shapeshift extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedRange = 150 // no special value
	private cachedVision = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE,
			this.GetMaxAttackRange.bind(this)
		]
	])
	public get ForceVisible(): boolean {
		return true
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMaxAttackRange(): [number, boolean] {
		return [this.cachedRange, false]
	}
	protected GetBonusNightVision(): [number, boolean] {
		return [this.cachedVision, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedVision = this.GetSpecialValue("bonus_night_vision", "lycan_shapeshift")
	}
}
