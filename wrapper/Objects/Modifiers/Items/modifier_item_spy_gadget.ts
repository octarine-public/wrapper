import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_spy_gadget extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedCastRange = 0
	private cachedAttackRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, false]
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		return [(this.Parent?.IsRanged ?? false) ? this.cachedAttackRange : 0, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_spy_gadget"
		this.cachedCastRange = this.GetSpecialValue("cast_range", name)
		this.cachedAttackRange = this.GetSpecialValue("attack_range", name)
	}
}
