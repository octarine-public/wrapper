import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shadow_demon_menace_crushed extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	protected GetIncomingDamagePercentage(_params?: IModifierParams): [number, boolean] {
		return [this.cachedDamage * this.StackCount, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("stack", "shadow_demon_menace")
	}
}
