import { WrapperClass } from "../../Decorators"
import { Team } from "../../Enums/Team"
import { Entity } from "./Entity"

@WrapperClass("CInfoPlayerStartDota")
export class InfoPlayerStartDota extends Entity {
	public get SpawnerTeam(): Team {
		return this.Name_ === "Spawner_bad" ? Team.Dire : Team.Radiant
	}
}
