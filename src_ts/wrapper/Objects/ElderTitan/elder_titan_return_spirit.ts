import Ability from "../Base/Ability"

export default class elder_titan_return_spirit extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Elder_Titan_ReturnSpirit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("elder_titan_return_spirit", elder_titan_return_spirit)
