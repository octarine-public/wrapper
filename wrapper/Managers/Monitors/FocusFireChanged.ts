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
		if (order.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) {
			return
		}
		if (!(order.Ability_ instanceof windrunner_focusfire)) {
			return
		}
		const orderTarget = order.Target
		if (orderTarget === undefined) {
			return
		}
		const target = orderTarget instanceof Entity ? orderTarget.Index : orderTarget
		for (let i = order.Issuers.length - 1; i > -1; i--) {
			const issuer = order.Issuers[i]
			if (!(issuer instanceof Hero)) {
				continue
			}
			issuer.FocusFireTargetIndex_ = target
		}
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
		const hero = Heroes.find(x => x.FocusFireTarget === entity)
		if (hero !== undefined) {
			this.invalidateFocusFire(hero)
		}
	}

	protected LifeStateChanged(entity: Entity) {
		if (!(entity instanceof Unit) || entity.IsAlive) {
			return
		}
		const hero = Heroes.find(x => x.FocusFireTarget === entity)
		if (hero !== undefined) {
			this.invalidateFocusFire(hero)
		}
	}

	private isValidModifier(caster: Nullable<Unit>, name: string): caster is Hero {
		return name === "modifier_windrunner_focusfire" && caster instanceof Hero
	}

	private invalidateFocusFire(hero: Hero) {
		hero.FocusFireActive = false
		hero.FocusFireTargetIndex_ = -1
	}
})()
