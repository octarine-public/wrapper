import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("elder_titan_earth_splitter")
export default class elder_titan_earth_splitter extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("crack_width")
	}
}
