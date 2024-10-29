import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import { EventPriority } from "../../Enums/EventPriority"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { windrunner_focusfire } from "../../Objects/Abilities/Windrunner/windrunner_focusfire"
import { Entity } from "../../Objects/Base/Entity"
import { Hero, Heroes } from "../../Objects/Base/Hero"
import { Modifier } from "../../Objects/Base/Modifier"
import { Unit } from "../../Objects/Base/Unit"
import { EventsSDK } from "../EventsSDK"

new (class CFocusFireChanged {
	constructor() {
		EventsSDK.on(
			"EntityDestroyed",
			entity => this.EntityDestroyed(entity),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"PrepareUnitOrders",
			order => this.PrepareUnitOrders(order),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"ModifierCreated",
			mod => this.ModifierCreated(mod),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"ModifierRemoved",
			mod => this.ModifierRemoved(mod),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"LifeStateChanged",
			entity => this.LifeStateChanged(entity),
			EventPriority.IMMEDIATE
		)
	}

	protected PrepareUnitOrders(order: ExecuteOrder) {
		if (order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET) {
			if (order.Ability_ instanceof windrunner_focusfire) {
				this.setTargetFocusFire(order.Issuers, order.Target)
			}
			// return
		}
		// TODO: add other orders & enemies any check events
		// switch (order.OrderType) {
		// 	case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
		// 		this.setTargetFocusFire(order.Issuers, order.Target)
		// 		break
		// 	case dotaunitorder_t.DOTA_UNIT_ORDER_STOP:
		// 	case dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE:
		// 	case dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION:
		// 	case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
		// 		this.setTargetFocusFire(order.Issuers)
		// 		break
		// }
	}

	protected ModifierCreated(mod: Modifier) {
		if (this.isValidModifier(mod.Caster, mod.Name)) {
			mod.Caster.FocusFireActive = true
		}
	}

	protected ModifierRemoved(mod: Modifier) {
		if (this.isValidModifier(mod.Caster, mod.Name)) {
			this.invalidateFocusFire(mod.Caster)
		}
	}

	protected EntityDestroyed(entity: Entity) {
		if (!(entity instanceof Unit)) {
			return
		}
		for (let i = Heroes.length - 1; i > -1; i--) {
			const hero = Heroes[i],
				target = hero.FocusFireTarget
			if (target === undefined) {
				continue
			}
			if (target === entity) {
				this.invalidateFocusFire(hero)
			}
		}
	}

	protected LifeStateChanged(entity: Entity) {
		if (!(entity instanceof Unit) || entity.IsAlive) {
			return
		}
		for (let i = Heroes.length - 1; i > -1; i--) {
			const hero = Heroes[i],
				target = hero.FocusFireTarget
			if (target === undefined) {
				continue
			}
			if (target === entity) {
				this.invalidateFocusFire(hero)
			}
		}
	}

	private isValidModifier(caster: Nullable<Unit>, name: string): caster is Hero {
		return name === "modifier_windrunner_focusfire" && caster instanceof Hero
	}

	private invalidateFocusFire(hero: Hero) {
		hero.FocusFireActive = false
		hero.FocusFireTargetIndex_ = -1
	}

	private setTargetFocusFire(arr: Unit[], target?: Nullable<Entity | number>) {
		const targetIndex = target instanceof Entity ? target.Index : target
		for (let i = arr.length - 1; i > -1; i--) {
			const issuer = arr[i]
			if (!(issuer instanceof Hero) || !issuer.IsAlive) {
				continue
			}
			if (!issuer.FocusFireActive) {
				issuer.FocusFireTargetIndex_ =
					targetIndex === undefined ? -1 : targetIndex
			}
		}
	}
})()
