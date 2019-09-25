import { Hero } from "wrapper/Imports"
import { AbilityHelper } from "./Helper/AbilityHelper"
export class AbilityBase extends AbilityHelper {
	constructor(unit: Hero) {
		super(unit)
	}
}
