import Ability from "../Base/Ability"

export default class bane_nightmare_end extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Bane_NightmareEnd
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bane_nightmare_end", bane_nightmare_end)
