import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("tidehunter_gush")
export default class tidehunter_gush extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_tidehunter/tidehunter_gush.vpcf",
			"particles/econ/items/tidehunter/tidehunter_divinghelmet/tidehunter_gush_diving_helmet.vpcf",
			"particles/econ/items/tidehunter/tidehunter_divinghelmet/tidehunter_gush_diving_helmet_gold.vpcf",
		]
	}
}
