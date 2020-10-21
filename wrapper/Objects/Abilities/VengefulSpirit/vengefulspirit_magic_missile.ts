import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("vengefulspirit_magic_missile")
export default class vengefulspirit_magic_missile extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("magic_missile_speed")
	}
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_vengeful/vengeful_magic_missle.vpcf",
			"particles/econ/items/vengeful/vs_ti8_immortal_shoulder/vs_ti8_immortal_magic_missle.vpcf",
			"particles/econ/items/vengeful/vs_ti8_immortal_shoulder/vs_ti8_immortal_magic_missle_crimson.vpcf"
		]
	}
}
