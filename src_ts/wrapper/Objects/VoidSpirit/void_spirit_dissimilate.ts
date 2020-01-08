import Ability from "../Base/Ability"

export default class void_spirit_dissimilate extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_VoidSpirit_Dissimilate
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("void_spirit_dissimilate", void_spirit_dissimilate)
