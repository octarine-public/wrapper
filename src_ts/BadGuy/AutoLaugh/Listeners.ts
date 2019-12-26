import { Game } from "wrapper/Imports"
import { Interval, State } from "./Menu"
let Sleep = 0
export function Tick() {
	if (!State.value || LocalPlayer!.Hero === undefined)
		return false

	let Timer = Game.RawGameTime
	if (Timer >= Sleep && LocalPlayer!.Hero.IsAlive) {
		Game.ExecuteCommand("say /laugh")
		Sleep = Timer + Interval.value
	}
}

export function GameEnded() {
	Sleep = 0
}