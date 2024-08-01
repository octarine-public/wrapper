import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("abaddon_death_coil")
export class abaddon_death_coil
	extends Ability
	implements IHealthRestore<Unit>, IHealthCost
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
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("heal_amount")
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("missile_speed", level)
	}
	public IsHealthCost(): this is IHealthCost {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
