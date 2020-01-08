import Ability from "../Base/Ability"

export default class riki_blink_strike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Riki_BlinkStrike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("riki_blink_strike", riki_blink_strike)
