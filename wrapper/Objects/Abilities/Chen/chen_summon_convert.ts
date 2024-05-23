import { Paths } from "../../../Data/ImageData"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chen_summon_convert")
export class chen_summon_convert extends Ability {
	public get ShouldBeDrawable(): boolean {
		return true
	}
	public get TexturePath(): string {
		return `${Paths.AbilityIcons}/chen_summon_convert_centaur_png.vtex_c`
	}
}
