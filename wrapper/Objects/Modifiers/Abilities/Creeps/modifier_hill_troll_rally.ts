import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hill_troll_rally extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(_params?: IModifierParams): [number, boolean] {
		return [this.cachedDamage * this.StackCount, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("damage_bonus", "hill_troll_rally")
	}
}
