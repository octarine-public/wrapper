import { WrapperClass } from "../../../Decorators"
import { modifier_alchemist_unstable_concoction } from "../../../Objects/Modifiers/Abilities/Alchemist/modifier_alchemist_unstable_concoction"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("alchemist_unstable_concoction_throw")
export class alchemist_unstable_concoction_throw extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack3"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("midair_explosion_radius", level)
	}
	public GetRawDamage(_target: Unit): number {
		const modifier = this.Owner?.GetBuffByClass(
			modifier_alchemist_unstable_concoction
		)
		return modifier?.RemainingDamage ?? 0
	}
}
