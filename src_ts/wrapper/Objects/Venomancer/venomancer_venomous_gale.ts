import Ability from "../Base/Ability"

export default class venomancer_venomous_gale extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Venomancer_VenomousGale
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("venomancer_venomous_gale", venomancer_venomous_gale)
