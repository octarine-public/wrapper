import { Paths } from "../../Data/ImageData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { VambraceAttribute } from "../../Enums/VambraceAttribute"
import { Item } from "../Base/Item"

@WrapperClass("item_vambrace")
export class item_vambrace extends Item {
	@NetworkedBasicField("m_iStat")
	public ActiveAttribute = VambraceAttribute.STRENGTH

	public get TexturePath(): string {
		const path = Paths.ItemIcons
		switch (this.ActiveAttribute) {
			case VambraceAttribute.STRENGTH:
				return path + "/vambrace_str_png.vtex_c"
			case VambraceAttribute.INTELLIGENCE:
				return path + "/vambrace_int_png.vtex_c"
			case VambraceAttribute.AGILITY:
				return path + "/vambrace_agi_png.vtex_c"
			default:
				return super.TexturePath
		}
	}
}
