import Ability from "../Base/Ability"

export default class alchemist_goblins_greed extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Alchemist_GoblinsGreed
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("alchemist_goblins_greed", alchemist_goblins_greed)
