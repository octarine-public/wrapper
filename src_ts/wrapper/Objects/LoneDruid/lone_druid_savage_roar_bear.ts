import Ability from "../Base/Ability"

export default class lone_druid_savage_roar_bear extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_LoneDruid_SavageRoar_Bear
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lone_druid_savage_roar_bear", lone_druid_savage_roar_bear)
