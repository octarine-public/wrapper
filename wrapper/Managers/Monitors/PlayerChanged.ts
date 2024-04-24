import { EventPriority } from "../../Enums/EventPriority"
import { Entity } from "../../Objects/Base/Entity"
import { Hero, Heroes } from "../../Objects/Base/Hero"
import { Players } from "../../Objects/Base/Player"
import { PlayerPawn } from "../../Objects/Base/PlayerPawn"
import { PlayerCustomData } from "../../Objects/DataBook/PlayerCustomData"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CPlayerChanged {
	public EntityChanged(entity: Entity) {
		if (!(entity instanceof Hero || entity instanceof PlayerPawn)) {
			return
		}
		if (entity instanceof Hero && entity.IsIllusion) {
			return
		}
		for (let index = Players.length - 1; index > -1; index--) {
			const player = Players[index]
			player.UpdateProperties(entity)
		}
		if (entity instanceof Hero) {
			this.UnitPropertyChanged()
		}
	}

	public UnitPropertyChanged() {
		for (let index = Heroes.length - 1; index > -1; index--) {
			const hero = Heroes[index]
			if (this.isValidHero(hero)) {
				PlayerCustomData.set(hero.PlayerID, hero)
			}
		}
	}

	private isValidHero = (hero: Hero) =>
		hero.IsValid && hero.IsRealHero && hero.CanUseAbilities && hero.CanUseItems
})()

EventsSDK.on(
	"PreEntityCreated",
	entity => Monitor.EntityChanged(entity),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"UnitPropertyChanged",
	() => Monitor.UnitPropertyChanged(),
	EventPriority.IMMEDIATE
)

EventsSDK.on("EntityDestroyed", entity => Monitor.EntityChanged(entity))
