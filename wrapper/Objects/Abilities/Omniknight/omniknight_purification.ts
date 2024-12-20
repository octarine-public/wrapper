import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("omniknight_purification")
export class omniknight_purification extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("heal")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("heal", level) // heal or damage
	}
}
