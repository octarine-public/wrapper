import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("legion_commander_press_the_attack")
export class legion_commander_press_the_attack
	extends Ability
	implements IHealthRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly HealthRestoreModifierName =
		"modifier_legion_commander_press_the_attack"

	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("hp_regen") * this.MaxDuration
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
