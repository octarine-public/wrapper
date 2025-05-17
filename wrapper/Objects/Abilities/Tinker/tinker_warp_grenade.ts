import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Tinker_WarpGrenade")
export class tinker_warp_grenade extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
