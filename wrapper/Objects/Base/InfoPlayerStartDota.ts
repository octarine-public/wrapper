import Entity from "./Entity"
import { Team } from "../../Enums/Team"
import { WrapperClass } from "../../Decorators"

@WrapperClass("C_InfoPlayerStartDota")
export default class InfoPlayerStartDota extends Entity {
	public get SpawnerTeam(): Team {
		return this.Name_ === "Spawner_bad" ? Team.Dire : Team.Radiant
	}
}
