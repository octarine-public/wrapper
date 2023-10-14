import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_nether_shawl")
export class item_nether_shawl extends Item {
	public get SpellAmplification(): number {
		return super.SpellAmplification + this.GetSpecialValue("bonus_spell_amp") / 100
	}
}
