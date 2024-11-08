import { Color } from "../../Base/Color"
import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { EShareAbility } from "../../Enums/EShareAbility"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { PlayerCustomData } from "../DataBook/PlayerCustomData"
import { UnitData } from "../DataBook/UnitData"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Entity, LocalPlayer } from "./Entity"
import { Hero } from "./Hero"
import { Item } from "./Item"
import { PlayerPawn } from "./PlayerPawn"
import { PlayerResource } from "./PlayerResource"

@WrapperClass("CDOTAPlayerController")
export class Player extends Entity {
	public Hero: Nullable<Hero>
	public Pawn: Nullable<PlayerPawn>
	public QuickBuyItems: number[] = []
	public hero_ = -1
	public pawn_ = -1
	public playerID_ = -1

	public get IsSpectator(): boolean {
		return (
			this.Team === Team.Observer ||
			this.Team === Team.Neutral ||
			this.Team === Team.None ||
			this.Team === Team.Shop
		)
	}
	public get SteamID(): Nullable<bigint> {
		return this.PlayerCustomData?.SteamID
	}
	public get PlayerName(): Nullable<string> {
		return this.PlayerCustomData?.PlayerName
	}
	public get IsLocalPlayer(): boolean {
		return this === LocalPlayer
	}
	public get PlayerID(): number {
		return this.Hero?.PlayerID ?? this.playerID_
	}
	public get PlayerCustomData(): Nullable<PlayerCustomData> {
		return PlayerCustomData.get(this.PlayerID)
	}
	public get TeamSlot(): number {
		return this.PlayerCustomData?.TeamSlot ?? 0
	}
	public get PlayerColor(): Color {
		return this.PlayerCustomData?.Color ?? Color.Red
	}
	public get HeroName(): Nullable<string> {
		return (
			this.Hero?.Name ??
			UnitData.GetHeroNameByID(this.PlayerCustomData?.SelectedHeroID ?? 0)
		)
	}
	public get RespawnPosition(): Nullable<Vector3> {
		return PlayerResource?.RespawnPositions[this.PlayerID]
	}
	public CannotUseItem(item: Item): boolean {
		return (
			item.Shareability === EShareAbility.ITEM_NOT_SHAREABLE &&
			this.PlayerID !== item.PlayerOwnerID
		)
	}
	public Buyback(queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.Buyback(queue, showEffects)
	}
	public Glyph(queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.Glyph(queue, showEffects)
	}

	public CastRiverPaint(
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.CastRiverPaint(position, queue, showEffects)
	}

	public PreGameAdjustItemAssigment(
		itemID: number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PreGameAdjustItemAssigment(itemID, queue, showEffects)
	}
	public Scan(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.Scan(position, queue, showEffects)
	}
	public UpdateProperties(entity: Nullable<Hero | PlayerPawn>): void {
		if (entity instanceof Hero) {
			if (entity.HandleMatches(this.hero_)) {
				this.Hero = !entity.IsValid ? undefined : entity
				PlayerCustomData.set(this.PlayerID, entity)
			}
		}
		if (entity instanceof PlayerPawn) {
			if (entity.HandleMatches(this.pawn_)) {
				this.Pawn = !entity.IsValid ? undefined : entity
			}
		}
	}
}
RegisterFieldHandler(Player, "m_quickBuyItems", (player, newVal) => {
	player.QuickBuyItems = (newVal as bigint[]).map(val => Number(val) >> 1)
})
RegisterFieldHandler(Player, "m_nPlayerID", (player, newVal) => {
	player.playerID_ = newVal as number
	PlayerCustomData.set(player.PlayerID)
})
RegisterFieldHandler(Player, "m_hPawn", (player, newVal) => {
	player.pawn_ = newVal as number
	player.UpdateProperties(EntityManager.EntityByIndex<PlayerPawn>(player.pawn_))
})
RegisterFieldHandler(Player, "m_hAssignedHero", (player, newVal) => {
	player.hero_ = newVal as number
	player.UpdateProperties(EntityManager.EntityByIndex<Hero>(player.hero_))
})
export const Players = EntityManager.GetEntitiesByClass(Player)
