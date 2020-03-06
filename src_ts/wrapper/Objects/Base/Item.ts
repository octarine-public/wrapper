import EntityManager from "../../Managers/EntityManager"
import { GameRules } from "../../Objects/Base/GameRules"
import Ability from "./Ability"
import Entity from "./Entity"
import Player from "./Player"

export default class Item extends Ability {
	public NativeEntity: Nullable<C_DOTA_Item>
	public EnableTime = 0
	public Shareability = EShareAbility.ITEM_NOT_SHAREABLE
	public IsDroppable = true
	public AssembledTime = 0
	public CanBeUsedOutOfInventory = false
	public InitialCharges = 0
	public IsAlertable = true
	public IsCastedOnPickup = false
	public IsCombinable = true
	public IsCombineLocked = false
	public IsDisassemblable = false
	public IsKillable = false
	public IsPermanent = false
	public IsPurchasable = true
	public IsPurchasedWhileDead = false
	public IsRecipe = false
	public RequiresCharges = false
	public IsSellable = true
	public IsStackable = false
	public PurchaserID = -1
	public PurchaseTime = 0
	public SecondaryCharges = 0

	get IsReady(): boolean {
		const unit = this.Owner
		return this.IsCooldownReady && this.Level !== 0 && (unit === undefined || (unit.Mana >= this.ManaCost && !unit.IsMuted))
	}
	get IsMuted(): boolean {
		return this.EnableTime !== 0 && this.EnableTime > GameRules!.RawGameTime
	}
	get Cost(): number {
		return this.AbilityData.Cost
	}
	get EffectName(): string {
		return this.AbilityData.EffectName
	}
	get IsDisplayingCharges(): boolean {
		return this.AbilityData.ItemDisplayCharges
	}
	get IsHidingCharges(): boolean {
		return this.AbilityData.ItemHideCharges
	}
	public get ModelName(): string {
		return this.AbilityData.ModelName
	}
	public get OldOwner(): Nullable<Entity> {
		return EntityManager.GetEntityByNative(this.NativeEntity?.m_hOldOwnerEntity ?? 0)
	}
	public get ShouldDisplayCharges(): boolean {
		return this.IsStackable || this.RequiresCharges || this.IsDisplayingCharges
	}

	public DisassembleItem(queue?: boolean) {
		return this.Owner?.DisassembleItem(this, queue)
	}
	public MoveItem(slot: DOTAScriptInventorySlot_t) {
		return this.Owner?.MoveItem(this, slot)
	}
	public ItemFromStash() {
		return this.Owner?.ItemFromStash(this)
	}
	public SellItem() {
		return this.Owner?.SellItem(this)
	}
	public ItemLock() {
		return this.Owner?.ItemLock(this)
	}
	public ItemUnlock() {
		return this.Owner?.ItemLock(this, false)
	}

	public CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.IsValid || this.IsMuted)
			return false

		let root_owner = this.RootOwner
		if (root_owner instanceof Player && this.Shareability === EShareAbility.ITEM_NOT_SHAREABLE && root_owner.PlayerID !== this.PurchaserID)
			return false

		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && this.IsToggled)
			return false

		if (this.RequiresCharges && this.CurrentCharges < 1)
			return false

		return this.Level !== 0
			&& !this.Owner?.IsMuted
			&& this.IsManaEnough(bonusMana)
			&& this.IsCooldownReady
	}
}

import { RegisterClass, RegisterFieldHandler, ReplaceFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Item", Item)
RegisterFieldHandler(Item, "m_flEnableTime", (item, new_val) => item.EnableTime = new_val as number)
RegisterFieldHandler(Item, "m_iSharability", (item, new_val) => item.Shareability = new_val as EShareAbility)
RegisterFieldHandler(Item, "m_iCurrentCharges", (item, new_val) => item.CurrentCharges = new_val as number)
ReplaceFieldHandler(Item, "m_nAbilityCurrentCharges", () => { }) // override ability handler
RegisterFieldHandler(Item, "m_flAssembledTime", (item, new_val) => item.AssembledTime = new_val as number)
RegisterFieldHandler(Item, "m_bCanBeUsedOutOfInventory", (item, new_val) => item.CanBeUsedOutOfInventory = new_val as boolean)
RegisterFieldHandler(Item, "m_iInitialCharges", (item, new_val) => item.InitialCharges = new_val as number)
RegisterFieldHandler(Item, "m_bAlertable", (item, new_val) => item.IsAlertable = new_val as boolean)
RegisterFieldHandler(Item, "m_bCastOnPickup", (item, new_val) => item.IsCastedOnPickup = new_val as boolean)
RegisterFieldHandler(Item, "m_bCombinable", (item, new_val) => item.IsCombinable = new_val as boolean)
RegisterFieldHandler(Item, "m_bCombineLocked", (item, new_val) => item.IsCombineLocked = new_val as boolean)
RegisterFieldHandler(Item, "m_bDisassemblable", (item, new_val) => item.IsDisassemblable = new_val as boolean)
RegisterFieldHandler(Item, "m_bKillable", (item, new_val) => item.IsKillable = new_val as boolean)
RegisterFieldHandler(Item, "m_bPermanent", (item, new_val) => item.IsPermanent = new_val as boolean)
RegisterFieldHandler(Item, "m_bPurchasable", (item, new_val) => item.IsPurchasable = new_val as boolean)
RegisterFieldHandler(Item, "m_bPurchasedWhileDead", (item, new_val) => item.IsPurchasedWhileDead = new_val as boolean)
RegisterFieldHandler(Item, "m_bRecipe", (item, new_val) => item.IsRecipe = new_val as boolean)
RegisterFieldHandler(Item, "m_bRequiresCharges", (item, new_val) => item.RequiresCharges = new_val as boolean)
RegisterFieldHandler(Item, "m_bSellable", (item, new_val) => item.IsSellable = new_val as boolean)
RegisterFieldHandler(Item, "m_bStackable", (item, new_val) => item.IsStackable = new_val as boolean)
RegisterFieldHandler(Item, "m_iPlayerOwnerID", (item, new_val) => item.PurchaserID = new_val as number)
RegisterFieldHandler(Item, "m_flPurchaseTime", (item, new_val) => item.PurchaseTime = new_val as number)
RegisterFieldHandler(Item, "m_iSecondaryCharges", (item, new_val) => item.SecondaryCharges = new_val as number)
