import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_ancient_janggo")
export default class item_ancient_janggo extends Item {
	public static readonly ModifierName: string = "modifier_item_ancient_janggo_active"
	public static readonly AuraModifierName: string = "modifier_item_ancient_janggo_aura_effect"

	public CanBeCasted(bonusMana: number = 0): boolean {
		return this.CurrentCharges > 0 && super.CanBeCasted(bonusMana)
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
