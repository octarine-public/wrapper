import Ability from "../Base/Ability"

export default class queenofpain_blink extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_QueenOfPain_Blink
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("queenofpain_blink", queenofpain_blink)
