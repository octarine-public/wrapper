import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("phantom_assassin_stifling_dagger")
export default class phantom_assassin_stifling_dagger extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_phantom_assassin/phantom_assassin_stifling_dagger.vpcf",
			"particles/econ/items/phantom_assassin/pa_ti8_immortal_head/pa_ti8_immortal_stifling_dagger.vpcf",
			"particles/econ/items/phantom_assassin/phantom_assassin_arcana_elder_smith/phantom_assassin_stifling_dagger_arcana.vpcf"
		]
	}
}
