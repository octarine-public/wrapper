import Ability from "../../Base/Ability"

export default class kunkka_torrent extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Kunkka_Torrent>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius") + (this.Owner?.GetTalentValue("special_bonus_unique_kunkka") ?? 0)
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kunkka_torrent", kunkka_torrent)
