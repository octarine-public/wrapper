/*!
 * Created on Tue Feb 19 2019
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

import * as Orders from "Orders"
import * as Utils from "Utils"

// loop-optimizer: KEEP
var spots: Vector[] = /*Utils.orderBy(*/[
		new Vector(4205.449707, -399.444458, 384.000000),
		new Vector(-2533.218750, -552.533875, 385.125000), // calibrated
		new Vector(-1865.487549, 4438.296875, 386.390900), // calibrated
		new Vector(2546.226563, 41.390625, 384.000000), // calibrated
		new Vector(-4255.669922, 3469.897461, 256.000000), // calibrated
		new Vector(-55.859379, -3266.130127, 384.000000), // calibrated
		new Vector(424.332947, -4665.735352, 396.747070), // calibrated
		new Vector(-3744.976563, 853.449219, 385.992188), // calibrated
	],
	config = {
		enabled: false,
		// hotkey_dynamic: 0,
		visals: false,
	},
	is_stacking: boolean = false

Events.addListener("onDraw", () => {
	if (!IsInGame() || !config.visals)
		return
	spots.forEach((spot, i) => {
		let screen_pos = Renderer.WorldToScreen(spot)
		if (!screen_pos.IsValid())
			return
		Renderer.FilledRect(screen_pos.x - 25, screen_pos.z - 25, 50, 50, 255, 0, 0)
		Renderer.Text(screen_pos.x, screen_pos.z, (i + 1).toString(), 0, 255, 0)
	})
})
Events.addListener("onTick", () => {
	if (!config.enabled || is_stacking)
		return
	var MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC,
		torrent = MyEnt.GetAbilityByName("kunkka_torrent")
	if (torrent === undefined || torrent.m_fCooldown !== 0 || torrent.m_iManaCost > MyEnt.m_flMana)
		return
	var cur_time: number = GameRules.m_fGameTime - GameRules.m_flGameStartTime
	if (cur_time < 60)
		return
	/*if (
		Math.abs (
			(cur_time % 60) - 47
		) <= Fusion.MyTick
	)
		KunkkaAutoStack_Notify(cur_time)*/
	if (
		Math.abs (
			(cur_time % 60) -
			(60 - (torrent.m_fCastPoint + torrent.GetSpecialValue("delay") + 0.6)), // it tooks ~0.6sec to raise y coord of creeps
		) >= 1 / 30
	)
		return
	var my_vec: Vector = MyEnt.m_vecNetworkOrigin,
		cast_range: number = torrent.m_iCastRange
	// loop-optimizer: KEEP
	Utils.orderBy(spots.filter(spot => spot.DistTo(my_vec) < cast_range), spot => spot.DistTo(my_vec)).every(spot => {
		Orders.CastPosition(MyEnt, torrent, spot, false)
		is_stacking = true
		setTimeout(torrent.m_fCastPoint * 1000 + 30, () => is_stacking = false)
		return false
	})
})

Events.addListener("onPrepareUnitOrders", () => !is_stacking) // cancel orders while stacking

/*Events.addListener("onWndProc", (message_type, wParam) => {
	if (!IsInGame())
		return true
	let key = parseInt(wParam as any)
	if (key === config.hotkey_dynamic && message_type === 0x101) { // WM_KEYUP
		const MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC,
			torrent = MyEnt.GetAbilityByName("kunkka_torrent"),
			torrent_radius = torrent.GetSpecialValue("radius")
		var ancients = Utils.GetCursorWorldVec().GetEntitiesInRange(1000).filter(ent =>
				ent instanceof C_DOTA_BaseNPC &&
				ent.IsEnemy(MyEnt) &&
				ent.m_bIsCreep &&
				!ent.m_bIsLaneCreep // &&
				//!ent.m_bIsWaitingToSpawn
			)
		var ancientsPositionSum = ancients.map(ancient => ancient.m_vecNetworkOrigin).reduce((sum, vec): number[] => sum ? [sum[0] + vec[0], sum[1] + vec[1], sum[2] + vec[2]] : vec),
			ancientsPosition = new Vector(ancientsPositionSum[0] / ancients.length, ancientsPositionSum[1] / ancients.length, ancientsPositionSum[2] / ancients.length)
			var failed = ancients.some(ancient => ancient.m_vecNetworkOrigin.DistTo(ancientsPosition) >= torrent_radius)
			if (!failed) {
				console.log(ancientsPosition)
				Orders.CastPosition(MyEnt, torrent, ancientsPosition, false)
			} else
				console.log("can't stack it.")
		return false
	}
	return true
})*/

{
	let root = new Menu_Node("Kuтkka Autostacker")
	root.entries.push(new Menu_Toggle (
		"State",
		config.enabled,
		node => config.enabled = node.value,
	))
	root.entries.push(new Menu_Toggle (
		"Draw visuals over stackable spots",
		config.visals,
		node => config.visals = node.value,
	))
	/*root.entries.push(new Menu_Keybind (
		"Dynamic hotkey (reqires spot vision)",
		config.hotkey_dynamic,
		node => config.hotkey_dynamic = node.value
	))*/
	root.Update()
	Menu.AddEntry(root)
}
