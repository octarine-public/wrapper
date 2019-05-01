
import * as Orders from "./Orders"
import * as Utils from "./Utils"

const RMineTriggerRadius = 425,
	RMineBlowDelay = .25,
	ForcestaffUnits = 600
var config: any = {
		enabled: true,
		explode_seen_mines: true,
		explode_expiring_mines: false,
		safe_mode: true,
		use_prediction: false,
		auto_stack: true,
		auto_stack_range: 300,
	},
	NoTarget: C_BaseEntity[] = [],
	particles: number[] = [],
	rmines: Array<[
		/* mine */C_DOTA_NPC_TechiesMines,
		/* dmg */number,
		/* will setup after m_fGameTime */number,
		/* will become invis after m_fGameTime */number,
	]> = [],
	heroes: C_DOTA_BaseNPC_Hero[] = [],
	techies: C_DOTA_Unit_Hero_Techies,
	latest_techies_spellamp: number = 1

function CreateRange(ent: C_BaseEntity, range: number): number {
	const par = Particles.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
	Particles.SetControlPoint(par, 1, new Vector(range, 0, 0))
	return par
}

function RemoveMine(rmine: C_DOTA_BaseNPC) {
	const ar = rmines.filter(([rmine2]) => rmine2 === rmine)
	if (ar.length === 1)
		rmines.splice(rmines.indexOf(ar[0]), 1)
}

function ExplodeMine(rmine: C_DOTA_BaseNPC) {
	if (rmine.m_bIsValid)
		Orders.CastNoTarget(rmine, rmine.GetAbilityByName("techies_remote_mines_self_detonate"), false)
	RemoveMine(rmine)
}

function TryDagon(ent: C_DOTA_BaseNPC, damage: number = 0, damage_type: number = DAMAGE_TYPES.DAMAGE_TYPE_NONE): boolean {
	var Dagon = Utils.GetItemByRegexp(techies, /item_dagon/),
		TargetHP = Utils.GetHealthAfter(ent, RMineBlowDelay)
	if (Dagon)
		if (Dagon.m_fCooldown === 0 && techies.IsInRange(ent, Utils.GetCastRange(techies, Dagon)) && TargetHP < Utils.CalculateDamage(ent, Dagon.GetSpecialValue("damage") * latest_techies_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, techies) + Utils.CalculateDamage(ent, damage, damage_type, techies)) {
			Orders.CastTarget(techies, Dagon, ent, false)
			return true
		}

	return false
}

function CallMines(
	ent: C_DOTA_BaseNPC,
	callback: (rmine: C_DOTA_NPC_TechiesMines) => boolean,
	explosionCallback: (RMinesToBlow: C_DOTA_NPC_TechiesMines[], RMinesDmg: number) => void,
): void {
	var TargetHP = Utils.GetHealthAfter(ent, RMineBlowDelay),
		cur_time = GameRules.m_fGameTime,
		RMinesToBlow: C_DOTA_NPC_TechiesMines[] = [],
		RMinesDmg = 0

	rmines.filter(([rmine, dmg, setup_time]) => cur_time > setup_time && callback(rmine)).every(([rmine, dmg]) => {
		RMinesToBlow.push(rmine)
		RMinesDmg += dmg
		var theres = Utils.CalculateDamage(ent, RMinesDmg, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, techies)
		// console.log("EzTechiesAuto", `There's ${theres}, needed ${TargetHP} for ${ent.m_iszUnitName}`)
		if (TargetHP < theres) {
			explosionCallback(RMinesToBlow, RMinesDmg)
			return false
		} else return !TryDagon(ent, RMinesDmg, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
	})
}

function NeedToTriggerMine(rmine: C_DOTA_BaseNPC, ent: C_DOTA_BaseNPC, forcestaff: boolean = false): boolean {
	var TriggerRadius = RMineTriggerRadius
	if (config.safe_mode)
		TriggerRadius -= ent.m_fIdealSpeed * (RMineBlowDelay / 30)

	return config.use_prediction
		? ent.InFront(((ent.m_bIsMoving as any) * RMineBlowDelay) + (forcestaff ? ForcestaffUnits : 0)).DistTo2D(rmine.m_vecNetworkOrigin) <= TriggerRadius
		: forcestaff
			? rmine.m_vecNetworkOrigin.DistTo2D(ent.InFront(ForcestaffUnits)) <= TriggerRadius
			: rmine.IsInRange(ent, TriggerRadius)
}

function onTick() {
	if (!config.enabled || techies === undefined || IsPaused()) return
	var cur_time = GameRules.m_fGameTime
	rmines = rmines.filter(([rmine]) => rmine.m_bIsAlive)
	if (config.explode_expiring_mines) {
		const rmineTimeout = 595 // 600 is mine duration
		for (const [mine, dmg, setup_time] of rmines)
			if (cur_time > setup_time + rmineTimeout)
				ExplodeMine(mine)
	}
	if (config.explode_seen_mines)
		for (const [mine, dmg, setup_time, invis_time] of rmines)
			if (mine.m_bIsVisibleForEnemies && cur_time > invis_time)
				ExplodeMine(mine)
	rmines.filter(([rmine]) => rmine.m_iHealth !== rmine.m_iMaxHealth).forEach(([rmine]) => ExplodeMine(rmine))
	latest_techies_spellamp = techies.m_fSpellAmplification / 100
	{
		let bs_buff = techies.GetBuffByName("modifier_bloodseeker_bloodrage")
		if (bs_buff !== undefined)
			latest_techies_spellamp *= (bs_buff.m_hAbility as C_DOTABaseAbility).GetSpecialValue("damage_increase_pct") / 100
	}
	heroes.filter(ent =>
		ent.m_bIsAlive
		&& ent.m_bIsVisible
		&& !ent.m_bIsMagicImmune
		&& NoTarget.indexOf(ent) === -1,
	).forEach(ent => {
		var callbackCalled = false
		CallMines (
			ent,
			rmine => NeedToTriggerMine(rmine, ent),
			RMinesToBlow => {
				callbackCalled = true
				RMinesToBlow.forEach(rmine => ExplodeMine(rmine), false)
				NoTarget.push(ent)
				setTimeout((RMineBlowDelay +  GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000 + 30, () => NoTarget.splice(NoTarget.indexOf(ent), 1))
			},
		)

		var force = techies.GetItemByName("item_force_staff")
		if (
			!callbackCalled && force !== undefined && techies.m_bIsAlive && force.m_fCooldown === 0
			&& techies.IsInRange(ent, Utils.GetCastRange(techies, force))
		)
			CallMines (
				ent,
				rmine => NeedToTriggerMine(rmine, ent, true),
				() => Orders.CastTarget(techies, force, ent, false),
			)
	})
}

function CreateParticleFor(npc: C_DOTA_BaseNPC) {
	if (npc === undefined)
		return
	setTimeout(30, () => {
		var range = 400 // same for land mines and stasis traps
		if (npc.m_bIsValid)
			switch (npc.m_iszUnitName) {
				case "npc_dota_techies_remote_mine":
					range = RMineTriggerRadius * (config.safe_mode ? 0.85 : 1)
				case "npc_dota_techies_stasis_trap":
				case "npc_dota_techies_land_mine":
					particles[npc.m_iID] = CreateRange(npc, range)
				default:
					break
			}
	})
}

function RegisterMine(npc: C_DOTA_BaseNPC) {
	const ar = rmines.filter(([rmine2]) => rmine2 === npc)
	if (ar.length !== 0) {
		console.log(`Tried to register existing mine ${npc.m_iID}`)
		return
	}
	const Ulti = techies !== undefined ? techies.GetAbilityByName("techies_remote_mines") : undefined
	rmines.push ([
		npc as C_DOTA_NPC_TechiesMines,
		Ulti ?
			Ulti.GetSpecialValue("damage" + (techies.m_bHasScepter ? "_scepter" : ""))
			: 0,
		GameRules.m_fGameTime + (Ulti ? Ulti.m_fCastPoint : 0) + 0.1,
		GameRules.m_fGameTime + (Ulti ? Ulti.GetSpecialValue("activation_time") + Ulti.m_fCastPoint : 0) + 0.3,
	])
}

Events.addListener("onTick", onTick)
Events.addListener("onGameStarted", pl_ent => {
	if (pl_ent.m_iHeroID === HeroID_t.npc_dota_hero_techies)
		techies = pl_ent as C_DOTA_Unit_Hero_Techies
})
Events.addListener("onGameEnded", () => {
	rmines = []
	if (IsInGame())
		// loop-optimizer: KEEP
		particles.forEach(particle => { Particles.Destroy(particle, true) })
	particles = []
	NoTarget = []
	heroes = []
	techies = undefined as any
})
Events.addListener("onPrepareUnitOrders", args => {
	if (!config.auto_stack)
		return true
	if (
		args.order_type !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
		|| args.position === undefined
		|| args.ability === undefined
		|| args.ability.m_pAbilityData.m_pszAbilityName !== "techies_remote_mines"
	)
		return true
	const ents = args.position.GetEntitiesInRange(config.auto_stack_range)
	var minePos: Vector = undefined as any // hack for tsc, it's always initialized when used
	if (ents.some(ent => {
		const isMine = ent instanceof C_DOTA_BaseNPC && ent.m_iszUnitName === "npc_dota_techies_remote_mine" && ent.m_bIsAlive
		if (isMine)
			minePos = ent.m_vecNetworkOrigin
		return isMine
	})) {
		if (minePos === args.position)
			return true
		Orders.CastPosition(args.unit, args.ability, minePos, args.queue)
		return false
	}
	return true
})
Events.addListener("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (LocalDOTAPlayer === undefined)
		return
	if (npc.m_bIsHero && npc.IsEnemy(LocalDOTAPlayer)) {
		if ((npc as C_DOTA_BaseNPC_Hero).m_hReplicatingOtherHeroModel === undefined || (npc as C_DOTA_Unit_Hero_Meepo).m_bIsClone)
			heroes.push(npc as C_DOTA_BaseNPC_Hero)
		return
	}
	if (npc.IsEnemy(LocalDOTAPlayer))
		return
	CreateParticleFor(npc)
	if (npc.m_iszUnitName === "npc_dota_techies_remote_mine")
		RegisterMine(npc)
})
Events.addListener("onEntityDestroyed", ent => {
	if (!(ent instanceof C_DOTA_BaseNPC))
		return
	if (ent.m_iszUnitName === "npc_dota_techies_remote_mine") {
		if (particles[ent.m_iID] !== undefined)
			Particles.Destroy(particles[ent.m_iID], true)
		RemoveMine(ent)
	}
	if (ent instanceof C_DOTA_BaseNPC_Hero)
		Utils.arrayRemove(heroes, ent)
})

{
	let root = new Menu_Node("EzTechies")
	root.entries.push(new Menu_Toggle (
		"State",
		config.enabled,
		node => config.enabled = node.value,
	))
	root.entries.push(new Menu_Boolean (
		"Explode seen mines",
		config.explode_seen_mines,
		node => config.explode_seen_mines = node.value,
	))
	root.entries.push(new Menu_Boolean (
		"Explode expiring mines",
		config.explode_expiring_mines,
		node => config.explode_expiring_mines = node.value,
	))
	root.entries.push(new Menu_Boolean (
		"Safe mode",
		config.safe_mode,
		"Reduces explosion radius based on hero speed",
		node => {
			config.safe_mode = node.value
			Object.keys(particles).forEach(entID => {
				const entIDFixed = parseInt(entID)
				Particles.Destroy(particles[entIDFixed], true)
				CreateParticleFor(Entities.GetByID(entIDFixed) as C_DOTA_BaseNPC)
			})
		},
	))
	root.entries.push(new Menu_Boolean (
		"Use prediction",
		config.use_prediction,
		node => config.use_prediction = node.value,
	))
	root.entries.push(new Menu_Boolean (
		"Autostack mines",
		config.auto_stack,
		"Automatically stacks mines in place",
		node => config.auto_stack = node.value,
	))
	root.entries.push(new Menu_SliderFloat (
		"Autostack range",
		config.auto_stack_range,
		50,
		1000,
		"Range where autostack will try to find other mines",
		node => config.auto_stack_range = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
