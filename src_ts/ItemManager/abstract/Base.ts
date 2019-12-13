import { Unit, Game } from "wrapper/Imports"
export default class ItemManagerBase {
	public readonly unit: Unit
	constructor(unit?: Unit) {
		this.unit = unit
	}
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
	public get GetDelayCast() {
		return (((Game.Ping / 2) + 30) + 150)
	}
}