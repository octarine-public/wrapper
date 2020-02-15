import Ability from "../../Base/Ability"

export default class obsidian_destroyer_sanity_eclipse extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Obsidian_Destroyer_SanityEclipse>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("obsidian_destroyer_sanity_eclipse", obsidian_destroyer_sanity_eclipse)
