import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { Players } from "../../Objects/Base/Player"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CMonitorFakeUnit {
	public FakeUnitChanged(entity: FakeUnit) {
		if (entity.Player === undefined) {
			const player = this.findPlayer(entity)
			entity.Level = player !== undefined ? 1 : 0
			entity.Player = player
		}
	}

	private findPlayer(ent: FakeUnit) {
		return Players.find(player => ent.HandleMatches(player.Hero_))
	}
})()

EventsSDK.on(
	"FakeUnitCreated",
	entity => Monitor.FakeUnitChanged(entity),
	Number.MIN_SAFE_INTEGER
)
