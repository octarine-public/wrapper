import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("kunkka_ghostship")
export default class kunkka_ghostship extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("ghostship_width", level)
	}
}
