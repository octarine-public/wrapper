import { Color } from "../../Base/Color"
import { WrapperClass } from "../../Decorators"
import { RenderMode } from "../../Enums/RenderMode"
import { Unit } from "../Base/Unit"

@WrapperClass("CDOTA_Wisp_Spirit")
export class npc_dota_wisp_spirit extends Unit {
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
}
