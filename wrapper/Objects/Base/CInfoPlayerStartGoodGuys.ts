import InfoPlayerStartDota from "./InfoPlayerStartDota"
import { Team } from "../../Enums/Team"
import { WrapperClass } from "../../Decorators"

@WrapperClass("C_InfoPlayerStartGoodGuys")
export default class InfoPlayerStartGoodGuys extends InfoPlayerStartDota {
	public get SpawnerTeam(): Team {
		return Team.Radiant
	}
}
