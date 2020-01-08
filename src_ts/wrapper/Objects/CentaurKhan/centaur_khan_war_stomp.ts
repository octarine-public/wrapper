import Ability from "../Base/Ability"

export default class centaur_khan_war_stomp extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_CentaurKhan_WarStomp
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("centaur_khan_war_stomp", centaur_khan_war_stomp)
