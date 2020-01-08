import Ability from "../Base/Ability"

export default class centaur_return extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Centaur_Return
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("centaur_return", centaur_return)
