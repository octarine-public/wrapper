import { AbilityImagePath } from "../../../Data/PathData"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("windrunner_focusfire")
export class windrunner_focusfire extends Ability {
	public get IsUnFocused() {
		return this.GetSpecialValue("is_unfocused") !== 0
	}

	public get TexturePath() {
		return this.IsUnFocused
			? AbilityImagePath + "/windrunner_whirlwind_png.vtex_c"
			: super.TexturePath
	}
}
