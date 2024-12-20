import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_visage_soul_assumption } from "../../Modifiers/Abilities/Visage/modifier_visage_soul_assumption"

@WrapperClass("visage_soul_assumption")
export class visage_soul_assumption extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("bolt_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("soul_base_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const modifier = owner.GetBuffByClass(modifier_visage_soul_assumption)
		return super.GetRawDamage(target) + (modifier?.BonusDamage ?? 0)
	}
}
