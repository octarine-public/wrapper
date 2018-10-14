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
export function GetItemByRegexp(ent, regex) {
    var found;
    for (let i = 0; i < 6; i++) {
        let item = ent.GetItemInSlot(i);
        if (item !== undefined && regex.test(item.m_sAbilityName)) {
            return item;
        }
    }
    return undefined;
}
export function orderBy(ar, cb) {
    return ar.sort((a, b) => cb(a) - cb(b));
}
var loaded = false;
export function ensureUtilsLoaded() {
    if (!loaded) {
        function OnNPCSpawned(npc) {
            if (npc.m_iszUnitName === undefined) {
				setTimeout(50, () => {
					if (npc.m_bIsValid)
						OnNPCSpawned(npc)
				})
                return;
            }
            Events.FireCallback("onNPCCreated", npc);
        }
        Events.RegisterCallbackName("onNPCCreated");
        Events.RegisterCallback("onEntityCreated", (ent) => {
            if (ent.m_bIsDOTANPC)
                OnNPCSpawned(ent);
        });
        loaded = true;
    }
    return loaded;
}
