import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("warlock_shadow_word")
export class warlock_shadow_word extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly HealthRestoreModifierName = "modifier_warlock_shadow_word"

	public GetHealthRestore(_target: Unit): number {
		return this.AbilityDamage * this.MaxDuration
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
