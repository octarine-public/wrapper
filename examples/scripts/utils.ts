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

export function GetItemByRegexp(ent: C_DOTA_BaseNPC, regex: RegExp): C_DOTA_Item {
	var found
	for (let i = 0; i < 6; i++) {
		let item = ent.GetItemInSlot(i)
		if(item !== undefined && regex.test((<C_DOTA_Item>item).m_pAbilityData.m_pszAbilityName)) {
			return item
		}
	}
	return undefined
}

export function orderBy<T>(ar: T[], cb: (obj: T) => any): T[] {
	return ar.sort((a, b) => cb(a) - cb(b))
}

/**
 * @param time in seconds
 * @returns health of this entity after given amount of time
 */
export function HealthAfter(ent: C_DOTA_BaseNPC, time: number): number {
	var curHP = ent.m_iHealth,
		maxHP = ent.m_iMaxHealth
	return curHP + Math.min(ent.m_flHealthThinkRegen * time, maxHP - curHP)
}

export function GetDamage(ent: C_DOTA_BaseNPC): number { return ent.m_iDamageMin + ent.m_iDamageBonus }

export function VelocityWaypoint(ent: C_DOTA_BaseNPC, time: number, movespeed: number = ent.m_fIdealSpeed): Vector {
	return ent.InFront(movespeed * time)
}

export function HasLinkenAtTime(ent: C_DOTA_BaseNPC, time: number = 0): boolean {
	if (!ent.m_bIsHero)
		return false
	var sphere = ent.GetItemByName("item_sphere")

	return (
		sphere !== undefined &&
		sphere.m_fCooldown - time <= 0
	) || (
		ent.GetBuffByName("modifier_item_sphere_target") !== undefined
		&& ent.GetBuffByName("modifier_item_sphere_target").m_flDieTime - GameRules.m_fGameTime - time <= 0
	)
}

export function SelectGroup(group: C_BaseEntity[], first: boolean = false): void {
	group.filter(ent => ent !== undefined).forEach(ent => {
		SelectUnit(ent, !first)
		first = false
	})
}

export function IsFlagSet(base: bigint, flag: bigint) {
	return (base & flag) > 0
}

var loaded = false
export function ensureLoaded() {
	if (!loaded) {
		function OnNPCSpawned(npc: C_DOTA_BaseNPC) {
			if (npc.m_iszUnitName === undefined) {
				setTimeout(50, () => {
					if (npc.m_bIsValid)
						OnNPCSpawned(npc)
				})
				return
			}
			Events.FireCallback("onNPCCreated", npc)
		}
		
		Events.RegisterCallbackName("onNPCCreated")
		Events.RegisterCallback("onEntityCreated", (ent: C_BaseEntity) => {
			if (ent.m_bIsDOTANPC)
				OnNPCSpawned(<C_DOTA_BaseNPC>ent)
		})
		loaded = true
	}
	return loaded
}