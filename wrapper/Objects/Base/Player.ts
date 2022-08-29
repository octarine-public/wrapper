import Vector3 from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EShareAbility } from "../../Enums/EShareAbility"
import { LifeState_t } from "../../Enums/LifeState_t"
import { EPropertyType } from "../../Enums/PropertyType"
import { Team } from "../../Enums/Team"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import ExecuteOrder from "../../Native/ExecuteOrder"
import Entity from "./Entity"
import Hero from "./Hero"
import Item from "./Item"
import CPlayerResource, { PlayerResource } from "./PlayerResource"

@WrapperClass("CDOTAPlayerController")
export default class Player extends Entity {
	@NetworkedBasicField("m_nPlayerID", EPropertyType.INT32)
	public PlayerID = -1
	@NetworkedBasicField("m_quickBuyItems")
	public QuickBuyItems: number[] = []
	@NetworkedBasicField("m_iTotalEarnedGold")
	public TotalEarnedGold = 0
	@NetworkedBasicField("m_iTotalEarnedXP")
	public TotalEarnedXP = 0
	public Hero: Nullable<Hero>
	public Hero_ = 0
	public Pawn: Nullable<Entity>
	@NetworkedBasicField("m_hPawn", EPropertyType.INT32)
	public Pawn_ = -1

	public get IsSpectator(): boolean {
		return this.Team === Team.Observer || this.Team === Team.Neutral || this.Team === Team.None || this.Team === Team.Shop
	}
	public CannotUseItem(item: Item): boolean {
		return item.Shareability === EShareAbility.ITEM_NOT_SHAREABLE && this.PlayerID !== item.PurchaserID
	}
	public Buyback(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Buyback(queue, showEffects)
	}
	public Glyph(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Glyph(queue, showEffects)
	}
	public CastRiverPaint(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.CastRiverPaint(position, queue, showEffects)
	}
	public PreGameAdjustItemAssigment(ItemID: number, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.PreGameAdjustItemAssigment(ItemID, queue, showEffects)
	}
	public Scan(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Scan(position, queue, showEffects)
	}

	public async UpdateHero(playerResource: Nullable<CPlayerResource>): Promise<void> {
		const teamDataAr = playerResource?.PlayerTeamData
		if (teamDataAr === undefined)
			return
		const teamData = teamDataAr[this.PlayerID]
		this.Hero_ = teamData?.SelectedHeroIndex ?? this.Hero_
		const ent = EntityManager.EntityByIndex(this.Hero_)
		this.Hero = ent instanceof Hero
			? ent
			: undefined
		if (this.Hero !== undefined && teamData !== undefined)
			switch (this.Hero.LifeState) {
				case LifeState_t.LIFE_ALIVE:
					if (teamData.RespawnSeconds > 0) {
						this.Hero.LifeState = LifeState_t.LIFE_DEAD
						await EventsSDK.emit("LifeStateChanged", false, this.Hero)
					}
					break
				case LifeState_t.LIFE_DEAD:
					if (teamData.RespawnSeconds <= 0) {
						this.Hero.LifeState = LifeState_t.LIFE_ALIVE
						await EventsSDK.emit("LifeStateChanged", false, this.Hero)
					}
					break
				default:
					break
			}
	}
}
export const Players = EntityManager.GetEntitiesByClass(Player)

EventsSDK.on("PreEntityCreated", async ent => {
	if (ent instanceof Player) {
		await ent.UpdateHero(PlayerResource)
		return
	}
	for (const player of Players)
		if (ent.HandleMatches(player.Pawn_))
			player.Pawn = ent
	if (ent instanceof Hero && ent.CanBeMainHero)
		for (const player of Players)
			if (ent.HandleMatches(player.Hero_))
				await player.UpdateHero(PlayerResource)
})

EventsSDK.on("EntityDestroyed", async ent => {
	for (const player of Players)
		if (ent.HandleMatches(player.Pawn_))
			player.Pawn = undefined
	if (ent instanceof Hero)
		for (const player of Players)
			if (ent.HandleMatches(player.Hero_))
				await player.UpdateHero(PlayerResource)
})
