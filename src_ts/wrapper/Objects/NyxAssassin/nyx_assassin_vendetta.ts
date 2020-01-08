import Ability from "../Base/Ability"

export default class nyx_assassin_vendetta extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Nyx_Assassin_Vendetta
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nyx_assassin_vendetta", nyx_assassin_vendetta)
