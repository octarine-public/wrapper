import Ability from "../Base/Ability"

export default class lone_druid_savage_roar extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_LoneDruid_SavageRoar
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_savage_roar", lone_druid_savage_roar)
