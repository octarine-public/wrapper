import { WrapperClass } from "../../Decorators"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { Item } from "../Base/Item"

@WrapperClass("item_dagon")
export class item_dagon extends Item implements INuke {
	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
