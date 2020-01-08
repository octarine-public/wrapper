import Ability from "../Base/Ability"

export default class keeper_of_the_light_illuminate_end extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_KeeperOfTheLight_IlluminateEnd
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_illuminate_end", keeper_of_the_light_illuminate_end)
