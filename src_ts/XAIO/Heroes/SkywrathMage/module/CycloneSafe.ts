import { Unit, item_cyclone } from "wrapper/Imports"
import SkyAbilitiesHelper from "../Extentd/Abilities"
import { XAIOSettingsBladMailState, SkyUseCycloneBladMailState } from "../Menu"

let Helper = new SkyAbilitiesHelper()

export function XIAOSKYSafeCyclone(unit: Unit, targetInRange: Unit) {
	if (XAIOSettingsBladMailState.value
		&& targetInRange !== undefined
		&& targetInRange.HasBuffByName("modifier_item_blade_mail_reflect")
		&& targetInRange.HasBuffByName("modifier_skywrath_mystic_flare_aura_effect")) {
		let cyclone = unit.GetItemByClass(item_cyclone)
		if (cyclone && Helper.UseAbility(cyclone) && SkyUseCycloneBladMailState.value)
			return
	}
}