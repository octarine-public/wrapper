import Ability from "../../Base/Ability"

export default class tusk_frozen_sigil extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tusk_FrozenSigil>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_frozen_sigil", tusk_frozen_sigil)