import NeutralSpawnBox from "../../Base/NeutralSpawnBox"
import Vector2 from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { NeutralSpawnerType } from "../../Enums/NeutralSpawnerType"
import { Team } from "../../Enums/Team"
import Entity, { GameRules } from "./Entity"

@WrapperClass("CDOTA_NeutralSpawner")
export default class NeutralSpawner extends Entity {
	@NetworkedBasicField("m_Type")
	public Type = NeutralSpawnerType.Small
	private SpawnBox_: Nullable<NeutralSpawnBox>

	public get SpawnBox(): Nullable<NeutralSpawnBox> {
		if (this.SpawnBox_ === undefined) {
			const my_pos = Vector2.FromVector3(this.Position)
			this.SpawnBox_ = GameRules?.NeutralSpawnBoxes?.find(box => box.Includes2D(my_pos))
		}
		return this.SpawnBox_
	}
	public get SpawnerTeam(): Team {
		return this.SpawnBox?.CampName?.includes("_evil_") ? Team.Dire : Team.Radiant
	}
	public get Name(): string {
		return this.SpawnBox?.CampName ?? ""
	}
}
