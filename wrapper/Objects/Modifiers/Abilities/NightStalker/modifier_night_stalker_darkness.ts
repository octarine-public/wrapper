import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_night_stalker_darkness extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShouldDoFlyHeightVisual = true

	private cachedBonusDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedBonusDamage, false] // not disabled by day (e.g Phoenix supernova)
	}
	protected UpdateSpecialValues(): void {
		this.cachedBonusDamage = this.GetSpecialValue(
			"bonus_damage",
			"night_stalker_darkness"
		)
	}
}
