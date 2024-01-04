import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("crystal_maiden_brilliance_aura")
export class crystal_maiden_brilliance_aura extends Ability {
	public GetBaseAOERadiusForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
}
