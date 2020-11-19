import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("elder_titan_earth_splitter")
export default class elder_titan_earth_splitter extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("crack_width")
	}
}
