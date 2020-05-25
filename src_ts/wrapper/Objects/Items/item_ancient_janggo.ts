import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_ancient_janggo")
export default class item_ancient_janggo extends Item {
	public static readonly ModifierName: string = "modifier_item_ancient_janggo_active"
	public static readonly AuraModifierName: string = "modifier_item_ancient_janggo_aura_effect"

	public get AuraRadius(): number {
		return this.GetSpecialValue("radius")
	}
	public get AOERadius(): number {
		return this.AuraRadius
	}

	public CanBeCasted(bonusMana: number = 0): boolean {
		return this.CurrentCharges > 0 && super.CanBeCasted(bonusMana)
	}
}
