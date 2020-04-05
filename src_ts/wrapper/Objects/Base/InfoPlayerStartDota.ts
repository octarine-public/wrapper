import Entity from "./Entity"
import { Team } from "../../Enums/Team"

export default class InfoPlayerStartDota extends Entity {
	public NativeEntity: Nullable<C_InfoPlayerStartDota>

	public get SpawnerTeam(): Team {
		return this.ClassName === "CInfoPlayerStartBadGuys" ? Team.Dire : Team.Radiant
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_InfoPlayerStartDota", InfoPlayerStartDota)
