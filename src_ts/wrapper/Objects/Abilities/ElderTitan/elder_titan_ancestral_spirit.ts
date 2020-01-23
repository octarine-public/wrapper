import Ability from "../../Base/Ability"

export default class elder_titan_ancestral_spirit extends Ability {
	public readonly NativeEntity!: CDOTA_Ability_Elder_Titan_AncestralSpirit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("elder_titan_ancestral_spirit", elder_titan_ancestral_spirit)
