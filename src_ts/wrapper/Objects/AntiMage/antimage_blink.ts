import Ability from "../Base/Ability"

export default class antimage_blink extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_AntiMage_Blink
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("antimage_blink", antimage_blink)
