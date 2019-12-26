import { Game } from "wrapper/Imports"
export default class Base {
	public get GetDelayCast() {
		return (((Game.Ping / 2) + 30) + 350)
	}
}
export let Utility = new Base