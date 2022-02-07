import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("vengefulspirit_magic_missile")
export default class vengefulspirit_magic_missile extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_vengeful/vengeful_magic_missle.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("magic_missile_speed")
	}
}
