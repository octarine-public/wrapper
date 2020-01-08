import Ability from "../Base/Ability"

export default class sniper_take_aim extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Sniper_TakeAim
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sniper_take_aim", sniper_take_aim)
