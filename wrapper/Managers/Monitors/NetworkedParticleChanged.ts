import { NetworkedParticle } from "../../Base/NetworkedParticle"
import { EventPriority } from "../../Enums/EventPriority"
import { Entity } from "../../Objects/Base/Entity"
import { Unit } from "../../Objects/Base/Unit"
import { GameState } from "../../Utils/GameState"
import { Events } from "../Events"
import { EventsSDK } from "../EventsSDK"

new (class CNetworkedParticleChanged {
	constructor() {
		Events.on("NewConnection", this.NewConnection.bind(this))
		EventsSDK.on("PostDataUpdate", this.PostDataUpdate.bind(this), EventPriority.HIGH)
		EventsSDK.on("EntityDestroyed", this.EntityDestroyed.bind(this))
		EventsSDK.after("EntityCreated", this.EntityCreatedAfter.bind(this))
	}

	protected PostDataUpdate(_dt: number) {
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
		for (let i = 0, end = destroyedParticles.length; i < end; i++) {
			destroyedParticles[i].Destroy()
		}
	}
	protected EntityCreatedAfter(entity: Entity) {
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
	protected EntityDestroyed(entity: Entity) {
		const destroyedParticles: NetworkedParticle[] = []
		for (const par of NetworkedParticle.Instances.values()) {
			if (par.AbilityIndex === entity.Index) {
				par.AbilityIndex = undefined
			}
			if (par.SourceIndex === entity.Index) {
				par.SourceIndex = undefined
			}
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
	protected NewConnection() {
		const destroyedParticles: NetworkedParticle[] = []
		for (const par of NetworkedParticle.Instances.values()) {
			destroyedParticles.push(par)
		}
		for (let index = destroyedParticles.length - 1; index > -1; index--) {
			destroyedParticles[index].Destroy()
		}
	}
})()
