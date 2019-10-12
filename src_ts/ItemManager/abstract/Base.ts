import { Unit } from "wrapper/Imports"
export default class ItemManagerBase {
	public readonly unit: Unit
	constructor(unit?: Unit) {
		this.unit = unit
	}
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
}