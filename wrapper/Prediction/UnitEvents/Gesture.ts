import { GameActivity_t } from "../../Enums/GameActivity_t"
import EventsSDK from "../../Managers/EventsSDK"
import { GetPredictionTarget } from "../../Objects/Base/FakeUnit"
import GameState from "../../Utils/GameState"

EventsSDK.on("UnitAddGesture", (unit, activity) => {
	if (activity !== GameActivity_t.ACT_DOTA_TELEPORT_END)
		return
	const target = GetPredictionTarget(unit)
	if (target === undefined)
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
