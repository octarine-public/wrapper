import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_nether_shawl")
export default class item_nether_shawl extends Item {
	public get SpellAmplification(): number {
		return super.SpellAmplification + (this.GetSpecialValue("bonus_spell_amp") / 100)
	}
}
