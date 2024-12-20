import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { bristleback_quill_spray } from "./bristleback_quill_spray"

@WrapperClass("bristleback_hairball")
export class bristleback_hairball extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
	}
	public GetRawDamage(target: Unit): number {
		const ability = this.Owner?.GetAbilityByClass(bristleback_quill_spray)
		return ability?.GetRawDamage(target) ?? 0
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		const ability = this.Owner?.GetAbilityByClass(bristleback_quill_spray)
		return ability?.GetBaseDamageForLevel(level) ?? 0
	}
}
