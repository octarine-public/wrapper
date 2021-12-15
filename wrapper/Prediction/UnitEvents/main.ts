import NetworkedParticle from "../../Base/NetworkedParticle"
import EventsSDK from "../../Managers/EventsSDK"
import { arrayRemove } from "../../Utils/ArrayExtensions"
import { HandleParticleChangeFurionTP } from "./FurionTP"
import { HandleParticleChangeTPScroll } from "./TPScroll"

const releasedParticles: NetworkedParticle[] = []
function HandleParticleChange(par: NetworkedParticle, is_update: boolean, is_release: boolean): void {
	if (releasedParticles.includes(par)) {
		arrayRemove(releasedParticles, par)
		return
	}
	HandleParticleChangeTPScroll(par, is_update)
	HandleParticleChangeFurionTP(par, is_update)
	if (is_release)
		releasedParticles.push(par)
}

EventsSDK.on("ParticleUpdated", par => HandleParticleChange(par, true, false))
EventsSDK.on("ParticleReleased", par => HandleParticleChange(par, false, true))
EventsSDK.on("ParticleDestroyed", par => HandleParticleChange(par, false, false))
