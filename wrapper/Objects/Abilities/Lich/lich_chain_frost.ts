import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("lich_chain_frost")
export default class lich_chain_frost extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_lich/lich_chain_frost.vpcf"
}
