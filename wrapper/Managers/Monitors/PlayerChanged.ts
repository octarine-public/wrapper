import { PlayerCustomData } from "../../Imports"
import { Entity } from "../../Objects/Base/Entity"
import { Hero, Heroes } from "../../Objects/Base/Hero"
import { Players } from "../../Objects/Base/Player"
import { PlayerPawn } from "../../Objects/Base/PlayerPawn"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CPlayer {
	public EntityChanged(entity: Entity) {
		if (!(entity instanceof Hero || entity instanceof PlayerPawn)) {
			return
		}
		if (entity instanceof Hero && entity.IsIllusion) {
			return
		}
		for (const player of Players) {
			player.UpdateProperties(entity)
		}
		if (entity instanceof Hero) {
			this.UnitPropertyChanged()
		}
	}

	public UnitPropertyChanged() {
		for (const hero of Heroes) {
			if (this.isValidHero(hero)) {
				PlayerCustomData.set(hero.PlayerID, hero)
			}
		}
	}

	private isValidHero = (hero: Hero) =>
		hero.IsRealHero && hero.CanUseAbilities && hero.CanUseItems
})()

EventsSDK.on(
	"PreEntityCreated",
	entity => Monitor.EntityChanged(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"UnitPropertyChanged",
	() => Monitor.UnitPropertyChanged(),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on("EntityDestroyed", entity => Monitor.EntityChanged(entity))
