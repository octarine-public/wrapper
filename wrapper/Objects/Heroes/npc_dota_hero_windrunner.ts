import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Windrunner")
export class npc_dota_hero_windrunner extends Hero {
	@NetworkedBasicField("m_nTargetAngle")
	public readonly TargetAngle = 0
}
