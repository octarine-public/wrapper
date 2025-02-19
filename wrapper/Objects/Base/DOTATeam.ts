import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Entity } from "./Entity"

@WrapperClass("CDOTATeam")
export class DOTATeam extends Entity {
	@NetworkedBasicField("m_bTeamCanSeeExactRoshanTimer")
	public readonly TeamCanSeeExactRoshanTimer = false // TODO: check
	@NetworkedBasicField("m_bTeamCanSeeNextPowerRune")
	public readonly TeamCanSeeNextPowerRune = false // TODO: check
}
