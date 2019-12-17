import { Game } from "wrapper/Imports"
export default class Base {
	public get GetDelayCast() {
		return (((Game.Ping / 2) + 30) + 250)
	}
}
export let B_Utils = new Base