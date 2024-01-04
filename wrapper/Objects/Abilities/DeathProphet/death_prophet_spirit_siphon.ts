import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("death_prophet_spirit_siphon")
export class death_prophet_spirit_siphon extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetChargeRestoreTimeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityChargeRestoreTime", level)
	}
}
