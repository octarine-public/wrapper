import EntityManager, { LocalPlayer } from "../../Managers/EntityManager"
import Item from "../Base/Item"
import Player from "../Base/Player"
import Unit from "../Base/Unit"

const MAX_ITEMS = 16

export default class Inventory {
	public TotalItems_: (Item | CEntityIndex)[] = []

	constructor(public readonly Owner: Unit) {
		let ar = this.Owner.m_pBaseEntity.m_Inventory.m_hItems
		// tslint:disable-next-line:prefer-conditional-expression
		if (ar !== undefined) {
			// loop-optimizer: FORWARD
			this.TotalItems_ = ar.map(item => (EntityManager.GetEntityByNative(item) as Item) ?? item)
		} else
			this.TotalItems_ = new Array(MAX_ITEMS)
	}

	get TotalItems(): Nullable<Item>[] {
		// loop-optimizer: FORWARD
		this.TotalItems_ = this.TotalItems_.map(item => item instanceof Item ? item : EntityManager.GetEntityByNative(item) ?? item) as (Item | CEntityIndex)[]
		// loop-optimizer: FORWARD
		return this.TotalItems_.map(item => item instanceof Item ? item : undefined)
	}

	get Items(): Item[] {
		return this.GetItems(0, 5)
	}
	get Backpack(): Item[] {
		return this.GetItems(6, 9)
	}
	get Stash(): Item[] {
		return this.GetItems(10, 15)
	}
	get FreeSlotsInventory(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(0, 5)
	}
	get FreeSlotsBackpack(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(6, 9)
	}
	get FreeSlotsStash(): DOTAScriptInventorySlot_t[] {
		return this.GetFreeSlots(10, 15)
	}
	get HasAnyItemInventory(): boolean {
		return this.HasAnyItem(0, 5)
	}
	get HasAnyItemBackpack(): boolean {
		return this.HasAnyItem(6, 9)
	}
	get HasAnyItemStash(): boolean {
		return this.HasAnyItem(10, 15)
	}
	get HasFreeSlotsInventory(): boolean {
		return this.HasFreeSlot(0, 5)
	}
	get HasFreeSlotsBackpack(): boolean {
		return this.HasFreeSlot(6, 9)
	}
	get HasFreeSlotsStash(): boolean {
		return this.HasFreeSlot(10, 15)
	}
	get IsStashEnabled(): boolean {
		return this.Owner.m_pBaseEntity.m_Inventory.m_bStashEnabled
	}

	public GetItem(slot: DOTAScriptInventorySlot_t): Nullable<Item> {
		return this.TotalItems[slot]
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
		// loop-optimizer: POSSIBLE_UNDEFINED
		this.TotalItems.forEach(item => {
			if (item?.m_pBaseEntity.m_iPlayerOwnerID === player?.PlayerID)
				counter++
		})
		return counter
	}
	public GetItemByName(name: string | RegExp, includeBackpack: boolean = false): Nullable<Item> {
		if (this.Owner.IsValid) {
			let len = Math.min(this.TotalItems.length, includeBackpack ? 10 : 6)

			for (let i = 0; i < len; i++) {
				let item = this.GetItem(i)

				if (item === undefined)
					continue

				if (name instanceof RegExp) {
					if (name.test(item.Name))
						return item
				} else if (item.Name === name)
					return item
			}
		}
		return undefined
	}
	public GetItemsByNames(names: string[], includeBackpack: boolean = false): Item[] {
		let items: Item[] = []

		if (this.Owner.IsValid) {
			// loop-optimizer: FORWARD
			names.forEach(name => {
				let item = this.GetItemByName(name, includeBackpack)

				if (item !== undefined)
					items.push(item)
			})
		}
		return items
	}
	public GetItemByNameInBackpack(name: string): Nullable<Item> {
		if (this.Owner.IsValid) {
			let len = Math.min(this.TotalItems.length, 10)

			for (let i = 6; i < len; i++) {
				let item = this.GetItem(i)
				if (item !== undefined && item.Name === name)
					return item
			}
		}
		return undefined
	}
}
