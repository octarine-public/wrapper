import Ability from "../Base/Ability"

export default class techies_minefield_sign extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Techies_Minefield_Sign
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("techies_minefield_sign", techies_minefield_sign)
