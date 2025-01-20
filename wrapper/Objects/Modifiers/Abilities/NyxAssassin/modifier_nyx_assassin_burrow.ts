import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nyx_assassin_burrow extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedIncDamage = 0
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [-this.cachedIncDamage, false]
	}
	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "nyx_assassin_burrow"
		this.cachedCastRange = this.GetSpecialValue("cast_range", name)
		this.cachedIncDamage = this.GetSpecialValue("damage_reduction", name)
	}
}
