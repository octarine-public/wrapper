import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("night_stalker_void")
export class night_stalker_void extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("radius_scepter", level) : 0
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
