import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("lich_chain_frost")
export default class lich_chain_frost extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_lich/lich_chain_frost.vpcf",
			"particles/econ/items/lich/lich_ti8_immortal_arms/lich_ti8_chain_frost.vpcf",
		]
	}
}
