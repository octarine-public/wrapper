import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("pangolier_swashbuckle")
export class pangolier_swashbuckle extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("dash_range", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("start_radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("dash_speed", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const strikes = this.GetSpecialValue("strikes"),
			attackDamage = this.GetSpecialValue("attack_damage"),
			baseDamage = super.GetRawDamage(target)
		if (attackDamage === 0) {
			return baseDamage * strikes
		}
		const bonusDamage = (owner.GetRawAttackDamage(target) * attackDamage) / 100
		return (baseDamage + bonusDamage) * strikes
	}
}
