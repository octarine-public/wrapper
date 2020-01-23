import Ability from "../../Base/Ability"

export default class obsidian_destroyer_astral_imprisonment extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Obsidian_Destroyer_AstralImprisonment>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("obsidian_destroyer_astral_imprisonment", obsidian_destroyer_astral_imprisonment)
