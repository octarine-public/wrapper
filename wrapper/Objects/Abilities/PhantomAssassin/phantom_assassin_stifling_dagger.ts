import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("phantom_assassin_stifling_dagger")
export class phantom_assassin_stifling_dagger extends Ability {
	protected readonly IsSpellAmplify: boolean = false

	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("base_damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("dagger_speed", level)
	}

	public GetRawDamage(target: Unit): number {
		const owner = this.Owner,
			baseDamage = super.GetRawDamage(target)
		if (owner === undefined) {
			return 0
		}
		const factor = this.GetSpecialValue("attack_factor")
		const attackDamage = owner.GetRawAttackDamage(target) * ((100 + factor) / 100)
		return baseDamage + attackDamage
	}
}
