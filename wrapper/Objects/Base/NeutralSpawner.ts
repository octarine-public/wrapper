import { NeutralSpawnBox } from "../../Base/NeutralSpawnBox"
import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { NeutralSpawnerType } from "../../Enums/NeutralSpawnerType"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity, GameRules } from "./Entity"

@WrapperClass("CDOTA_NeutralSpawner")
export class NeutralSpawner extends Entity {
	@NetworkedBasicField("m_Type")
	public Type = NeutralSpawnerType.Small
	public SpawnBox: Nullable<NeutralSpawnBox>
	public get Name(): string {
		return this.SpawnBox?.CampName ?? ""
	}
	public get SpawnerTeam(): Team {
		const name = this.Name
		switch (name) {
			case "neutralcamp_good_10":
				return Team.Dire
			case "neutralcamp_evil_10":
				return Team.Radiant
			default:
				return name.includes("_evil_") ? Team.Dire : Team.Radiant
		}
	}
	public get Angles() {
		return this.SpawnBox?.Angles ?? super.Angles
	}
}
export const NeutralSpawners = EntityManager.GetEntitiesByClass(NeutralSpawner)

const queueSpawners: NeutralSpawner[] = []
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof NeutralSpawner) {
		queueSpawners.push(ent)
	}
})

EventsSDK.on("PostDataUpdate", () => {
	for (let index = queueSpawners.length - 1; index > -1; index--) {
		const spawner = queueSpawners[index]
		const spawnerPos = Vector2.FromVector3(spawner.Position)
		const boxes = GameRules?.NeutralSpawnBoxes.find(x => x.Includes2D(spawnerPos))
		const box = (spawner.SpawnBox = boxes)
		if (box === undefined) {
			continue
		}
		queueSpawners.remove(spawner)
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof NeutralSpawner) {
		ent.SpawnBox = undefined
		queueSpawners.remove(ent)
	}
})
