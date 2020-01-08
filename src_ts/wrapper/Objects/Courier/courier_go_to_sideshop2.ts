import Ability from "../Base/Ability"

export default class courier_go_to_sideshop2 extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Courier_GoToSideShop2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_go_to_sideshop2", courier_go_to_sideshop2)
