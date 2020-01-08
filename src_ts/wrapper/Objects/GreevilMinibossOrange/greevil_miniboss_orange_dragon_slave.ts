import Ability from "../Base/Ability"

export default class greevil_miniboss_orange_dragon_slave extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Orange_DragonSlave
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_orange_dragon_slave", greevil_miniboss_orange_dragon_slave)
