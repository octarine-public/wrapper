/*!
 * Created on Thu Jan 31 2019
 *
 * This file is part of Fusion.
 * Copyright (c) 2019 Fusion
 *
 * Fusion is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Fusion is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Fusion.  If not, see <http://www.gnu.org/licenses/>.
 */

import { EComboAction, Combo } from "wrapper/Combo"
import * as Orders from "Orders"

var combo = new Combo(),
	config = {
		hotkey: 0
	},
	executing = 0

function GetRealArcWardens(): C_DOTA_BaseNPC[] {
	var localplayer = LocalDOTAPlayer
	// loop-optimizer: POSSIBLE_UNDEFINED
	return Entities.GetAllEntities().filter(ent =>
		ent.m_bIsValid
		&& ent instanceof C_DOTA_BaseNPC
		&& !ent.IsEnemy(localplayer)
		&& ent.m_bIsAlive
		&& ent.m_bIsHero
		&& !ent.m_bIsIllusion
		&& ent.GetAbilityByName("arc_warden_tempest_double") !== undefined
	) as C_DOTA_BaseNPC[]
}

combo.addAbility("item_hand_of_midas", EComboAction.NEARBY_ENEMY_SIEGE)
combo.addAbility("item_hand_of_midas", EComboAction.NEARBY_ENEMY_CREEP)
combo.addAbility("item_ethereal_blade", EComboAction.CURSOR_ENEMY)
combo.addAbility("item_soul_ring", EComboAction.NO_TARGET)
combo.addAbility("item_arcane_boots", EComboAction.NO_TARGET)
combo.addAbility("item_guardian_greaves", EComboAction.NO_TARGET)
combo.addAbility("item_shivas_guard", EComboAction.NO_TARGET)
combo.addAbility("item_blade_mail", EComboAction.NO_TARGET)
combo.addAbility(/item_(orchid|bloodthorn)/, EComboAction.CURSOR_ENEMY)
combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
combo.addAbility(/item_(solar_crest|medallion_of_courage)/, EComboAction.CURSOR_ENEMY)
combo.addAbility("arc_warden_magnetic_field", EComboAction.SELF)
combo.addAbility(/item_necronomicon/, EComboAction.NO_TARGET)
combo.addAbility("item_mjollnir", EComboAction.SELF)
combo.addAbility("item_nullifier", EComboAction.CURSOR_ENEMY)
combo.addAbility("item_heavens_halberd", EComboAction.CURSOR_ENEMY)
combo.addAbility("item_diffusal_blade", EComboAction.CURSOR_ENEMY)
combo.addAbility("item_sheepstick", EComboAction.CURSOR_ENEMY)
combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
combo.addAbility("item_manta", EComboAction.NO_TARGET, { combo_delay: 0.1 * 1000 })
combo.addDelay()
combo.addAbility("item_ancient_janggo", EComboAction.NO_TARGET)
combo.addAbility("arc_warden_spark_wraith", EComboAction.CURSOR_ENEMY, { dynamicDelay: abil => abil.GetSpecialValue("activation_delay") })
combo.addAbility("arc_warden_flux", EComboAction.CURSOR_ENEMY)
combo.addAbility("item_mask_of_madness", EComboAction.NO_TARGET)
combo.addAbility("item_hurricane_pike", EComboAction.CURSOR_ENEMY)

Events.addListener("onWndProc", (message_type, wParam) => {
	if (!IsInGame() || executing !== 0 || parseInt(wParam as any) !== config.hotkey)
		return true
	if (message_type === 0x100) { // WM_KEYDOWN
		const MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	
		const tempest_double = MyEnt.GetAbilityByName("arc_warden_tempest_double")
		if (tempest_double.m_fCooldown === 0) {
			Orders.CastNoTarget(MyEnt, tempest_double, false)
			setTimeout((tempest_double.m_fCastPoint + GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000 + 30, () => {
				var arcs = GetRealArcWardens()
				if (arcs.length !== 1 && !arcs.some(arc => arc.m_bIsWaitingToSpawn)) {
					executing = arcs.length
					arcs.forEach(arc => combo.execute(arc, () => executing--))
				}
			})
		} else { // we need these fucking brackets because of loop optimizer
			var arcs = GetRealArcWardens()
			executing = arcs.length
			GetRealArcWardens().forEach(arc => combo.execute(arc, () => executing--))
		}
		return false
	}
	return true
})

{
	let root = new Menu_Node("Arc Warden Combo")
	root.entries.push(new Menu_Keybind (
		"Hotkey",
		config.hotkey,
		node => config.hotkey = node.value
	))
	root.Update()
	Menu.AddEntry(root)
}