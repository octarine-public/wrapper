import { GetItemTexture } from "../../Data/ImageData"
import { NetworkedBasicField, ReencodeProperty, WrapperClass } from "../../Decorators"
import { DOTAScriptInventorySlot } from "../../Enums/DOTAScriptInventorySlot"
import { EShareAbility } from "../../Enums/EShareAbility"
import { EPropertyType } from "../../Enums/PropertyType"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { GameState } from "../../Utils/GameState"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Ability } from "./Ability"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_Item")
export class Item extends Ability {
	@NetworkedBasicField("m_flEnableTime")
	public EnableTime = 0
	@NetworkedBasicField("m_iSharability")
	public Shareability = EShareAbility.ITEM_NOT_SHAREABLE
	@NetworkedBasicField("m_bDroppable")
	public IsDroppable = true
	@NetworkedBasicField("m_flAssembledTime")
	public AssembledTime = 0
	@NetworkedBasicField("m_bCanBeUsedOutOfInventory")
	public CanBeUsedOutOfInventory = false
	@NetworkedBasicField("m_iInitialCharges")
	public InitialCharges = 0
	@NetworkedBasicField("m_bAlertable")
	public IsAlertable = true
	@NetworkedBasicField("m_bCastOnPickup")
	public IsCastedOnPickup = false
	@NetworkedBasicField("m_bCombinable")
	public IsCombinable = true
	@NetworkedBasicField("m_bCombineLocked")
	public IsCombineLocked: boolean = false
	@NetworkedBasicField("m_bDisassemblable")
	public IsDisassemblable: boolean = false
	@NetworkedBasicField("m_bKillable")
	public IsKillable = false
	@NetworkedBasicField("m_bPermanent")
	public IsPermanent: boolean = false
	@NetworkedBasicField("m_bPurchasable")
	public IsPurchasable: boolean = true
	@NetworkedBasicField("m_bPurchasedWhileDead")
	public IsPurchasedWhileDead: boolean = false
	@NetworkedBasicField("m_bRecipe")
	public IsRecipe: boolean = false
	@NetworkedBasicField("m_bRequiresCharges")
	public RequiresCharges: boolean = false
	@NetworkedBasicField("m_bSellable")
	public IsSellable: boolean = true
	@NetworkedBasicField("m_bStackable")
	public IsStackable: boolean = false
	public PlayerOwnerID: number = -1
	/**
	 * @description Returns the player owner ID of the item.
	 * @deprecated Use Item#PlayerOwnerID
	 */
	public PurchaserID: number = -1
	@NetworkedBasicField("m_flPurchaseTime")
	public PurchaseTime: number = 0
	@NetworkedBasicField("m_iSecondaryCharges")
	public SecondaryCharges: number = 0
	@NetworkedBasicField("m_bIsNeutralDrop")
	public IsNeutralDrop: boolean = false
	@NetworkedBasicField("m_iCurrentCharges")
	public ItemCurrentCharges: number = 0

	/**
	 * @description The slot the item is in
	 */
	public ItemSlot = DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1
	/**
	 * @description The purchaser of the item.
	 */
	public Purchaser: Nullable<Unit>

	public get TexturePath(): string {
		return GetItemTexture(this.Name)
	}
	public get Cooldown() {
		let cooldown = super.Cooldown
		if (this.IsItem && this.EnableTime > GameState.RawGameTime) {
			cooldown = Math.max(cooldown, this.EnableTime - GameState.RawGameTime)
		}
		return cooldown
	}
	public get IsReady(): boolean {
		const unit = this.Owner
		return (
			this.IsCooldownReady &&
			this.Level !== 0 &&
			(unit === undefined || (unit.Mana >= this.ManaCost && !unit.IsMuted))
		)
	}
	public get CanBeUsable(): boolean {
		if (!this.IsValid || this.IsMuted) {
			return false
		}
		const owner = this.Owner
		if (owner === undefined || !owner.IsValid) {
			return false
		}
		if (owner.CannotUseItem(this)) {
			return false
		}
		return owner.Inventory.HasAnyItemInventory
	}
	public get SaleRemainingTime(): number {
		// Maximum duration of the sale in seconds
		const maxSaleDuration = 10
		// Calculate the remaining time by subtracting the create time
		// from the current game time and adding the maximum sale duration
		const remainingTime = this.CreateTime + maxSaleDuration - GameState.RawGameTime
		// Return the remaining time if it is positive, otherwise return 0
		return Math.ceil(Math.max(remainingTime, 0))
	}
	public get IsMuted(): boolean {
		// Check if the enable time is set and if it is greater than the current game time
		return this.EnableTime !== 0 && this.EnableTime > GameState.RawGameTime
	}
	public get Cost(): number {
		return this.AbilityData.Cost
	}
	public get EffectName(): string {
		return this.AbilityData.EffectName
	}
	public get IsDisplayingCharges(): boolean {
		return this.AbilityData.ItemDisplayCharges
	}
	public get IsHidingCharges(): boolean {
		return this.AbilityData.ItemHideCharges
	}
	public get GroundModelName(): string {
		return this.AbilityData.ModelName
	}
	public get ShouldDisplayCharges(): boolean {
		return this.IsStackable || this.RequiresCharges || this.IsDisplayingCharges
	}
	public get SpellAmplification(): number {
		return this.GetSpecialValue("spell_amp") / 100
	}
	public get CurrentCharges() {
		return this.ItemCurrentCharges
	}
	public set CurrentCharges(newVal: number) {
		this.ItemCurrentCharges = newVal
	}
	public DisassembleItem(queue?: boolean) {
		return this.Owner?.DisassembleItem(this, queue)
	}
	public MoveItem(slot: DOTAScriptInventorySlot) {
		return this.Owner?.MoveItem(this, slot)
	}
	public DropAtFountain() {
		return this.Owner?.DropItemAtFountain(this)
	}
	public EjectFromStash() {
		return this.Owner?.EjectItemFromStash(this)
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
	// public CanBeCasted(bonusMana: number = 0): boolean {
	// 	if (!this.CanBeUsable || !this.IsReady) {
	// 		return false
	// 	}
	// 	// TODO: Add other checks
	// 	return this.IsManaEnough(bonusMana)
	// }
	public CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.IsValid || this.IsMuted) {
			return false
		}

		const rootOwner = this.RootOwner
		if (rootOwner?.CannotUseItem(this)) {
			return false
		}

		if (this.RequiresCharges && this.CurrentCharges < 1) {
			return false
		}

		return (
			this.Level !== 0 &&
			!this.Owner?.IsMuted &&
			this.IsManaEnough(bonusMana) &&
			this.IsCooldownReady
		)
	}
}

RegisterFieldHandler(Item, "m_iPlayerOwnerID", (item, newVal) => {
	item.PlayerOwnerID = ReencodeProperty(newVal, EPropertyType.INT32) as number
	item.PurchaserID = item.PlayerOwnerID
	item.Purchaser = PlayerCustomData.get(item.PlayerOwnerID)?.Hero
})
