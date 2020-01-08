import Ability from "../Base/Ability"

export default class obsidian_destroyer_equilibrium extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Obsidian_Destroyer_Equilibrium
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("obsidian_destroyer_equilibrium", obsidian_destroyer_equilibrium)
