import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("enchantress_natures_attendants")
export class enchantress_natures_attendants
	extends Ability
	implements IHealthRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly HealthRestoreModifierName = "modifier_enchantress_natures_attendants"

	public GetHealthRestore(_target: Unit): number {
		return (
			this.GetSpecialValue("heal") *
			this.GetSpecialValue("wisp_count") *
			this.MaxDuration
		)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("heal_duration", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
