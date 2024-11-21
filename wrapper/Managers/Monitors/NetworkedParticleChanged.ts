import { NetworkedParticle } from "../../Base/NetworkedParticle"
import { EventPriority } from "../../Enums/EventPriority"
import { Entity } from "../../Objects/Base/Entity"
import { Unit } from "../../Objects/Base/Unit"
import { GameState } from "../../Utils/GameState"
import { Events } from "../Events"
import { EventsSDK } from "../EventsSDK"

const Monitor = new (class CNetworkedParticleChanged {
	public PostDataUpdate() {
		const destroyedParticles: NetworkedParticle[] = []
		for (const par of NetworkedParticle.Instances.values()) {
			if (
				par.Released &&
				par.EndTime !== -1 &&
				par.EndTime <= GameState.RawGameTime
			) {
				destroyedParticles.push(par)
			}
		}
		for (let index = 0, end = destroyedParticles.length; index < end; index++) {
			destroyedParticles[index].Destroy()
		}
	}

	public EntityCreatedAfter(entity: Entity) {
		if (!(entity instanceof Unit)) {
			return
		}
		for (const par of NetworkedParticle.Instances.values()) {
			let changedAnything = false
			if (par.AttachedTo?.EntityMatches(entity)) {
				par.AttachedTo = entity
				changedAnything = true
			}
			if (par.ModifiersAttachedTo?.EntityMatches(entity)) {
				par.ModifiersAttachedTo = entity
				changedAnything = true
			}
			for (const data of par.ControlPointsEnt.values()) {
				if (data[0].EntityMatches(entity)) {
					data[0] = entity
					changedAnything = true
				}
			}
			if (changedAnything) {
				EventsSDK.emit("ParticleUpdated", false, par)
			}
		}
	}

	public EntityDestroyed(entity: Entity) {
		const destroyedParticles: NetworkedParticle[] = []
		for (const par of NetworkedParticle.Instances.values()) {
			if (par.ModifiersAttachedTo === entity) {
				par.ModifiersAttachedTo = undefined
			}
			if (par.AttachedTo === entity) {
				destroyedParticles.push(par)
			}
		}
		for (const par of destroyedParticles) {
			par.Destroy()
		}
		for (const par of NetworkedParticle.Instances.values()) {
			let changedAnything = false
			const destroyedCPsEnt: number[] = []
			for (const [cp, data] of par.ControlPointsEnt) {
				if (data[0] === entity) {
					destroyedCPsEnt.push(cp)
					changedAnything = true
				}
			}
			for (const cp of destroyedCPsEnt) {
				par.ControlPointsEnt.delete(cp)
			}
			if (changedAnything) {
				EventsSDK.emit("ParticleUpdated", false, par)
			}
		}
	}

	public NewConnection() {
		const destroyedParticles: NetworkedParticle[] = []
		for (const par of NetworkedParticle.Instances.values()) {
			destroyedParticles.push(par)
		}
		for (let index = destroyedParticles.length - 1; index > -1; index--) {
			destroyedParticles[index].Destroy()
		}
	}
})()

EventsSDK.on("PostDataUpdate", () => Monitor.PostDataUpdate(), EventPriority.HIGH)

Events.on("NewConnection", () => Monitor.NewConnection())

EventsSDK.on("EntityDestroyed", entity => Monitor.EntityDestroyed(entity))

EventsSDK.after("EntityCreated", entity => Monitor.EntityCreatedAfter(entity))
