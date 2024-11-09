import { WrapperClass } from "../../../Decorators"
import { DOTA_UNIT_TARGET_TEAM } from "../../../Enums/DOTA_UNIT_TARGET_TEAM"
import { Ability } from "../../Base/Ability"

@WrapperClass("lion_mana_drain")
export class lion_mana_drain extends Ability {
	public get TargetTeamMask(): DOTA_UNIT_TARGET_TEAM {
		return super.TargetTeamMask | DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH
	}
}
