import { State, Interval } from "./Menu";
import { Game } from "wrapper/Imports";
let Sleep: number = 0
export function Tick() {
	if (!State.value) {
		return false
	}
	let Timer = Game.RawGameTime
	if (Timer >= Sleep) {
		Game.ExecuteCommand("use_item_client current_hero taunt")
		Sleep = Timer + Interval.value
	}
}
export function GameEnded() { 
	Sleep = 0
}