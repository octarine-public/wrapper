import Ability from "../Base/Ability"

export default class rubick_telekinesis_land extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Rubick_TelekinesisLand
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_telekinesis_land", rubick_telekinesis_land)
