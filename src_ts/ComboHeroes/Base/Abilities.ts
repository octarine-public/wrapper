import { Hero, Unit } from "wrapper/Imports"
import { AbilityHelper } from "./Helper/AbilityHelper"
export class AbilityBase extends AbilityHelper {
	constructor(unit?: Hero | Unit) {
		super(unit)
	}
}
