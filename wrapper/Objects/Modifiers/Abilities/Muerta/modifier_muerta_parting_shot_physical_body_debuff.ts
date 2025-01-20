import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_parting_shot_physical_body_debuff
	extends Modifier
	implements IDebuff, IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDuration = 0
	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public get Duration(): number {
		return this.cachedDuration || super.Duration
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
	protected GetIncomingDamagePercentage(_params?: IModifierParams): [number, boolean] {
		return [-this.cachedIncDamage, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "muerta_parting_shot"
		this.cachedDuration = this.GetSpecialValue("debuff_duration", name)
		this.cachedIncDamage = this.GetSpecialValue("damage_reduction_percent", name)
	}
}
