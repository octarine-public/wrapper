import { GameActivity_t } from "../../Enums/GameActivity_t"
import EventsSDK from "../../Managers/EventsSDK"
import Unit from "../../Objects/Base/Unit"
import GameState from "../../Utils/GameState"

EventsSDK.on("UnitAddGesture", (unit, activity) => {
	if (!(unit instanceof Unit) || activity !== GameActivity_t.ACT_DOTA_TELEPORT_END)
		return
	const end_pos = unit.TPEndPosition.IsValid
		? unit.TPEndPosition
		: unit.LastTPEndPosition
	if (end_pos.IsValid) {
		unit.PredictedPosition.CopyFrom(end_pos)
		unit.LastRealPredictedPositionUpdate = GameState.RawGameTime
		unit.LastPredictedPositionUpdate = GameState.RawGameTime
	}
	unit.TPStartTime = -1
	unit.TPStartPosition.Invalidate()
	unit.TPEndPosition.Invalidate()
})
