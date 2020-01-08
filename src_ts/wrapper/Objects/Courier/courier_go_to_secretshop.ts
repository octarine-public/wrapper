import Ability from "../Base/Ability"

export default class courier_go_to_secretshop extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Courier_GoToSecretShop
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_go_to_secretshop", courier_go_to_secretshop)
