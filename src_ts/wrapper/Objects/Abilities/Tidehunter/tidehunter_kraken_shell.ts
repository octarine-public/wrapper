import Ability from "../../Base/Ability"

export default class tidehunter_kraken_shell extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tidehunter_KrakenShell>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tidehunter_kraken_shell", tidehunter_kraken_shell)
