/*!
 * Created on Wed Oct 12 2018
 *
 * This file is part of Fusion.
 * Copyright (c) 2018 Fusion
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
/// <reference path="../Fusion-Native2.d.ts" />

import { GetItemByRegexp } from "./utils"

var enabled = false,
	doing_tp = false

Events.RegisterCallback("onUpdate", () => {
	if (!enabled || doing_tp || LocalDOTAPlayer.m_hAssignedHero === undefined)
		return
	var MyEnt = <C_DOTA_BaseNPC>LocalDOTAPlayer.m_hAssignedHero
	if(!MyEnt.m_bIsAlive) return
	var buff = MyEnt.GetBuffByName("modifier_skeleton_king_reincarnation_scepter_active"),
		tp = GetItemByRegexp(MyEnt, /item_(tpscroll|travel_boots)/),
		bkb = MyEnt.GetItemByName("item_black_king_bar"),
		waitTime = 1 + (bkb === undefined ? 1 : 2) / 30
	if(buff === undefined || tp === undefined || tp.m_fCooldown > 0 || buff.m_flDieTime - GameRules.m_fGameTime - (tp.m_fChannelTime + waitTime) > 1 / 30) return
	doing_tp = true
	SelectUnit(MyEnt, false)
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
		Ability: bkb,
		Unit: MyEnt,
		Queue: false
	})
	var fountain = Entities.GetAllEntities().filter(ent =>
		!ent.IsEnemy(LocalDOTAPlayer)
		&& ent.m_bIsDOTANPC
		&& (<C_DOTA_BaseNPC>ent).m_iszUnitName === "dota_fountain"
	)[0]
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
		Ability: tp,
		Position: fountain.m_vecNetworkOrigin,
		Unit: MyEnt,
		Queue: false
	})
	setTimeout((waitTime + 1 / 30) * 1000, () => doing_tp = false)
})

Menu.AddEntryEz("WK Abuse", {
	enabled: {
		name: "State:",
		value: enabled,
		type:  "toggle"
	}
}, (name, val) => enabled = val)