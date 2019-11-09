import { Game, Hero } from "wrapper/Imports"
import { Interval, State } from "./Menu"
let MyHero: Hero,
	Sleep = 0
export function Tick() {
	if (!State.value || MyHero === undefined)
		return false

	let Timer = Game.RawGameTime
	if (Timer >= Sleep && MyHero.IsAlive) {
		Game.ExecuteCommand("say /laugh")
		Sleep = Timer + Interval.value
	}
}
export function GameStarted(hero: Hero) {
	if (MyHero === undefined)
		MyHero = hero
}
export function GameEnded() {
	Sleep = 0
	MyHero = undefined
}