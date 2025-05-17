import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("sniper_assassinate")
export class sniper_assassinate extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseCastPointForLevel(level: number): number {
		return this.OwnerHasScepter
			? this.GetSpecialValue("scepter_cast_point", level)
			: super.GetBaseCastPointForLevel(level)
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return super.GetDamage(target) + owner.GetAttackDamage(target)
	}
}
