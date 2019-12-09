import { DOTA_GameMode, Game } from "wrapper/Imports"
import { deliverState } from "../Menu"
import { CourierBase } from "../Data/Helper"
import { allyCourier, Sleep, Owner } from "../bootstrap"


function Deliver(): boolean {
	if (CourierBase.DELIVER_DISABLE) {
		return false
	}
	if (!Owner.IsAlive || !Owner.Inventory.HasFreeSlot(0, 9)) {
		return false
	}
	let free_slots_local = Owner.Inventory.GetFreeSlots(0, 9).length,
		cour_slots_local = allyCourier.IsControllable && allyCourier.Inventory.CountItemByOtherPlayer()
	let items_in_stash = Owner.Inventory.Stash.reduce((prev, cur) => prev + (cur !== undefined ? 1 : 0), 0)
	//console.log("cour_slots_local: ", cour_slots_local, "items_in_stash: ", items_in_stash)
	if (
		items_in_stash > 0
		&& allyCourier.IsControllable
		&& allyCourier.Inventory.GetFreeSlots(0, 9).length >= items_in_stash
		&& free_slots_local >= (items_in_stash + cour_slots_local)
	) {
		CourierBase.CastCourAbility(7, allyCourier) // courier_take_stash_and_transfer_items
		Sleep.Sleep(CourierBase.CastDelay)
		return true
	}
	if (cour_slots_local > 0 && free_slots_local >= cour_slots_local) {
		let StateCourEnum = allyCourier.State
		if (StateCourEnum !== CourierState_t.COURIER_STATE_DELIVERING_ITEMS) {
			CourierBase.CastCourAbility(4, allyCourier)
			Sleep.Sleep(CourierBase.CastDelay)
			return true
		}
	}
	return false
}

export function AutoDeliver(): boolean {
	if (Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !deliverState.value)
		return false
	let StateCourEnt = allyCourier.StateHero,
		StateCourEnum = allyCourier.State
	if (Owner === StateCourEnt && Deliver())
		return false
	switch (StateCourEnum) {
		case CourierState_t.COURIER_STATE_IDLE:
		case CourierState_t.COURIER_STATE_AT_BASE:
		case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
		case CourierState_t.COURIER_STATE_MOVING:
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (!Deliver()) {
				return false
			}
			break
	}
	return false
}