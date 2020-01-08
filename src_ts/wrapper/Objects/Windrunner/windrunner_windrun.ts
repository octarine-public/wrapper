import Ability from "../Base/Ability"

export default class windrunner_windrun extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Windrunner_Windrun
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("windrunner_windrun", windrunner_windrun)
