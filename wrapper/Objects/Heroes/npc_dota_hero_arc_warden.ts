import { GetUnitTexture } from "../../Data/ImageData"
import { WrapperClass } from "../../Decorators"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_ArcWarden")
export class npc_dota_hero_arc_warden extends Hero {
	public get IsIllusion(): boolean {
		return super.IsIllusion && !this.IsTempestDouble
	}
	public TexturePath(small?: boolean, team = this.Team): Nullable<string> {
		let name = this.Name
		if (small && this.IsTempestDouble) {
			name += "_tempest_double"
		}
		return GetUnitTexture(name, small, team)
	}
}
