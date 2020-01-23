import Ability from "../../Base/Ability"

export default class antimage_counterspell extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_AntiMage_Counterspell>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("antimage_counterspell", antimage_counterspell)
