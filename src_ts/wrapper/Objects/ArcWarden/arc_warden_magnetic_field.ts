import Ability from "../Base/Ability"

export default class arc_warden_magnetic_field extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_ArcWarden_MagneticField
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("arc_warden_magnetic_field", arc_warden_magnetic_field)
