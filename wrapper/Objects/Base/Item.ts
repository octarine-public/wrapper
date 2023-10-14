import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTAScriptInventorySlot } from "../../Enums/DOTAScriptInventorySlot"
import { EShareAbility } from "../../Enums/EShareAbility"
import { EPropertyType } from "../../Enums/PropertyType"
import { GameState } from "../../Utils/GameState"
import { Ability } from "./Ability"

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
	public IsCombineLocked = false
	@NetworkedBasicField("m_bDisassemblable")
	public IsDisassemblable = false
	@NetworkedBasicField("m_bKillable")
	public IsKillable = false
	@NetworkedBasicField("m_bPermanent")
	public IsPermanent = false
	@NetworkedBasicField("m_bPurchasable")
	public IsPurchasable = true
	@NetworkedBasicField("m_bPurchasedWhileDead")
	public IsPurchasedWhileDead = false
	@NetworkedBasicField("m_bRecipe")
	public IsRecipe = false
	@NetworkedBasicField("m_bRequiresCharges")
	public RequiresCharges = false
	@NetworkedBasicField("m_bSellable")
	public IsSellable = true
	@NetworkedBasicField("m_bStackable")
	public IsStackable = false
	@NetworkedBasicField("m_iPlayerOwnerID", EPropertyType.INT32)
	public PurchaserID = -1
	@NetworkedBasicField("m_flPurchaseTime")
	public PurchaseTime = 0
	@NetworkedBasicField("m_iSecondaryCharges")
	public SecondaryCharges = 0
	@NetworkedBasicField("m_bIsNeutralDrop")
	public IsNeutralDrop = false
	@NetworkedBasicField("m_iCurrentCharges")
	public ItemCurrentCharges = 0

	public get IsReady(): boolean {
		const unit = this.Owner
		return (
			this.IsCooldownReady &&
			this.Level !== 0 &&
			(unit === undefined || (unit.Mana >= this.ManaCost && !unit.IsMuted))
		)
	}
	/**
	 * Returns whether the item is usable.
	 *
	 * An item is considered usable if it is not muted or if the owner cannot use it.
	 * @description Check if the item is not muted or if the owner cannot use it
	 * @returns {boolean} Whether the item is usable.
	 */
	public get IsUsable(): boolean {
		return !this.IsMuted || (this.Owner?.CannotUseItem(this) ?? false)
	}
	/**
	 * Returns the remaining time for a sale.
	 *
	 * @returns {number} The remaining time for the sale.
	 */
	public get SaleRemainingTime(): number {
		return Math.max(GameState.RawGameTime - this.CreateTime + 10, 0)
	}
	public get IsMuted(): boolean {
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
