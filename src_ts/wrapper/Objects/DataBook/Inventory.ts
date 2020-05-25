import EntityManager from "../../Managers/EntityManager"
import Item from "../Base/Item"
import Player from "../Base/Player"
import Unit from "../Base/Unit"
import { LocalPlayer } from "../Base/Entity"

const MAX_ITEMS = 16

export default class Inventory {
	constructor(public readonly Owner: Unit) { }

	get TotalItems(): Nullable<Item>[] {
		return this.Owner.TotalItems_.map(id => {
			let ent = EntityManager.EntityByIndex(id)
			if (ent instanceof Item)
				return ent
			return undefined
		})
	}
	get TPScroll(): Nullable<Item> {
		return this.GetItem(15)
	}
	get NeutralItem(): Nullable<Item> {
		return this.GetItem(16)
	}
	get Items(): Item[] {
		return [
			...this.GetItems(0, 5),
			...[this.TPScroll!, this.NeutralItem!].filter(x => x !== undefined)
		]
	}
	get Backpack(): Item[] {
		return this.GetItems(6, 8)
	}
	get Stash(): Item[] {
		return this.GetItems(9, 14)
	}
	get FreeSlotsInventory(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(0, 5)
	}
	get FreeSlotsBackpack(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(6, 8)
	}
	get FreeSlotsStash(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(9, 14)
	}
	get HasAnyItemInventory(): boolean {
		return this.HasAnyItem(0, 5)
	}
	get HasAnyItemBackpack(): boolean {
		return this.HasAnyItem(6, 8)
	}
	get HasAnyItemStash(): boolean {
		return this.HasAnyItem(9, 14)
	}
	get HasFreeSlotsInventory(): boolean {
		return this.HasFreeSlot(0, 5)
	}
	get HasFreeSlotsBackpack(): boolean {
		return this.HasFreeSlot(6, 8)
	}
	get HasFreeSlotsStash(): boolean {
		return this.HasFreeSlot(9, 14)
	}

	public GetItem(slot: DOTAScriptInventorySlot_t): Nullable<Item> {
		let id = this.Owner.TotalItems_[slot]
		let ent = EntityManager.EntityByIndex(id)
		if (ent instanceof Item)
			return ent
		return undefined
	}
	public GetItems(start: number, end: number): Item[] {
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)

		let items: Item[] = []
		if (this.Owner.IsValid && start <= end)
			for (let i = start; i <= end; i++) {
				let item = this.GetItem(i)
				if (item !== undefined)
					items.push(item)
			}

		return items
	}
	public GetFreeSlots(start: number, end: number): DOTAScriptInventorySlot_t[] {
		start = Math.min(start, MAX_ITEMS)
		end = Math.min(end, MAX_ITEMS)

		let items: DOTAScriptInventorySlot_t[] = []
		if (this.Owner.IsValid && start <= end)
			for (let i = start; i <= end; i++)
				if (this.GetItem(i) === undefined)
					items.push(i as DOTAScriptInventorySlot_t)
		return items
	}
	public HasAnyItem(start: number, end: number): boolean {
		if (this.Owner.IsValid && start <= MAX_ITEMS && start <= end)
			for (let i = Math.min(end + 1, MAX_ITEMS); i-- > start;)
				if (this.GetItem(i) !== undefined)
					return true
		return false
	}
	public HasFreeSlot(start: number, end: number): boolean {
		if (this.Owner.IsValid && start <= MAX_ITEMS && start <= end)
			for (let i = Math.min(end + 1, MAX_ITEMS); i-- > start;)
				if (this.GetItem(i) === undefined)
					return true
		return false
	}
	public HasFreeSlots(start: number, end: number, howMany: number): boolean {
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
		let counter = 0
		this.TotalItems.forEach(item => {
			if (item?.PurchaserID === player?.PlayerID)
				counter++
		})
		return counter
	}
	public GetItemByName(name: string | RegExp, includeBackpack: boolean = false): Nullable<Item> {
		if (this.Owner.IsValid) {
			let Items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
			return Items.find(item => name instanceof RegExp ? name.test(item.Name) : item.Name === name)
		}
		return undefined
	}
	public GetItemByClass<T extends Item>(class_: Constructor<T>, includeBackpack: boolean = false): Nullable<T> {
		if (this.Owner.IsValid) {
			let Items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
			return Items.find(item => item instanceof class_) as Nullable<T>
		}
		return undefined
	}
	public GetItemsByNames(names: string[], includeBackpack: boolean = false): Item[] {
		let items: Item[] = []
		if (this.Owner.IsValid) {
			let Items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
			return Items.filter(item => names.includes(item.Name))
		}
		return items
	}
	public GetItemsByClasses<T extends Item>(classes: Constructor<T>[], includeBackpack: boolean = false): T[] {
		let items: T[] = []
		if (this.Owner.IsValid) {
			let Items = includeBackpack ? [...this.Items, ...this.Backpack] : this.Items
			return Items.filter(item => classes.some(class_ => item instanceof class_)) as T[]
		}
		return items
	}
}
