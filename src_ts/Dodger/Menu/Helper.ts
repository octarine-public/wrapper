import { Unit } from "wrapper/Imports"

export class HelperMenu {
	public unit: Unit
	constructor(unit: Unit) {
		this.unit = unit
	}
	public ucFirst(str: string) {
		if (!str) return str
		return str[0].toUpperCase() + str.slice(1)
	}
}