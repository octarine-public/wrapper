import { Courier, LocalPlayer, GameSleeper, EventsSDK } from "wrapper/Imports"
import { XAIODeliverState } from "../Menu"
import { CourierHelper } from "../Helper"

let Sleep: GameSleeper = new GameSleeper()

export function Deliver(courier: Courier) {
	if (!XAIODeliverState.value
		|| Sleep.Sleeping(courier)
		|| CourierHelper.LAST_CLICK
		|| CourierHelper.DELIVER_DISABLE
		|| !CourierHelper.OwnerIsValid)
		return

	const courierInventory = courier.Inventory
	const localPlayerInventory = LocalPlayer!.Hero!.Inventory

	if (!localPlayerInventory.HasFreeSlot(0, 9))
		return

	let free_slots_local = localPlayerInventory.GetFreeSlots(0, 9).length,
		cour_slots_local = courierInventory.CountItemByOtherPlayer(),
		items_in_stash = localPlayerInventory.Stash.length

	if ((items_in_stash !== 0 || cour_slots_local !== 0)
		&& courierInventory.GetFreeSlots(0, 9).length >= items_in_stash
		&& free_slots_local >= (items_in_stash + cour_slots_local)) {

		if (courier.State === CourierState_t.COURIER_NUM_STATES /** don't work */ && items_in_stash === 0)
			return

		CourierHelper.CastCourAbility(7, courier) // transfer_items
		Sleep.Sleep(CourierHelper.CastDelay, courier)
		return
	}
}
EventsSDK.on("GameEnded", () => {
	Sleep.FullReset()
})