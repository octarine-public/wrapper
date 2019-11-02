import EntityManager from "../../Managers/EntityManager"
import Game from "../../Objects/GameResources/GameRules"
import Ability from "./Ability"
import Entity from "./Entity"
import Player from "./Player"
import Unit from "./Unit"

export default class Item extends Ability {
	readonly m_pBaseEntity: C_DOTA_Item

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
	get CurrentCharges(): number {
		return this.m_pBaseEntity.m_iCurrentCharges
	}
	get EffectName(): string {
		return this.AbilityData.EffectName
	}
	get EnableTime(): number {
		return Math.max(this.m_pBaseEntity.m_flEnableTime - Game.RawGameTime, 0)
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
	get IsEnabled(): boolean {
		return this.m_pBaseEntity.m_bItemEnabled
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
		return EntityManager.EntityByIndex(this.PurchaserID) as Player
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
	get Shareability(): EShareAbility {
		return this.m_pBaseEntity.m_iSharability
	}
	get ShouldDisplayCharges(): boolean {
		return this.IsStackable || this.RequiresCharges || this.IsDisplayingCharges;
	}

	DisassembleItem(queue?: boolean) {
		return (this.Owner as Unit).DisassembleItem(this, queue)
	}
	MoveItem(slot: DOTAScriptInventorySlot_t) {
		return (this.Owner as Unit).MoveItem(this, slot)
	}
	ItemFromStash() {
		return (this.Owner as Unit).ItemFromStash(this)
	}
	SellItem() {
		return (this.Owner as Unit).SellItem(this)
	}
	ItemLock() {
		return (this.Owner as Unit).ItemLock(this)
	}
	ItemUnlock() {
		return (this.Owner as Unit).ItemLock(this, false)
	}

	CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.IsValid)
			return false

		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && this.IsToggled)
			return false

		if (this.RequiresCharges && this.CurrentCharges < 1)
			return false

		return this.Level > 0 && !this.IsEnabled
			&& !(this.Owner as Unit).IsMuted
			&& this.IsManaEnough(bonusMana)
			&& this.IsCooldownReady
	}
}
