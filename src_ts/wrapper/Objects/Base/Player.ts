import { Team } from "../../Enums/Team"
import EntityManager from "../../Managers/EntityManager"
import Entity, { LocalPlayer, OnLocalPlayerDeleted } from "./Entity"
import Vector3 from "../../Base/Vector3"
import Vector2 from "../../Base/Vector2"
import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import Ability from "./Ability"
import Unit from "./Unit"
import ExecuteOrder from "../../Native/ExecuteOrder"
import Hero from "./Hero"
import { SetGameInProgress } from "../../Managers/EventsHandler"
import EventsSDK from "../../Managers/EventsSDK"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("C_DOTAPlayer")
export default class Player extends Entity {
	public static PrepareOrder(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3 | Vector2,
		ability?: Ability | number,
		orderIssuer?: PlayerOrderIssuer_t,
		issuers?: Unit[],
		queue?: boolean,
		showEffects?: boolean,
	}): ExecuteOrder {
		return ExecuteOrder.fromObject(order).ExecuteQueued()
	}
	public static Buyback(queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_BUYBACK, queue, showEffects })
	}
	public static Glyph(queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH, queue, showEffects })
	}
	public static CastRiverPaint(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RIVER_PAINT, position, queue, showEffects })
	}
	public static PreGameAdgustItemAssigment(ItemID: number, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PREGAME_ADJUST_ITEM_ASSIGNMENT, target: ItemID, queue, showEffects })
	}
	public static Scan(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_RADAR, position, queue, showEffects })
	}

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
		let hero = EntityManager.EntityByIndex(this.Hero_),
			// inadequate code because of circular dependency
			hero_constructor = (globalThis as any).GetEntityClassByName("Hero") as Constructor<Hero>
		if (hero instanceof hero_constructor)
			return hero
		let ent = (EntityManager.GetEntitiesByClass(hero_constructor) as Hero[]).find(hero =>
			hero.PlayerID === this.PlayerID
			&& !hero.IsIllusion
			&& !hero.IsTempestDouble
			// inadequate code because of circular dependency
			&& !(hero.constructor.name === "npc_dota_hero_meepo" && (hero as any).IsClone)
		)
		if (ent !== undefined)
			this.Hero_ = ent.Index
		return ent
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
