import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("crystal_maiden_brilliance_aura")
export default class crystal_maiden_brilliance_aura extends Ability {
	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}
