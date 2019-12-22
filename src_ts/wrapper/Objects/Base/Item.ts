import EntityManager from "../../Managers/EntityManager"
import Game from "../../Objects/GameResources/GameRules"
import Ability from "./Ability"
import Entity from "./Entity"
import Player from "./Player"
import Unit from "./Unit"

export default class Item extends Ability {
	public readonly m_pBaseEntity: C_DOTA_Item
	public EnableTime = 0
	public Shareability: EShareAbility = EShareAbility.ITEM_NOT_SHAREABLE
	public CurrentCharges = 0

	constructor(m_pBaseEntity: C_BaseEntity) {
		super(m_pBaseEntity)
		this.EnableTime = this.m_pBaseEntity.m_flEnableTime
		this.Shareability = this.m_pBaseEntity.m_iSharability
		this.CurrentCharges = this.m_pBaseEntity.m_iCurrentCharges
	}

	get IsReady(): boolean {
		const unit = this.Owner
		return this.IsCooldownReady && this.Level > 0 && (unit === undefined || (unit.Mana >= this.ManaCost && !unit.IsMuted))
	}
	get AssembledTime(): number {
		return this.m_pBaseEntity.m_flAssembledTime
	}
	get CanBeUsedOutOfInventory(): boolean {
		return this.m_pBaseEntity.m_bCanBeUsedOutOfInventory
	}
	get Cost(): number {
		return this.AbilityData.Cost
	}
	get EffectName(): string {
		return this.AbilityData.EffectName
	}
	get InitialCharges(): number {
		return this.m_pBaseEntity.m_iInitialCharges
	}
	get IsAlertable(): boolean {
		return this.m_pBaseEntity.m_bAlertable
	}
	get IsCastedOnPickup(): boolean {
		return this.m_pBaseEntity.m_bCastOnPickup
	}
	get IsCombinable(): boolean {
		return this.m_pBaseEntity.m_bCombinable
	}
	get IsCombineLocked(): boolean {
		return this.m_pBaseEntity.m_bCombineLocked
	}
	get IsDisassemblable(): boolean {
		return this.m_pBaseEntity.m_bDisassemblable
	}
	get IsDisplayingCharges(): boolean {
		return this.m_pBaseEntity.m_bDisplayCharges
	}
	get IsDroppable(): boolean {
		return this.m_pBaseEntity.m_bDroppable
	}
	get IsHidingCharges(): boolean {
		return this.m_pBaseEntity.m_bHideCharges
	}
	get IsKillable(): boolean {
		return this.m_pBaseEntity.m_bKillable
	}
	get IsPermanent(): boolean {
		return this.m_pBaseEntity.m_bPermanent
	}
	get IsPurchasable(): boolean {
		return this.m_pBaseEntity.m_bPurchasable
	}
	get IsPurchasedWhileDead(): boolean {
		return this.m_pBaseEntity.m_bPurchasedWhileDead
	}
	get IsRecipe(): boolean {
		return this.m_pBaseEntity.m_bRecipe
	}
	get RequiresCharges(): boolean {
		return this.m_pBaseEntity.m_bRequiresCharges
	}
	get IsSellable(): boolean {
		return this.m_pBaseEntity.m_bSellable
	}
	get IsStackable(): boolean {
		return this.m_pBaseEntity.m_bStackable
	}
	get ItemRecipeName(): string {
		return this.AbilityData.ItemRecipeName
	}
	get ModelName(): string {
		return this.AbilityData.ModelName
	}
	get OldOwner(): Entity {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hOldOwnerEntity) as Entity
	}
	get Purchaser(): Player {
		return EntityManager.GetPlayerByID(this.PurchaserID)
	}
	get PurchaserID(): number {
		return this.m_pBaseEntity.m_iPlayerOwnerID
	}
	get PurchaseTime(): number {
		return this.m_pBaseEntity.m_flPurchaseTime
	}
	get SecondaryCharges(): number {
		return this.m_pBaseEntity.m_iSecondaryCharges
	}
	get ShouldDisplayCharges(): boolean {
		return this.IsStackable || this.RequiresCharges || this.IsDisplayingCharges
	}

	public DisassembleItem(queue?: boolean) {
		return (this.Owner as Unit).DisassembleItem(this, queue)
	}
	public MoveItem(slot: DOTAScriptInventorySlot_t) {
		return (this.Owner as Unit).MoveItem(this, slot)
	}
	public ItemFromStash() {
		return (this.Owner as Unit).ItemFromStash(this)
	}
	public SellItem() {
		return (this.Owner as Unit).SellItem(this)
	}
	public ItemLock() {
		return (this.Owner as Unit).ItemLock(this)
	}
	public ItemUnlock() {
		return (this.Owner as Unit).ItemLock(this, false)
	}

	public CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.IsValid)
			return false
		if (this.EnableTime !== 0 && this.EnableTime > Game.RawGameTime)
			return false

		let root_owner = this.RootOwner
		if (root_owner !== undefined && this.Shareability == EShareAbility.ITEM_NOT_SHAREABLE && root_owner !== this.Purchaser)
			return false

		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && this.IsToggled)
			return false

		if (this.RequiresCharges && this.CurrentCharges < 1)
			return false

		return this.Level > 0
			&& !(this.Owner as Unit).IsMuted
			&& this.IsManaEnough(bonusMana)
			&& this.IsCooldownReady
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Item", Item)
