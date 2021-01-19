import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Team } from "../../Enums/Team"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import ExecuteOrder from "../../Native/ExecuteOrder"
import Entity from "./Entity"
import Hero from "./Hero"
import Item from "./Item"

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
	public Hero: Nullable<Hero> = undefined
	public Hero_ = 0

	public get IsSpectator(): boolean {
		return this.Team === Team.Observer || this.Team === Team.Neutral || this.Team === Team.None || this.Team === Team.Undefined
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

import { RegisterFieldHandler } from "../NativeToSDK"
RegisterFieldHandler(Player, "m_hAssignedHero", (player, new_value) => {
	player.Hero_ = (new_value as number) & 0x3FFF
	const ent = EntityManager.EntityByIndex(player.Hero_)
	player.Hero = ent instanceof Hero ? ent : undefined
})

EventsSDK.on("EntityCreated", ent => {
	if (!(ent instanceof Hero) || !ent.CanBeMainHero)
		return
	EntityManager.GetEntitiesByClass(Player).forEach(player => {
		if (ent.Index === player.Hero_)
			player.Hero = ent
	})
})

EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Hero))
		return
	EntityManager.GetEntitiesByClass(Player).forEach(player => {
		if (player.Hero === ent)
			player.Hero = undefined
	})
})
