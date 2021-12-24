import { GameActivity_t } from "../../Enums/GameActivity_t"
import EventsSDK from "../../Managers/EventsSDK"
import GameState from "../../Utils/GameState"

EventsSDK.on("UnitAddGesture", async (target, activity) => {
	if (activity !== GameActivity_t.ACT_DOTA_TELEPORT_END || target === undefined)
		return
	const end_pos = target.TPEndPosition.IsValid
		? target.TPEndPosition
		: target.LastTPEndPosition
	if (end_pos.IsValid) {
		target.PredictedPosition.CopyFrom(end_pos)
		target.LastRealPredictedPositionUpdate = GameState.RawGameTime
		target.LastPredictedPositionUpdate = GameState.RawGameTime
	}
	target.TPStartTime = -1
	target.TPStartPosition.Invalidate()
	target.TPEndPosition.Invalidate()
})
