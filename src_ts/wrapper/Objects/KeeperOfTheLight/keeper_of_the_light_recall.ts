import Ability from "../Base/Ability"

export default class keeper_of_the_light_recall extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_KeeperOfTheLight_Recall
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_recall", keeper_of_the_light_recall)
