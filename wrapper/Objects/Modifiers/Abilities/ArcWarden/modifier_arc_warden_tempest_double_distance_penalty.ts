import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_arc_warden_tempest_double_distance_penalty
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDamagePenalty = 0
	private cachedPenaltyDisabled = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetIncomingDamagePercentage(): [number, boolean] {
		return this.cachedPenaltyDisabled === 0
			? [this.cachedDamagePenalty, false]
			: [0, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "arc_warden_tempest_double"
		this.cachedDamagePenalty = this.GetSpecialValue("incoming_damage_penalty", name)
		this.cachedPenaltyDisabled = this.GetSpecialValue("ignore_penalty_distance", name)
	}
}
