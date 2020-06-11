import { ArrayExtensions, Entity, LocalPlayer, ParticlesSDK, Unit, Vector3 } from "wrapper/Imports"
import { State } from "./Menu"

var treant_eyes: Unit[] = [], pars = new Map<Entity, number>()
export function Destroy(ent: Entity) {
	if (ArrayExtensions.arrayRemove(treant_eyes, ent))
		pars.delete(ent)
}
export function Create(ent: Entity) {
	if (ent instanceof Unit && ent.ClassName === "CDOTA_NPC_Treant_EyesInTheForest") {
		treant_eyes.push(ent)
		if (!State.value)
			return
		var par = ParticlesSDK.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
		ParticlesSDK.SetControlPoint(par, 1, new Vector3(100, 0, 0))
		pars.set(ent, par)
	}
}
export function Tick() {
	if (!State.value)
		return
	treant_eyes.forEach((ent, i) => {
		EnforceEntityVisibility(ent.Index, LocalPlayer!.Team, ent.IsAlive)
		if (!ent.IsAlive) {
			treant_eyes.splice(i, 1)
			let par = pars.get(ent)
			if (par !== undefined) {
				ParticlesSDK.Destroy(par, true)
				pars.delete(ent)
			}
		}
	})
}
export function Init() {
	treant_eyes = []
	pars.forEach(par => ParticlesSDK.Destroy(par, true))
	pars.clear()
}
