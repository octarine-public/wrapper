import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sniper_headshot extends Modifier {
	private cachedBonusDamage = 0

	public get AttackDamageBonus() {
		return !this.IsPassiveDisabled() ? this.cachedBonusDamage : 0
	}
	protected UpdateSpecialValues(): void {
		this.cachedBonusDamage = this.GetSpecialValue("damage", "sniper_headshot")
	}
}
