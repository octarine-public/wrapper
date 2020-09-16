import Entity from "./Entity"
import { Team } from "../../Enums/Team"
import { WrapperClass } from "../../Decorators"

@WrapperClass("C_InfoPlayerStartDota")
export default class InfoPlayerStartDota extends Entity {
	public get SpawnerTeam(): Team {
		return this.ClassName === "CInfoPlayerStartBadGuys" ? Team.Dire : Team.Radiant
	}
}
