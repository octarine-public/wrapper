import Ability from "../Base/Ability"

export default class seasonal_firecrackers extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Seasonal_Firecrackers
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_firecrackers", seasonal_firecrackers)
