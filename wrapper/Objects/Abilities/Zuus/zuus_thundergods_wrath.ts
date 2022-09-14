import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("zuus_thundergods_wrath")
export class zuus_thundergods_wrath extends Ability {
	public GetAOERadiusForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
}
