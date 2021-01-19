import { WrapperClass } from "../../Decorators"
import { Team } from "../../Enums/Team"
import InfoPlayerStartDota from "./InfoPlayerStartDota"

@WrapperClass("C_InfoPlayerStartGoodGuys")
export default class InfoPlayerStartGoodGuys extends InfoPlayerStartDota {
	public get SpawnerTeam(): Team {
		return Team.Radiant
	}
}
