import { EventPriority } from "../../Enums/EventPriority"
import { invoker_exort } from "../../Objects/Abilities/Invoker/invoker_exort"
import { invoker_quas } from "../../Objects/Abilities/Invoker/invoker_quas"
import { invoker_spell_extends } from "../../Objects/Abilities/Invoker/invoker_spell_extends"
import { invoker_wex } from "../../Objects/Abilities/Invoker/invoker_wex"
import { Ability } from "../../Objects/Base/Ability"
import { Unit } from "../../Objects/Base/Unit"
import { EventsSDK } from "../EventsSDK"

new (class CInvokerSpellLevelChanged {
	constructor() {
		EventsSDK.on(
			"AbilityLevelChanged",
			this.AbilityLevelChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"UnitAbilitiesChanged",
			this.UnitAbilitiesChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"HasScepterChanged",
			this.UnitAbilitiesChanged.bind(this),
			EventPriority.IMMEDIATE
		)
	}

	protected AbilityLevelChanged(abil: Ability) {
		if (abil.IsAttributes || abil.IsItem || abil.IsPassive) {
			return
		}
		const owner = abil.Owner
		if (owner === undefined || !owner.IsHero || owner.IsIllusion) {
			return
		}
		const wex = owner.GetAbilityByClass(invoker_wex),
			quas = owner.GetAbilityByClass(invoker_quas),
			exort = owner.GetAbilityByClass(invoker_exort)
		if (wex === undefined || quas === undefined || exort === undefined) {
			return
		}
		if (abil instanceof invoker_spell_extends) {
			abil.QuasLevel = this.level(quas)
			abil.WexLevel = this.level(wex)
			abil.ExortLevel = this.level(exort)
			return
		}
		this.UnitAbilitiesChanged(owner)
	}

	protected UnitAbilitiesChanged(unit: Unit) {
		if (!unit.IsHero || unit.IsIllusion) {
			return
		}
		const wex = unit.GetAbilityByClass(invoker_wex),
			quas = unit.GetAbilityByClass(invoker_quas),
			exort = unit.GetAbilityByClass(invoker_exort)
		if (wex === undefined || quas === undefined || exort === undefined) {
			return
		}
		const arr = unit.Spells
		for (let i = arr.length - 1; i > -1; i--) {
			const abil = arr[i]
			if (abil instanceof invoker_spell_extends) {
				abil.QuasLevel = this.level(quas)
				abil.WexLevel = this.level(wex)
				abil.ExortLevel = this.level(exort)
			}
		}
	}

	private level(ability: Ability) {
		let level = ability.Level
		if (ability.Owner?.HasScepter) {
			level++
		}
		return level
	}
})()
