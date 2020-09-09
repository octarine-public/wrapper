import { Team } from "../../Enums/Team"
import EntityManager from "../../Managers/EntityManager"
import Entity, { LocalPlayer, OnLocalPlayerDeleted } from "./Entity"
import Hero from "./Hero"
import { SetGameInProgress } from "../../Managers/EventsHandler"
import EventsSDK from "../../Managers/EventsSDK"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"
import Item from "./Item"
import ExecuteOrder from "../../Native/ExecuteOrder"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"

@WrapperClass("C_DOTAPlayer")
export default class Player extends Entity {
	@NetworkedBasicField("m_iPlayerID")
	public PlayerID: number = -1
	@NetworkedBasicField("m_quickBuyItems")
	public QuickBuyItems: number[] = []
	@NetworkedBasicField("m_iTotalEarnedGold")
	public TotalEarnedGold = 0
	@NetworkedBasicField("m_iTotalEarnedXP")
	public TotalEarnedXP = 0
	public Hero_ = 0

	public get IsSpectator(): boolean {
		return this.Team === Team.Observer || this.Team === Team.Neutral || this.Team === Team.None || this.Team === Team.Undefined
	}
	public get Hero(): Nullable<Hero> {
		let hero = EntityManager.EntityByIndex(this.Hero_)
		if (hero instanceof Hero)
			return hero
		let ent = EntityManager.GetEntitiesByClass(Hero).find(hero =>
			hero.PlayerID === this.PlayerID
			&& hero.CanBeMainHero
		)
		if (ent !== undefined)
			this.Hero_ = ent.Index
		return ent
	}
	public CannotUseItem(item: Item): boolean {
		return item.Shareability === EShareAbility.ITEM_NOT_SHAREABLE && this.PlayerID !== item.PurchaserID
	}
	public Buyback(queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.Buyback(queue, showEffects)
	}
	public Glyph(queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.Glyph(queue, showEffects)
	}
	public CastRiverPaint(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.CastRiverPaint(position, queue, showEffects)
	}
	public PreGameAdjustItemAssigment(ItemID: number, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.PreGameAdjustItemAssigment(ItemID, queue, showEffects)
	}
	public Scan(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.Scan(position, queue, showEffects)
	}
}

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(Player, "m_hAssignedHero", (player, new_value) => {
	player.Hero_ = new_value as number
	if (player === LocalPlayer && player.Hero !== undefined)
		SetGameInProgress(true)
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent === LocalPlayer) {
		OnLocalPlayerDeleted()
		SetGameInProgress(false)
	}
})

let userid2team = new Map<number, number>()
function TriggerPlayerTeamChanged(player: Player, team: number): void {
	let old_team = player.Team
	if (old_team !== team) {
		player.Team = team
		EventsSDK.emit("EntityTeamChanged", false, player)
	}
}
EventsSDK.on("GameEvent", (name, obj) => {
	if (name === "player_team")
		userid2team.set(obj.userid, obj.team)
	if (name === "player_connect_full") {
		let ent = EntityManager.EntityByIndex(obj.index + 1)
		if (ent instanceof Player) {
			ent.PlayerID = obj.PlayerID
			if (userid2team.has(obj.userid))
				TriggerPlayerTeamChanged(ent, userid2team.get(obj.userid)!)
		}
	}
})
