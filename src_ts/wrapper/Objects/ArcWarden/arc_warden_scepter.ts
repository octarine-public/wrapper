import Ability from "../Base/Ability"

export default class arc_warden_scepter extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_ArcWarden_Scepter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("arc_warden_scepter", arc_warden_scepter)
