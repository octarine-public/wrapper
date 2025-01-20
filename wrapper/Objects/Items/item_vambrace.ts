import { ItemImagePath } from "../../Data/PathData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { VambraceAttribute } from "../../Enums/VambraceAttribute"
import { Item } from "../Base/Item"

@WrapperClass("item_vambrace")
export class item_vambrace extends Item {
	@NetworkedBasicField("m_iStat")
	public readonly ActiveAttribute: VambraceAttribute = VambraceAttribute.STRENGTH

	public get TexturePath(): string {
		switch (this.ActiveAttribute) {
			case VambraceAttribute.STRENGTH:
				return ItemImagePath + "/vambrace_str_png.vtex_c"
			case VambraceAttribute.INTELLIGENCE:
				return ItemImagePath + "/vambrace_int_png.vtex_c"
			case VambraceAttribute.AGILITY:
				return ItemImagePath + "/vambrace_agi_png.vtex_c"
			default:
				return super.TexturePath
		}
	}
}
