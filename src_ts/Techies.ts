import { Ability, ArrayExtensions, Entity, EntityManager, EventsSDK, Game, Hero, LocalPlayer, MenuManager, Unit, Vector3, ParticlesSDK } from "./wrapper/Imports"

let TechiesMenu = MenuManager.MenuFactory("Techies"),
	State = TechiesMenu.AddToggle("State"),
	Explode_seen_mines = TechiesMenu.AddCheckBox("Explode seen mines"),
	Explode_expiring_mines = TechiesMenu.AddCheckBox("Explode expiring mines"),
	safe_mode = TechiesMenu.AddCheckBox("Safe mode").SetToolTip("Reduces explosion radius based on hero speed"),
	use_prediction = TechiesMenu.AddCheckBox("Use prediction"),
	auto_stack = TechiesMenu.AddCheckBox("Autostack mines").SetToolTip("Automatically stacks mines in place"),
	auto_stack_range = TechiesMenu.AddSliderFloat("Autostack range", 300, 50, 1000).SetToolTip("Range where autostack will try to find other mines")

const RMineTriggerRadius = 425,
	RMineBlowDelay = .25,
	ForcestaffUnits = 600

var NoTarget: Entity[] = [],
	particles = new Map<Unit, number>(),
	rmines: Array<[
		/* mine */Unit,
		/* dmg */number,
		/* will setup after m_fGameTime */number,
		/* will become invis after m_fGameTime */number,
	]> = [],
	heroes: Hero[] = [],
	techies: Hero,
	latest_techies_spellamp: number = 1

function CreateRange(ent: Entity, range: number): number {
	const par = ParticlesSDK.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
	ParticlesSDK.SetControlPoint(par, 1, new Vector3(range))
	return par
}

function RemoveMine(rmine: Unit) {
	rmines.some(([rmine2], i) => {
		if (rmine2 === rmine) {
			rmines.splice(i, 1)
			return true
		}
		return false
	})
}

function ExplodeMine(rmine: Unit) {
	rmine.CastNoTarget(rmine.GetAbilityByName("techies_remote_mines_self_detonate"), false)
	RemoveMine(rmine)
}

function TryDagon(ent: Unit, damage: number = 0, damage_type: number = DAMAGE_TYPES.DAMAGE_TYPE_NONE): boolean {
	var Dagon = techies.GetItemByName(/item_dagon/),
		TargetHP = ent.GetHealthAfter(RMineBlowDelay)
	if (Dagon)
		if (Dagon.Cooldown === 0 && techies.IsInRange(ent, Dagon.CastRange) && TargetHP < ent.CalculateDamage(Dagon.GetSpecialValue("damage") * latest_techies_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, techies) + ent.CalculateDamage(damage, damage_type, techies)) {
			techies.CastTarget(Dagon, ent, false)
			return true
		}

	return false
}

function CallMines(
	ent: Unit,
	callback: (rmine: Unit) => boolean,
	explosionCallback: (RMinesToBlow: Unit[], RMinesDmg: number) => void,
): void {
	var TargetHP = ent.GetHealthAfter(RMineBlowDelay),
		cur_time = Game.RawGameTime,
		RMinesToBlow: Unit[] = [],
		RMinesDmg = 0

	rmines.filter(([rmine, dmg, setup_time]) => cur_time > setup_time && callback(rmine)).every(([rmine, dmg]) => {
		RMinesToBlow.push(rmine)
		RMinesDmg += dmg
		var theres = ent.CalculateDamage(RMinesDmg, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, techies)
		// console.log("EzTechiesAuto", `There's ${theres} (derived from ${RMinesDmg}), needed ${TargetHP} for ${ent.m_iszUnitName}`)
		if (TargetHP < theres) {
			explosionCallback(RMinesToBlow, RMinesDmg)
			return false
		} else return !TryDagon(ent, RMinesDmg, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
	})
}

function NeedToTriggerMine(rmine: Unit, ent: Unit, forcestaff: boolean = false): boolean {
	var TriggerRadius = RMineTriggerRadius
	if (safe_mode.value)
		TriggerRadius -= ent.IdealSpeed * (RMineBlowDelay / 30)

	return use_prediction.value
		? ent.InFront(((ent.IsMoving as any) * RMineBlowDelay) + (forcestaff ? ForcestaffUnits : 0)).Distance2D(rmine.NetworkPosition) <= TriggerRadius
		: forcestaff
			? rmine.NetworkPosition.Distance2D(ent.InFront(ForcestaffUnits)) <= TriggerRadius
			: rmine.IsInRange(ent, TriggerRadius)
}

Events.on("Tick",  () => {
	if (!State.value || techies === undefined || Game.IsPaused)
		return
	var cur_time = Game.RawGameTime
	rmines = rmines.filter(([rmine]) => rmine.IsAlive)
	if (Explode_expiring_mines.value) {
		const rmineTimeout = 595 // 600 is mine duration
		for (const [mine, dmg, setup_time] of rmines)
			if (cur_time > setup_time + rmineTimeout)
				ExplodeMine(mine)
	}
	if (Explode_seen_mines.value)
		for (const [mine, dmg, setup_time, invis_time] of rmines)
			if (mine.IsVisibleForEnemies && cur_time > invis_time)
				ExplodeMine(mine)
	rmines.filter(([rmine]) => rmine.HPPercent !== 100).forEach(([rmine]) => ExplodeMine(rmine))
	latest_techies_spellamp = techies.SpellAmplification
	{
		let bs_buff = techies.GetBuffByName("modifier_bloodseeker_bloodrage")
		if (bs_buff !== undefined)
			latest_techies_spellamp *= bs_buff.Ability.GetSpecialValue("damage_increase_pct") / 100
	}
	heroes.filter(ent =>
		ent.IsAlive
		&& ent.IsVisible
		&& !ent.IsMagicImmune
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
				setTimeout(() => NoTarget.splice(NoTarget.indexOf(ent), 1), (RMineBlowDelay + GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000 + 180)
			},
		)

		var force = techies.GetItemByName("item_force_staff")
		if (
			!callbackCalled && force !== undefined && techies.IsAlive && force.Cooldown === 0
			&& techies.IsInRange(ent, force.CastRange)
		)
			CallMines (
				ent,
				rmine => NeedToTriggerMine(rmine, ent, true),
				() => techies.CastTarget(force, ent, false),
			)
	})
})

function CreateParticleFor(npc: Unit) {
	if (npc === undefined)
		return
	setTimeout(() => {
		var range = 400 // same for land mines and stasis traps
		if (npc.IsValid)
			switch (npc.Name) {
				case "npc_dota_techies_remote_mine":
					range = RMineTriggerRadius * (safe_mode.value ? 0.85 : 1)
				case "npc_dota_techies_stasis_trap":
				case "npc_dota_techies_land_mine":
					particles.set(npc, CreateRange(npc, range))
				default:
					break
			}
	}, 30)
}

function RegisterMine(npc: Unit) {
	if (rmines.some(([rmine2]) => rmine2 === npc)) {
		console.log(`Tried to register existing mine ${npc.Index}`)
		return
	}
	const Ulti = techies !== undefined ? techies.GetAbilityByName("techies_remote_mines") : undefined
	rmines.push ([
		npc,
		Ulti ?
			Ulti.GetSpecialValue("damage" + (techies.HasScepter ? "_scepter" : ""))
			: 0,
		Game.RawGameTime + (Ulti ? Ulti.CastPoint : 0) + 0.1,
		Game.RawGameTime + (Ulti ? Ulti.GetSpecialValue("activation_time") + Ulti.CastPoint : 0) + 0.3,
	])
}

EventsSDK.on("GameStarted", pl_ent => {
	if (pl_ent.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Techies)
		techies = pl_ent
})
Events.on("GameEnded", () => {
	rmines = []
	if (IsInGame())
		// loop-optimizer: KEEP
		particles.forEach(particle => { ParticlesSDK.Destroy(particle, true) })
	particles = new Map<Unit, number>()
	NoTarget = []
	heroes = []
	techies = undefined as any
})
EventsSDK.on("PrepareUnitOrders", args => {
	if (!auto_stack.value)
		return true
	if (
		args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
		|| args.Position === undefined
		|| args.Ability === undefined
		|| !(args.Ability instanceof Ability && args.Ability.Name === "techies_remote_mines")
	)
		return true
	const ents = EntityManager.GetEntitiesInRange(args.Position, auto_stack_range.value)
	var minePos: Vector3
	if (ents.some(ent => {
		const isMine = ent instanceof Unit && ent.Name === "npc_dota_techies_remote_mine" && ent.IsAlive
		if (isMine)
			minePos = ent.NetworkPosition
		return isMine
	})) {
		if (minePos.Equals(args.Position))
			return true
		args.Unit.CastPosition(args.Ability, minePos, args.Queue, args.ShowEffects)
		return false
	}
	return true
})
EventsSDK.on("EntityCreated", npc => {
	if (!(npc instanceof Unit) || LocalPlayer === undefined)
		return
	if (npc.IsEnemy()) {
		if (npc instanceof Hero)
			if (!npc.IsIllusion)
				heroes.push(npc)
		return
	}
	if (npc.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines) {
		CreateParticleFor(npc)
		if (npc.Name === "npc_dota_techies_remote_mine")
			RegisterMine(npc)
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
	else if (ent instanceof Unit && ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines && ent.Name === "npc_dota_techies_remote_mine") {
		if (particles.has(ent))
			ParticlesSDK.Destroy(particles.get(ent), true)
		RemoveMine(ent)
	}
})
