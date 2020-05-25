import { GameRules } from "../../Objects/Base/GameRules"
import Ability from "./Ability"
import Player from "./Player"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("C_DOTA_Item")
export default class Item extends Ability {
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
	@NetworkedBasicField("m_iPlayerOwnerID")
	public PurchaserID = -1
	@NetworkedBasicField("m_flPurchaseTime")
	public PurchaseTime = 0
	@NetworkedBasicField("m_iSecondaryCharges")
	public SecondaryCharges = 0
	@NetworkedBasicField("m_bIsNeutralDrop")
	public IsNeutral = false
	@NetworkedBasicField("m_iCurrentCharges")
	public CurrentCharges = 0

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
	public get GroundModelName(): string {
		return this.AbilityData.ModelName
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

import { ReplaceFieldHandler } from "wrapper/Objects/NativeToSDK"
ReplaceFieldHandler(Item, "m_nAbilityCurrentCharges", () => { }) // override ability handler
