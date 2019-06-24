import { EventsSDK, Entity, Unit, Vector3, LocalPlayer, ArrayExtensions } from "wrapper/Imports";

var treant_eyes: Unit[] = [],
	pars: number[] = []

EventsSDK.on("onEntityCreated", (ent: Entity, id) => {
	if (ent instanceof Unit && ent.m_pBaseEntity instanceof C_DOTA_NPC_Treant_EyesInTheForest) {
		treant_eyes.push(ent)
		var par = Particles.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent.m_pBaseEntity)
		new Vector3(100, 0, 0).toIOBuffer();
		Particles.SetControlPoint(par, 1);
		pars[id] = par
	}
})

EventsSDK.on("onEntityDestroyed", (ent, id) => {
	if (ArrayExtensions.arrayRemove(treant_eyes, ent))
		delete pars[id];
})

EventsSDK.on("onTick", () => {
	var local_team_flag = 1 << LocalPlayer.Team;
	// loop-optimizer: KEEP
	treant_eyes.forEach((ent, i) => {
		if (ent.IsAlive) {
			ent.IsVisibleForTeamMask |= local_team_flag
			// |= 1 << 2 is EF_IN_STAGING_LIST
			// |= 1 << 4 is EF_DELETE_IN_PROGRESS
			// 1 << 5 is EF_NODRAW
			// &= ~(1 << 7) is trigger
			// 1 << 9 is EF_NODRAW???
			
			ent.Flags &= ~(1 << 7)
			ent.Flags |= 1 << 3
		} else {
			ent.Flags |= 1 << 7
			ent.Flags &= ~(1 << 3)
			treant_eyes.splice(i, 1)
			Particles.Destroy(pars[ent.Index], true)
			delete pars[ent.Index]
		}
	})
})

EventsSDK.on("onGameEnded", () => {
	treant_eyes = []
	// loop-optimizer: POSSIBLE_UNDEFINED
	pars.forEach(par => Particles.Destroy(par, true))
	pars = []
})
