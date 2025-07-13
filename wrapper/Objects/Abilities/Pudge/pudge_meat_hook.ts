import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Creep } from "../../Base/Creep"
import { Unit } from "../../Base/Unit"

@WrapperClass("pudge_meat_hook")
export class pudge_meat_hook extends Ability implements INuke {
	@NetworkedBasicField("m_nConsecutiveHits")
	public readonly ConsecutiveHits: number = 0
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("hook_width", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("hook_speed", level)
	}
	public GetRawDamage(target: Unit): number {
		return target instanceof Creep && !target.IsAncient
			? Number.MAX_SAFE_INTEGER
			: super.GetRawDamage(target)
	}
}
