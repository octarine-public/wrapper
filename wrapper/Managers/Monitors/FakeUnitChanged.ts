import { EventPriority } from "../../Enums/EventPriority"
import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EventsSDK } from "../EventsSDK"

new (class CMonitorFakeUnit {
	constructor() {
		EventsSDK.on(
			"FakeUnitCreated",
			entity => this.FakeUnitChanged(entity),
			EventPriority.IMMEDIATE
		)
	}

	protected FakeUnitChanged(entity: FakeUnit) {
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
