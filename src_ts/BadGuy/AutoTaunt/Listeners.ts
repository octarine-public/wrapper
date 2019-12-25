import { Game, Hero } from "wrapper/Imports"
import { Interval, State } from "./Menu"

let Sleep = 0,
	MyHero: Nullable<Hero>

export function Tick() {
	if (!State.value || MyHero === undefined)
		return false

	let Timer = Game.RawGameTime
	if (Timer >= Sleep && MyHero.IsAlive) {
		Game.ExecuteCommand("use_item_client current_hero taunt")
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