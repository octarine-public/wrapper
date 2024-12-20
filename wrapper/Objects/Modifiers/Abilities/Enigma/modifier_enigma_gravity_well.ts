import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enigma_gravity_well extends Modifier {
	private cachedDamage = 0
	private cachedDamageValue = 0

	private distanceMin = 0
	private distanceMax = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const caster = this.Caster,
			owner = this.Parent
		if (caster === undefined || owner === undefined) {
			this.cachedDamage = 0
			return
		}
		if (caster === owner) {
			this.cachedDamage = 0
			return
		}
		this.cachedDamage = Math.remapRange(
			owner.Distance2D(caster),
			this.distanceMin,
			this.distanceMax,
			-this.cachedDamageValue,
			0
		)
	}

	protected GetIncomingDamagePercentage(_params?: IModifierParams): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "enigma_gravity_well"
		this.distanceMin = this.GetSpecialValue("min_dist", name)
		this.distanceMax = this.GetSpecialValue("max_dist", name)
		this.cachedDamageValue = this.GetSpecialValue("damage_reduction", name)
	}
}
