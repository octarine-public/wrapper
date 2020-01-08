import Ability from "../Base/Ability"

export default class naga_siren_mirror_image extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_NagaSiren_MirrorImage
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("naga_siren_mirror_image", naga_siren_mirror_image)
