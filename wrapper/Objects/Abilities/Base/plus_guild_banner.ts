import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("plus_guild_banner")
export class plus_guild_banner extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
