import Ability from "../Base/Ability"

export default class arc_warden_tempest_double extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_ArcWarden_TempestDouble
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("arc_warden_tempest_double", arc_warden_tempest_double)
