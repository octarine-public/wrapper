import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_dagon")
export default class item_dagon extends Item {
	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
}
