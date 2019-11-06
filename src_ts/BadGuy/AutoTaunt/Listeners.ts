import { Game, Hero } from "wrapper/Imports";
import { Interval, State } from "./Menu";
let MyHero: Hero,
	Sleep: number = 0
export function Tick() {
	if (!State.value || MyHero === undefined) {
		return false
	}
	let Timer = Game.RawGameTime
	if (Timer >= Sleep && MyHero.IsAlive) {
		Game.ExecuteCommand("use_item_client current_hero taunt")
		Sleep = Timer + Interval.value
	}
}
export function GameStarted(hero: Hero) {
	if (MyHero === undefined) {
		MyHero = hero
	}
	Sleep = 0
}
export function GameEnded() {
	Sleep = 0
	MyHero = undefined
}