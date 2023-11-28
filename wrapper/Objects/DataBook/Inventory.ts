import { DOTAScriptInventorySlot } from "../../Enums/DOTAScriptInventorySlot"
import { LocalPlayer } from "../Base/Entity"
import { Item } from "../Base/Item"
import { Player } from "../Base/Player"
import { Unit } from "../Base/Unit"

const MAX_ITEMS = DOTAScriptInventorySlot.DOTA_ITEM_NEUTRAL_SLOT

export class Inventory {
	constructor(public readonly Owner: Unit) {}

	public get TotalItems(): Nullable<Item>[] {
		return this.Owner.TotalItems
	}
	public get TPScroll(): Nullable<Item> {
		return this.GetItem(DOTAScriptInventorySlot.DOTA_ITEM_TP_SCROLL)
	}
	public get NeutralItem(): Nullable<Item> {
		return this.GetItem(DOTAScriptInventorySlot.DOTA_ITEM_NEUTRAL_SLOT)
	}
	public get Items(): Item[] {
		const ar = this.GetItems(
				DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1,
				DOTAScriptInventorySlot.DOTA_ITEM_SLOT_6
			),
			tp = this.TPScroll,
			neutral = this.NeutralItem
		if (tp !== undefined) {
			ar.push(tp)
		}
		if (neutral !== undefined) {
			ar.push(neutral)
		}
		return ar
	}
	public get Backpack(): Item[] {
		return this.GetItems(
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_7,
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_9
		)
	}
	public get Stash(): Item[] {
		return this.GetItems(
			DOTAScriptInventorySlot.DOTA_STASH_SLOT_1,
			DOTAScriptInventorySlot.DOTA_STASH_SLOT_6
		)
	}
	public get FreeSlotsInventory(): DOTAScriptInventorySlot[] {
		return this.GetFreeSlots(
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1,
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_6
		)
	}
	public get FreeSlotsBackpack(): DOTAScriptInventorySlot[] {
		return this.GetFreeSlots(
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_7,
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_9
		)
	}
	public get FreeSlotsStash(): DOTAScriptInventorySlot[] {
		return this.GetFreeSlots(
			DOTAScriptInventorySlot.DOTA_STASH_SLOT_1,
			DOTAScriptInventorySlot.DOTA_STASH_SLOT_6
		)
	}
	public get HasAnyItemInventory(): boolean {
		return this.HasAnyItem(
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1,
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_6
		)
	}
	public get HasAnyItemBackpack(): boolean {
		return this.HasAnyItem(
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_7,
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_9
		)
	}
	public get HasAnyItemStash(): boolean {
		return this.HasAnyItem(
			DOTAScriptInventorySlot.DOTA_STASH_SLOT_1,
			DOTAScriptInventorySlot.DOTA_STASH_SLOT_6
		)
	}
	public get HasFreeSlotsInventory(): boolean {
		return this.HasFreeSlot(
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1,
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_6
		)
	}
	public get HasFreeSlotsBackpack(): boolean {
		return this.HasFreeSlot(
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_7,
			DOTAScriptInventorySlot.DOTA_ITEM_SLOT_9
		)
	}
	public get HasFreeSlotsStash(): boolean {
		return this.HasFreeSlot(
			DOTAScriptInventorySlot.DOTA_STASH_SLOT_1,
			DOTAScriptInventorySlot.DOTA_STASH_SLOT_6
		)
	}

	public GetItem(slot: DOTAScriptInventorySlot): Nullable<Item> {
		return this.Owner.TotalItems[slot]
	}
	public GetItemSlot(item: Item): Nullable<DOTAScriptInventorySlot> {
		if (!this.Owner.IsValid) {
			return
		}
		for (let index = 0, end = MAX_ITEMS; index < end; index++) {
			if (this.GetItem(index) === item) {
				return index
			}
		}
	}
	public GetItems(
		start: DOTAScriptInventorySlot,
		end: DOTAScriptInventorySlot
	): Item[] {
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)

		const items: Item[] = []
		if (this.Owner.IsValid && start <= end) {
			for (let i = start; i <= end; i++) {
				const item = this.GetItem(i)
				if (item !== undefined) {
					items.push(item)
				}
			}
		}

		return items
	}
	public GetFreeSlots(
		start: DOTAScriptInventorySlot,
		end: DOTAScriptInventorySlot
	): DOTAScriptInventorySlot[] {
		if (!this.Owner.IsValid) {
			return []
		}
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)
		const items: DOTAScriptInventorySlot[] = []
		for (let i = start; i <= end; i++) {
			if (this.GetItem(i) === undefined) {
				items.push(i)
			}
		}
		return items
	}
	public HasAnyItem(
		start: DOTAScriptInventorySlot,
		end: DOTAScriptInventorySlot
	): boolean {
		if (!this.Owner.IsValid) {
			return false
		}
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)
		for (let i = start; i < Math.min(end + 1, MAX_ITEMS); i++) {
			if (this.GetItem(i) !== undefined) {
				return true
			}
		}
		return false
	}
	public HasFreeSlot(
		start: DOTAScriptInventorySlot,
		end: DOTAScriptInventorySlot
	): boolean {
		if (!this.Owner.IsValid) {
			return false
		}
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)
		for (let i = start; i <= end; i++) {
			if (this.GetItem(i) === undefined) {
				return true
			}
		}
		return false
	}
	public HasFreeSlots(
		start: DOTAScriptInventorySlot,
		end: DOTAScriptInventorySlot,
		howMany: number
	): boolean {
		if (!this.Owner.IsValid) {
			return false
		}
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)
		let man = 0
		for (let i = start; i <= end; i++) {
			if (this.GetItem(i) === undefined) {
				man++
			}
		}
		return man >= howMany
	}
	public HasItemInInventory(
		name: string | RegExp,
		includeBackpack: boolean = false
	): boolean {
		return this.GetItemByName(name, includeBackpack) !== undefined
	}
	public CountItemByOtherPlayer(player: Nullable<Player> = LocalPlayer): number {
		if (player === undefined) {
			return 0
		}
		return this.TotalItems.reduce((counter, item) => {
			if (item !== undefined && item.PurchaserID === player.PlayerID) {
				counter++
			}
			return counter
		}, 0)
	}
	public GetItemByName(
		name: string | RegExp,
		includeBackpack: boolean = false
	): Nullable<Item> {
		if (!this.Owner.IsValid) {
			return undefined
		}
		const items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
		return items.find(item =>
			name instanceof RegExp ? name.test(item.Name) : item.Name === name
		)
	}
	public GetItemByClass<T extends Item>(
		class_: Constructor<T>,
		includeBackpack: boolean = false
	): Nullable<T> {
		if (!this.Owner.IsValid) {
			return undefined
		}
		const items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
		return items.find(item => item instanceof class_) as Nullable<T>
	}
	public GetItemsByNames(names: string[], includeBackpack: boolean = false): Item[] {
		if (!this.Owner.IsValid) {
			return []
		}
		const items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
		return items.filter(item => names.includes(item.Name))
	}
	public GetItemsByClasses<T extends Item>(
		classes: Constructor<T>[],
		includeBackpack: boolean = false
	): T[] {
		if (!this.Owner.IsValid) {
			return []
		}
		const items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
		return items.filter(item => classes.some(class_ => item instanceof class_)) as T[]
	}
}
