import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_stone_gaze_stone
	extends Modifier
	implements IDebuff, IDisable
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,
			this.GetIncomingPhysicalDamagePercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
	protected GetIncomingPhysicalDamagePercentage(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"bonus_physical_damage",
			"medusa_stone_gaze"
		)
	}
}
