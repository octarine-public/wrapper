import Ability from "../Base/Ability"

export default class mud_golem_hurl_boulder extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_MudGolem_HurlBoulder
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mud_golem_hurl_boulder", mud_golem_hurl_boulder)
