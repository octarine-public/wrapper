import { WrapperClass } from "../../Decorators"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { Item } from "../Base/Item"

@WrapperClass("item_ethereal_blade")
export class item_ethereal_blade extends Item {
	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("blast_damage_base", level)
	}
}
