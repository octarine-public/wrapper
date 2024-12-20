import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("dawnbreaker_fire_wreath")
export class dawnbreaker_fire_wreath extends Ability {
	public GetBaseCastPointForLevel(level: number): number {
		return this.OwnerHasShard
			? this.GetSpecialValue("shard_cast_point", level)
			: super.GetBaseCastPointForLevel(level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("swipe_damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("swipe_radius", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return super.GetRawDamage(target) + owner.GetRawAttackDamage(target)
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		return owner.GetAttackDamage(
			target,
			ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			this.GetRawDamage(target)
		)
	}
}
