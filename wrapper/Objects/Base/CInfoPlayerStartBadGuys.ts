import InfoPlayerStartDota from "./InfoPlayerStartDota"
import { Team } from "../../Enums/Team"
import { WrapperClass } from "../../Decorators"

@WrapperClass("C_InfoPlayerStartBadGuys")
export default class InfoPlayerStartBadGuys extends InfoPlayerStartDota {
	public get SpawnerTeam(): Team {
		return Team.Dire
	}
}
