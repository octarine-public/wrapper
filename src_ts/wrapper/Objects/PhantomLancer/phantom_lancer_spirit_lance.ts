import Ability from "../Base/Ability"

export default class phantom_lancer_spirit_lance extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_PhantomLancer_SpiritLance
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phantom_lancer_spirit_lance", phantom_lancer_spirit_lance)
