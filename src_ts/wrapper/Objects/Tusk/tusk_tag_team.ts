import Ability from "../Base/Ability"

export default class tusk_tag_team extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Tusk_Tag_Team
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_tag_team", tusk_tag_team)
