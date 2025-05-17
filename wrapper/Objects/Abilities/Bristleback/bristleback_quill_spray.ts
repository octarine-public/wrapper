import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_bristleback_quill_spray } from "../../Modifiers/Abilities/Bristleback/modifier_bristleback_quill_spray"

@WrapperClass("bristleback_quill_spray")
export class bristleback_quill_spray extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("quill_base_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const baseDamage = super.GetRawDamage(target)
		const modifier = target.GetBuffByClass(modifier_bristleback_quill_spray),
			bonusDamage = modifier?.GetBonusDamagePerStack(target) ?? 0
		return baseDamage + bonusDamage
	}
}
