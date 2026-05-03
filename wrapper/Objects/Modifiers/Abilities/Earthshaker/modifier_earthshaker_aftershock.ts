import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_earthshaker_aftershock extends Modifier {
	private cachedDamage = 0

	public get AOEDamage() {
		return !this.IsPassiveDisabled() ? this.cachedDamage : 0
	}
	protected UpdateSpecialValues(): void {
		const name = "earthshaker_aftershock"
		this.cachedDamage = this.GetSpecialValue("aftershock_damage", name)
	}
}
