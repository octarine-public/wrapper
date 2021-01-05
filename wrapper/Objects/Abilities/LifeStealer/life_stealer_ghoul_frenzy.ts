import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("life_stealer_ghoul_frenzy")
export default class life_stealer_ghoul_frenzy extends Ability {
	public get IsHidden(): boolean {
		return !this.IsEnemy() && this.IsHidden_
	}
}
