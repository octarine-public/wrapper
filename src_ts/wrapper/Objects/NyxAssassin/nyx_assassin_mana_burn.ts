import Ability from "../Base/Ability"

export default class nyx_assassin_mana_burn extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Nyx_Assassin_ManaBurn
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nyx_assassin_mana_burn", nyx_assassin_mana_burn)
