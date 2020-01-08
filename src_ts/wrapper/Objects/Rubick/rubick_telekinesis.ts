import Ability from "../Base/Ability"

export default class rubick_telekinesis extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Rubick_Telekinesis
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_telekinesis", rubick_telekinesis)
