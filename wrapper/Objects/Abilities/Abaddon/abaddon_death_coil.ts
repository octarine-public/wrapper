import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("abaddon_death_coil")
export class abaddon_death_coil
	extends Ability
	implements IHealthRestore<Unit>, IHealthCost, INuke
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = false
	public readonly InstantRestore = true

	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public get HealthCost() {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const selfDamage = this.GetSpecialValue("self_damage")
		return owner.HP * (selfDamage / 100)
	}
	public IsNuke(): this is INuke {
		return true
	}
	public IsHealthCost(): this is IHealthCost {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("heal_amount")
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("missile_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("target_damage", level)
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		if (owner.HeroFacet !== "abaddon_mists_of_fate") {
			return super.GetDamage(target)
		}
		const perFormAttack = this.GetSpecialValue("damage_percentage_on_perform_attack")
		return (
			super.GetDamage(target) +
			(owner.GetAttackDamage(target) * perFormAttack) / 100
		)
	}
}
