import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("necrolyte_death_pulse")
export class necrolyte_death_pulse
	extends Ability
	implements IHealthRestore<Unit>, INuke
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true
	public IsNuke(): this is INuke {
		return true
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("heal")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
