import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shadow_shaman_fowl_play_damage_reduction
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetIncomingDamagePercentage(_params?: IModifierParams): [number, boolean] {
		return [-this.cachedIncDamage, false]
	}
	protected UpdateSpecialValues() {
		this.cachedIncDamage = this.GetSpecialValue(
			"damage_reduction_pct",
			"shadow_shaman_fowl_play"
		)
	}
}
