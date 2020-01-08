import Ability from "../Base/Ability"

export default class keeper_of_the_light_spirit_form_illuminate extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_KeeperOfTheLight_SpiritFormIlluminate
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_spirit_form_illuminate", keeper_of_the_light_spirit_form_illuminate)
