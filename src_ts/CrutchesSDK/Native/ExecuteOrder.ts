import Vector3 from "../Base/Vector3";
import EntityManager from "../Managers/EntityManager";
import Entity from "../Objects/Base/Entity";
import Unit from "../Objects/Base/Unit";
import Ability from "../Objects/Base/Ability";

export default class ExecuteOrder {

	static fromObject(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3,
		ability?: Ability,
		orderIssuer?: PlayerOrderIssuer_t,
		unit?: Unit,
		queue?: boolean,
		showEffects?: boolean
	}): ExecuteOrder {
		return new ExecuteOrder(
			order.orderType,
			order.target,
			order.position,
			order.ability,
			order.orderIssuer,
			order.unit,
			order.queue,
			order.showEffects
		);
	}
	
	static fromNative(order: CUnitOrder): ExecuteOrder {
		
		let unit = order.unit !== undefined
			? EntityManager.GetEntityByNative(order.unit) as Unit
			: EntityManager.LocalHero;
		
		if (unit === undefined)
			return undefined;
			
		return new ExecuteOrder(
			order.order_type,
			EntityManager.GetEntityByNative(order.target) as Entity,
			Vector3.fromIOBuffer(order.position !== undefined),
			EntityManager.GetEntityByNative(order.ability) as Ability,
			order.issuer,
			unit,
			order.queue,
			order.show_effects
		);
	}

	private m_OrderType: dotaunitorder_t
	private m_Target: Entity
	private m_Position: Vector3
	private m_Ability: Ability
	private m_OrderIssuer: PlayerOrderIssuer_t
	private m_Unit: Unit
	private m_Queue: boolean
	private m_ShowEffects: boolean

	constructor(
		orderType: dotaunitorder_t,
		target: Entity | number,
		position: Vector3 = new Vector3(),
		ability: Ability,
		issuer: PlayerOrderIssuer_t = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, 
		unit: Unit,
		queue: boolean = false,
		showEffects: boolean = false,
	) {
		this.m_OrderType = orderType;
		this.m_Target = target instanceof Entity ? target : EntityManager.EntityByIndex(target);
		this.m_Position = position;
		this.m_Ability = ability;
		this.m_OrderIssuer = issuer;
		this.m_Unit = unit;
		this.m_Queue = queue;
		this.m_ShowEffects = showEffects;
	}
	
	get OrderType(): dotaunitorder_t {
		return this.m_OrderType
	}
	get Target(): Entity {
		return this.m_Target
	}
	get Position(): Vector3 {
		return this.m_Position
	}
	get Ability(): Ability {
		return this.m_Ability
	}
	get OrderIssuer(): PlayerOrderIssuer_t {
		return this.m_OrderIssuer
	}
	get Unit(): Unit {
		return this.m_Unit
	}
	get Queue(): boolean {
		return this.m_Queue
	}
	get ShowEffects(): boolean {
		return this.m_ShowEffects
	}
	
	/**
	 * pass Position: Vector3 at IOBuffer offset 0
	 */
	toNative(): { 
		OrderType: dotaunitorder_t,
		Target: C_BaseEntity,
		Ability: C_DOTABaseAbility,
		OrderIssuer: PlayerOrderIssuer_t
		Unit: C_DOTA_BaseNPC,
		Queue: boolean,
		ShowEffects: boolean
	} {

		if (!this.m_Position.IsZero())
			this.m_Position.toIOBuffer();

		const target = this.m_Target,
			ability = this.m_Ability,
			unit = this.m_Unit;
			
		return {
			OrderType: this.m_OrderType,
			Target: target !== undefined ? target.m_pBaseEntity : undefined,
			Ability: ability !== undefined ? ability.m_pBaseEntity : undefined,
			OrderIssuer: this.m_OrderIssuer,
			Unit: unit !== undefined ? unit.m_pBaseEntity : undefined,
			Queue: this.m_Queue,
			ShowEffects: this.m_ShowEffects,
		}
	}
	/**
	 * Execute order with this fields
	 */
	ExecuteOrder(): ExecuteOrder {
		PrepareUnitOrders(this.toNative())
		return this
	}
}