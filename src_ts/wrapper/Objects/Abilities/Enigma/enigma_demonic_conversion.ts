import Ability from "../../Base/Ability"

export default class enigma_demonic_conversion extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Enigma_DemonicConversion>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enigma_demonic_conversion", enigma_demonic_conversion)
