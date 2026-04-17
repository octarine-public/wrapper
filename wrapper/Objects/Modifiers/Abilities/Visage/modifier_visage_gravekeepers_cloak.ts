import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_visage_gravekeepers_cloak extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [-(this.cachedDamage * this.StackCount), false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"damage_reduction",
			"visage_gravekeepers_cloak"
		)
	}
}
