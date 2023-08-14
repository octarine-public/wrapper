import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EShareAbility } from "../../Enums/EShareAbility"
import { EPropertyType } from "../../Enums/PropertyType"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Entity } from "./Entity"
import { Hero } from "./Hero"
import { Item } from "./Item"
import { CPlayerResource, PlayerResource } from "./PlayerResource"

@WrapperClass("CDOTAPlayerController")
export class Player extends Entity {
	@NetworkedBasicField("m_steamID")
	public SteamID64 = -1n
	@NetworkedBasicField("m_nPlayerID", EPropertyType.INT32)
	public PlayerID = -1
	public QuickBuyItems: number[] = []
	@NetworkedBasicField("m_iTotalEarnedGold")
	public TotalEarnedGold = 0
	@NetworkedBasicField("m_iTotalEarnedXP")
	public TotalEarnedXP = 0
	public Hero: Nullable<Hero>
	public Hero_ = 0
	public Pawn: Nullable<Entity>
	@NetworkedBasicField("m_hPawn", EPropertyType.UINT32)
	public Pawn_ = -1

	public get IsSpectator(): boolean {
		return (
			this.Team === Team.Observer ||
			this.Team === Team.Neutral ||
			this.Team === Team.None ||
			this.Team === Team.Shop
		)
	}
	public CannotUseItem(item: Item): boolean {
		return (
			item.Shareability === EShareAbility.ITEM_NOT_SHAREABLE &&
			this.PlayerID !== item.PurchaserID
		)
	}
	public Buyback(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Buyback(queue, showEffects)
	}
	public Glyph(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Glyph(queue, showEffects)
	}
	public CastRiverPaint(
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	): void {
		return ExecuteOrder.CastRiverPaint(position, queue, showEffects)
	}
	public PreGameAdjustItemAssigment(
		itemID: number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		return ExecuteOrder.PreGameAdjustItemAssigment(itemID, queue, showEffects)
	}
	public Scan(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Scan(position, queue, showEffects)
	}

	public UpdateHero(playerResource: Nullable<CPlayerResource>): void {
		const teamDataAr = playerResource?.PlayerTeamData
		if (teamDataAr === undefined) return
		this.Hero_ = teamDataAr[this.PlayerID]?.SelectedHeroIndex ?? this.Hero_
		const ent = EntityManager.EntityByIndex(this.Hero_)
		this.Hero = ent instanceof Hero ? ent : undefined
	}
}
RegisterFieldHandler(Player, "m_quickBuyItems", (player, newVal) => {
	player.QuickBuyItems = (newVal as bigint[]).map(val => Number(val >> 1n))
})

export const Players = EntityManager.GetEntitiesByClass(Player)

EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof Player) {
		ent.UpdateHero(PlayerResource)
		return
	}
	for (const player of Players)
		if (ent.HandleMatches(player.Pawn_)) player.Pawn = ent
	if (ent instanceof Hero && ent.CanBeMainHero)
		for (const player of Players)
			if (ent.HandleMatches(player.Hero_)) player.Hero = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	for (const player of Players)
		if (ent.HandleMatches(player.Pawn_)) player.Pawn = undefined
	if (ent instanceof Hero)
		for (const player of Players)
			if (ent.HandleMatches(player.Hero_)) player.Hero = undefined
})

EventsSDK.on("PlayerResourceUpdated", playerResource => {
	for (const player of Players) player.UpdateHero(playerResource)
})
