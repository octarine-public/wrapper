import Ability from "../Base/Ability"

export default class elder_titan_natural_order_spirit extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Elder_Titan_NaturalOrder_Spirit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("elder_titan_natural_order_spirit", elder_titan_natural_order_spirit)
