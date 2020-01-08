import Ability from "../Base/Ability"

export default class lone_druid_spirit_bear_entangle extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_LoneDruid_SpiritBear_Entangle
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_spirit_bear_entangle", lone_druid_spirit_bear_entangle)
