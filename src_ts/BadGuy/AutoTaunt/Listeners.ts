import { Game, LocalPlayer } from "wrapper/Imports"
import { Interval, State } from "./Menu"
let Sleep = 0
export function Tick() {
	if (!State.value || LocalPlayer!.Hero === undefined)
		return

	let Timer = Game.RawGameTime
	if (Timer >= Sleep && LocalPlayer!.Hero.IsAlive) {
		Game.ExecuteCommand("use_item_client current_hero taunt")
		Sleep = Timer + Interval.value
	}
}
export function GameEnded() {
	Sleep = 0
}
