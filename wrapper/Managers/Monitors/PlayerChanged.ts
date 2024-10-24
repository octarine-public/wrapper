import { EventPriority } from "../../Enums/EventPriority"
import { Entity } from "../../Objects/Base/Entity"
import { Hero, Heroes } from "../../Objects/Base/Hero"
import { Players } from "../../Objects/Base/Player"
import { PlayerPawn } from "../../Objects/Base/PlayerPawn"
import { Unit } from "../../Objects/Base/Unit"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EventsSDK } from "../EventsSDK"

new (class CPlayerChanged {
	constructor() {
		EventsSDK.on(
			"PreEntityCreated",
			this.EntityChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityDestroyed",
			this.EntityChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"UnitPropertyChanged",
			this.UnitPropertyChanged.bind(this),
			EventPriority.IMMEDIATE
		)
	}

	protected EntityChanged(entity: Entity) {
		if (!(entity instanceof Hero || entity instanceof PlayerPawn)) {
			return
		}
		if (entity instanceof Hero && !entity.IsRealHero) {
			return
		}
		for (let i = Players.length - 1; i > -1; i--) {
			Players[i].UpdateProperties(entity)
		}
		if (entity instanceof Hero) {
			this.UnitPropertyChanged()
		}
	}

	protected UnitPropertyChanged(_unit?: Unit) {
		for (let i = Heroes.length - 1; i > -1; i--) {
			const hero = Heroes[i]
			if (hero.IsValid && hero.IsRealHero) {
				PlayerCustomData.set(hero.PlayerID, hero)
			}
		}
	}
})()
