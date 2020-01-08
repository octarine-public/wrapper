import Ability from "../Base/Ability"

export default class winter_wyvern_cold_embrace extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Winter_Wyvern_Cold_Embrace
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("winter_wyvern_cold_embrace", winter_wyvern_cold_embrace)
