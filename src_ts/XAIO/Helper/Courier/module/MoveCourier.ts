import { CourierHelper } from "../Helper"
import { LaneSelectionFlags_t } from "XAIO/Core/bootstrap"
import { Courier, GameRules, GameSleeper, EventsSDK } from "wrapper/Imports"

let Sleep: GameSleeper = new GameSleeper()

export function MoveCourier(Safe: boolean = false, courier: Courier, line?: LaneSelectionFlags_t) {

	if (GameRules?.IsPaused
		|| CourierHelper.LAST_CLICK
		|| Sleep.Sleeping(courier)
		//|| CourierHelper.IsRestricted(courier)
		|| !CourierHelper.IsValidCourier(courier))
		return

	if (!Safe) {
		courier.MoveTo(CourierHelper.Position(false, line))
		CourierHelper.LAST_CLICK = true
		Sleep.Sleep(CourierHelper.CastDelay, courier)
		return
	}

	if (!CourierHelper.IsRangeCourier(courier, CourierHelper.Position(Safe, line), 150)) {
		courier.MoveTo(CourierHelper.Position(Safe, line))
		CourierHelper.LAST_CLICK = true
		Sleep.Sleep(CourierHelper.CastDelay, courier)
		return
	}
}

EventsSDK.on("GameEnded", () => {
	Sleep.FullReset()
})
