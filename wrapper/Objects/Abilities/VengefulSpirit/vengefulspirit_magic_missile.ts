import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_VengefulSpirit_Magic_Missile")
export class vengefulspirit_magic_missile extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("magic_missile_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("magic_missile_damage", level)
	}
}
