import Ability from "../Base/Ability"

export default class windrunner_powershot extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Windrunner_Powershot
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("windrunner_powershot", windrunner_powershot)
