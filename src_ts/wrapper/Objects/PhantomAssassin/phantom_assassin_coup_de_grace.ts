import Ability from "../Base/Ability"

export default class phantom_assassin_coup_de_grace extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_PhantomAssassin_CoupdeGrace
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phantom_assassin_coup_de_grace", phantom_assassin_coup_de_grace)
