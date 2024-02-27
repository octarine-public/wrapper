import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dawnbreaker_fire_wreath")
export class dawnbreaker_fire_wreath extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastPointForLevel(level: number): number {
		return this.Owner?.HasShard
			? this.GetSpecialValue("shard_cast_point", level)
			: this.AbilityData.GetCastPoint(level)
	}
}
