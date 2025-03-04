import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_scepter_bonus_damage extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

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
		return [this.cachedBonusDamage * this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedBonusDamage = this.GetSpecialValue(
			"scepter_bonus_damage",
			"alchemist_goblins_greed"
		)
	}
}
