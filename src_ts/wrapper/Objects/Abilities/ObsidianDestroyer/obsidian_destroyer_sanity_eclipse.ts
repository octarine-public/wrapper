import Ability from "../../Base/Ability"

export default class obsidian_destroyer_sanity_eclipse extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Obsidian_Destroyer_SanityEclipse

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("obsidian_destroyer_sanity_eclipse", obsidian_destroyer_sanity_eclipse)
