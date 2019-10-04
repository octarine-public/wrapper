import { EntityManager, Unit, Team } from "wrapper/Imports"

export default class ItemManagerBase {
	private readonly unit: Unit
	constructor(unit?: Unit) {
		this.unit = unit
	}
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
}