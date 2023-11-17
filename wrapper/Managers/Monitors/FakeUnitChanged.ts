import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CMonitorFakeUnit {
	public FakeUnitChanged(entity: FakeUnit) {
		if (entity.PlayerCustomData === undefined) {
			const player = this.findPlayerCustomData(entity)
			entity.Level = player !== undefined ? 1 : 0
			entity.PlayerCustomData = player
		}
	}

	private findPlayerCustomData(ent: FakeUnit) {
		return PlayerCustomData.Array.find(player =>
			ent.HandleMatches(player.SelectedHeroIndex)
		)
	}
})()

EventsSDK.on(
	"FakeUnitCreated",
	entity => Monitor.FakeUnitChanged(entity),
	Number.MIN_SAFE_INTEGER
)
