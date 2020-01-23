import { GameState } from "wrapper/Imports"
export default class Base {
	public get GetDelayCast() {
		return (((GameState.Ping / 2) + 30) + 350)
	}
}
export let Utility = new Base()
