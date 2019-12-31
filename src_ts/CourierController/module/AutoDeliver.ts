import { Courier } from "wrapper/Imports"
import { deliverState } from "../Menu"
import { Sleep, OwnerIsValid } from "../bootstrap"
import { CourierBase } from "../Data/Helper"

function Deliver(courier: Courier): boolean {
	if (CourierBase.DELIVER_DISABLE || CourierBase.LAST_CLICK)
		return false
	if (!LocalPlayer!.Hero!.IsAlive || !LocalPlayer!.Hero!.Inventory.HasFreeSlot(0, 9))
		return false
	let free_slots_local = LocalPlayer!.Hero!.Inventory.GetFreeSlots(0, 9).length,
		cour_slots_local = courier.Inventory.CountItemByOtherPlayer()
	let items_in_stash = LocalPlayer!.Hero!.Inventory.Stash.reduce((prev, cur) => prev + (cur !== undefined ? 1 : 0), 0)
	//console.log("cour_slots_local: ", cour_slots_local, "items_in_stash: ", items_in_stash)
	if (
		items_in_stash > 0
		&& courier.Inventory.GetFreeSlots(0, 9).length >= items_in_stash
		&& free_slots_local >= (items_in_stash + cour_slots_local)
	) {
		CourierBase.CastCourAbility(7, courier) // courier_take_stash_and_transfer_items
		Sleep.Sleep(CourierBase.CastDelay)
		return true
	}
	if (cour_slots_local > 0 && free_slots_local >= cour_slots_local) {
		let StateCourEnum = courier.State
		if (StateCourEnum !== CourierState_t.COURIER_STATE_DELIVERING_ITEMS) {
			CourierBase.CastCourAbility(4, courier)
			Sleep.Sleep(CourierBase.CastDelay)
			return true
		}
	}
	return false
}

export function AutoDeliver(courier: Courier): boolean {
	if (!deliverState.value || CourierBase.LAST_CLICK || !OwnerIsValid())
		return false
	let StateCourEnt = courier.StateHero,
		StateCourEnum = courier.State
	if (LocalPlayer!.Hero === StateCourEnt && Deliver(courier))
		return false
	switch (StateCourEnum) {
		case CourierState_t.COURIER_STATE_IDLE:
		case CourierState_t.COURIER_STATE_AT_BASE:
		case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
		case CourierState_t.COURIER_STATE_MOVING:
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (!Deliver(courier)) {
				return false
			}
			break
	}
	return false
}
