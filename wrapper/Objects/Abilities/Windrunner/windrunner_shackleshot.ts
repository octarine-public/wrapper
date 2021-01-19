import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("windrunner_shackleshot")
export default class windrunner_shackleshot extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_windrunner/windrunner_shackleshot.vpcf",
			"particles/econ/items/windrunner/wr_ti8_immortal_shoulder/wr_ti8_shackleshot.vpcf",
			"particles/econ/items/windrunner/windranger_arcana/windranger_arcana_shackleshot_v2.vpcf",
			"particles/econ/items/windrunner/windranger_arcana/windranger_arcana_shackleshot.vpcf",
		]
	}
}
