import Ability from "../Base/Ability"

export default class keeper_of_the_light_illuminate extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_KeeperOfTheLight_Illuminate
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_illuminate", keeper_of_the_light_illuminate)
