import SkyAbilitiesHelper from "../Extentd/Abilities"
import { Unit, skywrath_mage_arcane_bolt } from "wrapper/Imports"
import { XAIOComboKey, SmartArcaneBoltKey, SmartArcaneAutoBoltState, SmartArcaneOwnerHP } from "../Menu"

let Helper = new SkyAbilitiesHelper()

export function XIAOSKYSmartBolt(unit: Unit, mouse_target: Nullable<Unit>) {

	if (XAIOComboKey.is_pressed || mouse_target === undefined || mouse_target.IsInvulnerable || (!SmartArcaneBoltKey.is_pressed && !SmartArcaneAutoBoltState.value))
		return

	let arcane_bolt = unit.GetAbilityByClass(skywrath_mage_arcane_bolt)
	if (arcane_bolt !== undefined
		&& arcane_bolt.CanHit(mouse_target)
		&& arcane_bolt.CanBeCasted()
		&& Helper.CancelMagicImmune(mouse_target)
		&& (SmartArcaneBoltKey.is_pressed || mouse_target.HPPercent <= SmartArcaneOwnerHP.value || SmartArcaneOwnerHP.value === 0))
		Helper.UseAbility(arcane_bolt, false, mouse_target)
}