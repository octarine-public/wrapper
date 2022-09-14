import { WrapperClass } from "../../Decorators"
import { Team } from "../../Enums/Team"
import { InfoPlayerStartDota } from "./InfoPlayerStartDota"

@WrapperClass("CInfoPlayerStartGoodGuys")
export class InfoPlayerStartGoodGuys extends InfoPlayerStartDota {
	public get SpawnerTeam(): Team {
		return Team.Radiant
	}
}
