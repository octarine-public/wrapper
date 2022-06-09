import { DOTAScriptInventorySlot_t } from "../../Enums/DOTAScriptInventorySlot_t"
import { LocalPlayer } from "../Base/Entity"
import Item from "../Base/Item"
import Player from "../Base/Player"
import Unit from "../Base/Unit"

const MAX_ITEMS = DOTAScriptInventorySlot_t.DOTA_ITEM_NEUTRAL_SLOT

export default class Inventory {
	constructor(public readonly Owner: Unit) { }

	get TotalItems(): Nullable<Item>[] {
		return this.Owner.TotalItems
	}
	get TPScroll(): Nullable<Item> {
		return this.GetItem(DOTAScriptInventorySlot_t.DOTA_ITEM_TP_SCROLL)
	}
	get NeutralItem(): Nullable<Item> {
		return this.GetItem(DOTAScriptInventorySlot_t.DOTA_ITEM_NEUTRAL_SLOT)
	}
	get Items(): Item[] {
		const ar = this.GetItems(DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1, DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_6),
			tp = this.TPScroll,
			neutral = this.NeutralItem
		if (tp !== undefined)
			ar.push(tp)
		if (neutral !== undefined)
			ar.push(neutral)
		return ar
	}
	get Backpack(): Item[] {
		return this.GetItems(DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_7, DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9)
	}
	get Stash(): Item[] {
		return this.GetItems(DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_1, DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_6)
	}
	get FreeSlotsInventory(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1, DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_6)
	}
	get FreeSlotsBackpack(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_7, DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9)
	}
	get FreeSlotsStash(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_1, DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_6)
	}
	get HasAnyItemInventory(): boolean {
		return this.HasAnyItem(DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1, DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_6)
	}
	get HasAnyItemBackpack(): boolean {
		return this.HasAnyItem(DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_7, DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9)
	}
	get HasAnyItemStash(): boolean {
		return this.HasAnyItem(DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_1, DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_6)
	}
	get HasFreeSlotsInventory(): boolean {
		return this.HasFreeSlot(DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1, DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_6)
	}
	get HasFreeSlotsBackpack(): boolean {
		return this.HasFreeSlot(DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_7, DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9)
	}
	get HasFreeSlotsStash(): boolean {
		return this.HasFreeSlot(DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_1, DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_6)
	}

	public GetItem(slot: DOTAScriptInventorySlot_t): Nullable<Item> {
		return this.Owner.TotalItems[slot]
	}
	public GetItems(start: DOTAScriptInventorySlot_t, end: DOTAScriptInventorySlot_t): Item[] {
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)

		const items: Item[] = []
		if (this.Owner.IsValid && start <= end)
			for (let i = start; i <= end; i++) {
				const item = this.GetItem(i)
				if (item !== undefined)
					items.push(item)
			}

		return items
	}
	public GetFreeSlots(start: DOTAScriptInventorySlot_t, end: DOTAScriptInventorySlot_t): DOTAScriptInventorySlot_t[] {
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)

		const items: DOTAScriptInventorySlot_t[] = []
		if (this.Owner.IsValid && start <= end)
			for (let i = start; i <= end; i++)
				if (this.GetItem(i) === undefined)
					items.push(i)
		return items
	}
	public HasAnyItem(start: DOTAScriptInventorySlot_t, end: DOTAScriptInventorySlot_t): boolean {
		if (this.Owner.IsValid && start <= MAX_ITEMS && start <= end)
			for (let i = Math.min(end + 1, MAX_ITEMS); i-- > start;)
				if (this.GetItem(i) !== undefined)
					return true
		return false
	}
	public HasFreeSlot(start: DOTAScriptInventorySlot_t, end: DOTAScriptInventorySlot_t): boolean {
		if (this.Owner.IsValid && start <= MAX_ITEMS && start <= end)
			for (let i = Math.min(end + 1, MAX_ITEMS); i-- > start;)
				if (this.GetItem(i) === undefined)
					return true
		return false
	}
	public HasFreeSlots(start: DOTAScriptInventorySlot_t, end: DOTAScriptInventorySlot_t, howMany: number): boolean {
		if (this.Owner.IsValid && start <= MAX_ITEMS && start <= end) {
			let man = 0
			for (let i = Math.min(end + 1, MAX_ITEMS); i-- > start;)
				if (this.GetItem(i) === undefined)
					man++
			return man >= howMany
		}
		return false
	}
	public HasItemInInventory(name: string | RegExp, includeBackpack: boolean = false): boolean {
		return this.GetItemByName(name, includeBackpack) !== undefined
	}
	public CountItemByOtherPlayer(player: Nullable<Player> = LocalPlayer): number {
		if (player === undefined)
			return 0
		return this.TotalItems.reduce((counter, item) => {
			if (item !== undefined && item.PurchaserID === player.PlayerID)
				counter++
			return counter
		}, 0)
	}
	public GetItemByName(name: string | RegExp, includeBackpack: boolean = false): Nullable<Item> {
		if (this.Owner.IsValid) {
			const Items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
			return Items.find(item => name instanceof RegExp ? name.test(item.Name) : item.Name === name)
		}
		return undefined
	}
	public GetItemByClass<T extends Item>(class_: Constructor<T>, includeBackpack: boolean = false): Nullable<T> {
		if (this.Owner.IsValid) {
			const Items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
			return Items.find(item => item instanceof class_) as Nullable<T>
		}
		return undefined
	}
	public GetItemsByNames(names: string[], includeBackpack: boolean = false): Item[] {
		const items: Item[] = []
		if (this.Owner.IsValid) {
			const Items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
			return Items.filter(item => names.includes(item.Name))
		}
		return items
	}
	public GetItemsByClasses<T extends Item>(classes: Constructor<T>[], includeBackpack: boolean = false): T[] {
		const items: T[] = []
		if (this.Owner.IsValid) {
			const Items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
			return Items.filter(item => classes.some(class_ => item instanceof class_)) as T[]
		}
		return items
	}
}
