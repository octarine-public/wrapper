import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dragon_knight_dragon_tail")
export class dragon_knight_dragon_tail extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public get CastRange() {
		const owner = this.Owner,
			modifierName = "modifier_dragon_knight_dragon_form"
		if (owner === undefined || !owner.HasBuffByName(modifierName)) {
			return super.CastRange
		}
		return owner.GetAttackRange()
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aoe", level)
	}
}
