import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("oracle_purifying_flames")
export class oracle_purifying_flames extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false

	public GetHealthRestore(_target: Unit) {
		return this.GetSpecialValue("heal_per_second") * this.MaxDuration
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
