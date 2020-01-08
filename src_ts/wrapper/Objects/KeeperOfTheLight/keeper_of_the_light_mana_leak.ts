import Ability from "../Base/Ability"

export default class keeper_of_the_light_mana_leak extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_KeeperOfTheLight_ManaLeak
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_mana_leak", keeper_of_the_light_mana_leak)
