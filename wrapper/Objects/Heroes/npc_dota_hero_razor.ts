import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Razor")
export class npc_dota_hero_razor extends Hero {
	@NetworkedBasicField("m_nTargetAngle")
	public readonly TargetAngle = 0
	@NetworkedBasicField("m_nTargetRange")
	public readonly TargetRange = 0
}
