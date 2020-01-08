import Ability from "../Base/Ability"

export default class terrorblade_conjure_image extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Terrorblade_ConjureImage
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("terrorblade_conjure_image", terrorblade_conjure_image)
