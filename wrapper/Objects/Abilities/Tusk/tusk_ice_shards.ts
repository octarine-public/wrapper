import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("tusk_ice_shards")
export default class tusk_ice_shards extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("shard_width")
	}
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
}
