import Ability from "../Base/Ability"

export default class seasonal_ti9_monkey extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Seasonal_TI9_Monkey
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_ti9_monkey", seasonal_ti9_monkey)
