import { GetSpellTexture } from "../../../Data/ImageData"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("troll_warlord_switch_stance")
export class troll_warlord_switch_stance extends Ability {
	public get TexturePath(): string {
		return this.IsToggled
			? GetSpellTexture("troll_warlord_berserkers_rage_active")
			: super.TexturePath
	}
}
