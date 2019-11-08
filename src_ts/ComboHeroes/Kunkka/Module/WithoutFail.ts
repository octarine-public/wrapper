import { ExecuteOrder, Game } from "wrapper/Imports";
import { Owner, initAbilityMap } from "../Listeners";
import { ComboTimer, XMarkCastTime } from "./Combo";

export function OnExecuteOrder(order: ExecuteOrder) {
	let Time = Game.RawGameTime
	if (ComboTimer > Time && XMarkCastTime > Time) {
		let Abilities = initAbilityMap.get(Owner)
		if (Abilities === undefined) {
			return true
		}
		let Q = Abilities.Torrent,
			R = Abilities.Ghostship,
			RX = Abilities.Return
		if (XMarkCastTime - Time < 1 && XMarkCastTime - Time > 0 && R.IsReady) {
			return false
		} else if (ComboTimer - Time < 2.25 && ComboTimer - Time > 1.75 && Q.IsReady) {
			return false
		} else if (ComboTimer - Time < 0.80 && ComboTimer - Time > 0.30 && !RX.IsHidden) {
			return false
		} else if (Q !== undefined && Q.IsInAbilityPhase) {
			return false
		} else if (RX !== undefined && RX.IsInAbilityPhase) {
			return false
		} else if (R !== undefined && R.IsInAbilityPhase) {
			return false
		}
		return true
	}
}