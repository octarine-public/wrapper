import { Color } from "../../Base/Color"
import { Vector3 } from "../../Base/Vector3"
import { ReencodeProperty, WrapperClass } from "../../Decorators"
import { EShareAbility } from "../../Enums/EShareAbility"
import { EPropertyType } from "../../Enums/PropertyType"
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
	/**
	 * @redonly
	 * @description The Hero of the player.
	 * @returns {Hero | undefined}
	 */
	public Hero: Nullable<Hero>
	/**
	 * @redonly
	 * @description The PlayerPawn of the player.
	 * @returns {PlayerPawn | undefined}
	 */
	public Pawn: Nullable<PlayerPawn>
	/**
	 * @redonly
	 * @description Selected the quick buy items(ItemID) of the player
	 * @returns {Array<number>}
	 */
	public QuickBuyItems: number[] = []
	/**
	 * @ignore
	 * @internal
	 * @description The HeroHandle of the player (internal only for wrapper)
	 * @return {number}
	 */
	public hero_ = -1
	/**
	 * @ignore
	 * @internal
	 * @description The PawnHandle of the player (internal only for wrapper)
	 * @return {number}
	 */
	public pawn_ = -1
	/**
	 * @ignore
	 * @internal
	 * @description The PlayerID of the player (internal only for wrapper)
	 * @return {number}
	 */
	public playerID_ = -1
	/**
	 * @description Determines if the player is a spectator.
	 * @return {boolean}
	 */
	public get IsSpectator(): boolean {
		return (
			this.Team === Team.Observer ||
			this.Team === Team.Neutral ||
			this.Team === Team.None ||
			this.Team === Team.Shop
		)
	}
	/**
	 * @description Get the steamID of the player.
	 * @returns {bigint | undefined}
	 */
	public get SteamID(): Nullable<bigint> {
		return this.PlayerCustomData?.SteamID
	}
	/**
	 * @description Get the name of the player.
	 * @returns {string | undefined}
	 */
	public get PlayerName(): Nullable<string> {
		return this.PlayerCustomData?.PlayerName
	}
	/**
	 * @description Checks if the instance is the local player.
	 * @returns {boolean}
	 */
	public get IsLocalPlayer(): boolean {
		return this === LocalPlayer
	}
	/**
	 * @description Get the playerID of the player.
	 * @returns {number | -1}
	 */
	public get PlayerID(): number {
		return this.Hero?.PlayerID ?? this.playerID_
	}
	/**
	 * Get the custom data for a player.
	 * @returns {PlayerCustomData | undefined} The custom data for the player.
	 */
	public get PlayerCustomData(): Nullable<PlayerCustomData> {
		return PlayerCustomData.get(this.PlayerID)
	}
	/**
	 * Retrieves the team slot of the hero.
	 * @description The team slot of the hero. If the hero's team data is not available, return -1.
	 * @returns {number}
	 */
	public get TeamSlot(): number {
		return this.PlayerCustomData?.TeamSlot ?? -1
	}
	/**
	 * The color of the hero.
	 * @description Returns the color of the hero based on their team.
	 * @returns {Color}
	 */
	public get PlayerColor(): Color {
		return this.PlayerCustomData?.Color ?? Color.Red
	}
	/**
	 * @description Gets the name of the hero.
	 * @returns {string | undefined}
	 */
	public get HeroName(): Nullable<string> {
		return (
			this.Hero?.Name ??
			UnitData.GetHeroNameByID(this.PlayerCustomData?.SelectedHeroID ?? -1)
		)
	}
	/**
	 * @description Gets the respawn position for the hero.
	 * @returns {Vector3 | undefined}
	 */
	public get RespawnPosition(): Nullable<Vector3> {
		return PlayerResource?.RespawnPositions[this.PlayerID]
	}
	/**
	 * @description Checks if the player cannot use the given item.
	 * @param {Item} item - The item to be checked.
	 * @return {boolean}
	 */
	public CannotUseItem(item: Item): boolean {
		return (
			item.Shareability === EShareAbility.ITEM_NOT_SHAREABLE &&
			this.PlayerID !== item.PlayerOwnerID
		)
	}
	/**
	 * @description Executes a buyback action (call ExecuteOrder.PrepareOrder({...})).
	 * @param {boolean} queue - Optional parameter to indicate if the buyback action should be queued.
	 * @param {boolean} showEffects - Optional parameter to indicate if the buyback effects should be shown.
	 * @return {void} This function does not return a value.
	 */
	public Buyback(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Buyback(queue, showEffects)
	}
	/**
	 * @description Executes a glyph action (call ExecuteOrder.PrepareOrder({...})).
	 * @param {boolean} queue - Optional parameter to indicate if the glyph action should be queued.
	 * @param {boolean} showEffects - Optional parameter to indicate if the glyph effects should be shown.
	 * @return {void}
	 */
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
	/**
	 * Scans the specified position.
	 * @description Executes a scan action (call ExecuteOrder.PrepareOrder({...})).
	 * @param {Vector3} position - The position to scan.
	 * @param {boolean} queue - Optional parameter to indicate if the scan action should be queued.
	 * @param {boolean} showEffects - Optional parameter to indicate if the scan effects should be shown.
	 * @return {void}
	 */
	public Scan(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.Scan(position, queue, showEffects)
	}
	/**
	 * @ignore
	 * @internal
	 * @description UpdateProperties for Hero and PlayerPawn (internal only for wrapper)
	 * @param {number} entity - Hero or PlayerPawn
	 * @return {void}
	 */
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

/**
 * @ignore
 * @internal
 */
RegisterFieldHandler(Player, "m_quickBuyItems", (player, newVal) => {
	player.QuickBuyItems = (newVal as bigint[]).map(val => Number(val >> 1n))
})
/**
 * @ignore
 * @internal
 */
RegisterFieldHandler(Player, "m_nPlayerID", (player, newVal) => {
	player.playerID_ = ReencodeProperty(newVal, EPropertyType.INT32) as number
	PlayerCustomData.set(player.PlayerID)
})
/**
 * @ignore
 * @internal
 */
RegisterFieldHandler(Player, "m_hPawn", (player, newVal) => {
	player.pawn_ = ReencodeProperty(newVal, EPropertyType.UINT32) as number
	player.UpdateProperties(EntityManager.EntityByIndex<PlayerPawn>(player.pawn_))
})
/**
 * @ignore
 * @internal
 */
RegisterFieldHandler(Player, "m_hAssignedHero", (player, newVal) => {
	player.hero_ = newVal as number
	player.UpdateProperties(EntityManager.EntityByIndex<Hero>(player.hero_))
})

export const Players = EntityManager.GetEntitiesByClass(Player)
