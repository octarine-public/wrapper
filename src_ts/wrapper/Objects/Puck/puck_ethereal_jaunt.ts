import Ability from "../Base/Ability"

export default class puck_ethereal_jaunt extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Puck_EtherealJaunt
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("puck_ethereal_jaunt", puck_ethereal_jaunt)
