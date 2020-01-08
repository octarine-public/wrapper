import Ability from "../Base/Ability"

export default class terrorblade_metamorphosis extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Terrorblade_Metamorphosis
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("terrorblade_metamorphosis", terrorblade_metamorphosis)
