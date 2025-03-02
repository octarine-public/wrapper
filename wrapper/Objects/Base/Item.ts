import { GetItemTexture } from "../../Data/ImageData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTAScriptInventorySlot } from "../../Enums/DOTAScriptInventorySlot"
import { EShareAbility } from "../../Enums/EShareAbility"
import { Team } from "../../Enums/Team"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { GameState } from "../../Utils/GameState"
import { Ability } from "./Ability"

@WrapperClass("CDOTA_Item")
export class Item extends Ability {
	@NetworkedBasicField("m_flEnableTime")
	public readonly EnableTime: number = 0
	@NetworkedBasicField("m_iSharability")
	public readonly Shareability: EShareAbility = EShareAbility.ITEM_NOT_SHAREABLE
	@NetworkedBasicField("m_bDroppable")
	public readonly IsDroppable: boolean = true
	@NetworkedBasicField("m_flAssembledTime")
	public readonly AssembledTime: number = 0
	@NetworkedBasicField("m_bCanBeUsedOutOfInventory")
	public readonly CanBeUsedOutOfInventory: boolean = false
	@NetworkedBasicField("m_iInitialCharges")
	public readonly InitialCharges: number = 0
	@NetworkedBasicField("m_bAlertable")
	public readonly IsAlertable: boolean = true
	@NetworkedBasicField("m_bCastOnPickup")
	public readonly IsCastedOnPickup: boolean = false
	@NetworkedBasicField("m_bCombinable")
	public readonly IsCombinable: boolean = true
	@NetworkedBasicField("m_bCombineLocked")
	public readonly IsCombineLocked: boolean = false
	@NetworkedBasicField("m_bDisassemblable")
	public readonly IsDisassemblable: boolean = false
	@NetworkedBasicField("m_bKillable")
	public readonly IsKillable: boolean = false
	@NetworkedBasicField("m_bPermanent")
	public readonly IsPermanent: boolean = false
	@NetworkedBasicField("m_bPurchasable")
	public readonly IsPurchasable: boolean = true
	@NetworkedBasicField("m_bPurchasedWhileDead")
	public readonly IsPurchasedWhileDead: boolean = false
	@NetworkedBasicField("m_bRecipe")
	public readonly IsRecipe: boolean = false
	@NetworkedBasicField("m_bRequiresCharges")
	public readonly RequiresCharges: boolean = false
	@NetworkedBasicField("m_bSellable")
	public readonly IsSellable: boolean = true
	@NetworkedBasicField("m_bStackable")
	public readonly IsStackable: boolean = false
	@NetworkedBasicField("m_iPlayerOwnerID")
	public readonly PlayerOwnerID: number = -1
	@NetworkedBasicField("m_flPurchaseTime")
	public readonly PurchaseTime: number = 0
	@NetworkedBasicField("m_iSecondaryCharges")
	public readonly SecondaryCharges: number = 0
	@NetworkedBasicField("m_iStackableMax")
	public readonly StackableMax: number = 0
	@NetworkedBasicField("m_bIsNeutralActiveDrop")
	public readonly IsNeutralActiveDrop: boolean = false
	@NetworkedBasicField("m_bIsNeutralPassiveDrop")
	public readonly IsNeutralPassiveDrop: boolean = false
	@NetworkedBasicField("m_bMarkForSell")
	public readonly MarkForSell: boolean = false
	@NetworkedBasicField("m_nNeutralDropTeam")
	public readonly NeutralDropTeam: Team = Team.None
	/** @readonly */
	public ItemSlot = DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1
	@NetworkedBasicField("m_iCurrentCharges")
	private itemCurrentCharges: number = 0

	/** @deprecated use IsNeutralActiveDrop */
	public get IsNeutralDrop() {
		return this.IsNeutralActiveDrop
	}
	public get Purchaser() {
		return PlayerCustomData.get(this.PlayerOwnerID)?.Hero
	}
	public get TexturePath(): string {
		return GetItemTexture(this.Name)
	}
	public get Cooldown() {
		return this.EnableTime > GameState.RawGameTime
			? Math.max(super.Cooldown, this.EnableTime - GameState.RawGameTime)
			: super.Cooldown
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
		return this.CanUseByInventory(owner.CanUseBackpack)
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
	public get CurrentCharges() {
		return this.itemCurrentCharges
	}
	public set CurrentCharges(newVal: number) {
		this.itemCurrentCharges = newVal
	}
	public get CanMoveInBackpack(): boolean {
		return this.AbilityData.AllowedInBackpack
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
	/**
	 * TODO: need improve
	 * Owner.CanBeCastedWhileChanneling, IsImmediateCasting
	 * Owner.CanBeCastedWhileStunned, CanBeCastedWhileRooted,
	 * Owner.CanBeCastedWhileSilenced
	 */
	public CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.CanBeUsable) {
			return false
		}
		const rootOwner = this.RootOwner
		if (rootOwner?.CannotUseItem(this)) {
			return false
		}
		// TODO: need improve
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

	private CanUseByInventory(includeBackpack = false): boolean {
		return (
			(this.ItemSlot >= DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1 &&
				this.ItemSlot <= DOTAScriptInventorySlot.DOTA_ITEM_SLOT_6) ||
			this.ItemSlot === DOTAScriptInventorySlot.DOTA_ITEM_TP_SCROLL ||
			this.ItemSlot === DOTAScriptInventorySlot.DOTA_ITEM_NEUTRAL_SLOT ||
			(includeBackpack &&
				this.ItemSlot >= DOTAScriptInventorySlot.DOTA_ITEM_SLOT_7 &&
				this.ItemSlot <= DOTAScriptInventorySlot.DOTA_ITEM_SLOT_9)
		)
	}
}
