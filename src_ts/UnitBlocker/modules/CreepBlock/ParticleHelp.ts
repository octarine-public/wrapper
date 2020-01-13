import { Game, Hero, LocalPlayer, Vector3 } from "wrapper/Imports"

import { AddOrUpdateParticle, RemoveParticle } from "../../base/DrawParticle"
import { stateMain } from "../../base/MenuBase"
import { DrawHelpPosition, DrawState, State } from "./Menu"

let lastHero: Nullable<Hero>
let particles: string[] = []

export const BestPosition = [
	[
		new Vector3(-6526, -1450), // top
		new Vector3(-3933, -3426), // middle
		new Vector3(-784, -6411), // bottom
	],
	[
		new Vector3(751, 5751), // top
		new Vector3(3429, 2905), // middle
		new Vector3(6339, 849), // bottom
	],
]

export function DrawParticles() {
	if (
		particles.length > 0
		|| Game.MapName.startsWith("hero_demo")
		|| !stateMain.value
		|| !State.value
		|| !DrawState.value
		|| !DrawHelpPosition.value
		|| !Game.IsInGame
	)
		return

	lastHero = LocalPlayer?.Hero
	if (lastHero === undefined || LocalPlayer === undefined)
		return

	const teamParticles = BestPosition[LocalPlayer.Team - 2]
	if (teamParticles === undefined) {
		console.log("[CreepBlock] [Particles] Unsupported team: " + LocalPlayer.Team)
		return
	}

	teamParticles.forEach(vec => {
		const name = vec.toString()

		AddOrUpdateParticle(name, lastHero!, vec, 100)

		particles.push(name)
	})
}

export function RemoveParticles() {
	if (lastHero === undefined)
		return

	particles.forEach(partcl => RemoveParticle(partcl, lastHero!))
	particles = []
}
