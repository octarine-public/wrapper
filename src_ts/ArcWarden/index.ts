import {ArrayExtensions, EntityManager, EventsSDK, Game, GameSleeper, Hero, ParticlesSDK, Unit, Utils, Vector3 } from "wrapper/Imports"
import { Ability_settings, BlinkRadius, CursorPos, DrawTargetParticle, Items_settings, KeyCombo, MyAbility, MyItems, State } from "./Menu"

let myHeroes: Unit[] = [], // arr my hero
	Enemy: Hero,
	Heroes: Hero[] = [], // arr Enemy
	TargetParticle: number,
	Sleeper = new GameSleeper()

function MainCombo(unit: Unit, Enemy: Hero): boolean {
	if (!unit.IsAlive || unit.IsInvulnerable)
		return false
	if (unit.Distance2D(Enemy) >= 1200) {
		unit.MoveTo(Enemy.NetworkPosition)
		return false
	}
	unit.AttackTarget(Enemy)
	if (Enemy.IsMagicImmune)
		return false
	let Tempest = unit.Buffs.map(buff => buff.Name === "modifier_arc_warden_tempest_double").some(bool => bool)
	if (unit.IsIllusion && !Tempest)
		return false
	for (let index = 0; index < MyItems.length; index++) {
		let IsEnebled = Items_settings.IsEnabledID(index),
			Items = unit.GetItemByName(MyItems[index])
		if (Items === undefined || !Items.CanBeCasted() || !IsEnebled)
			continue
		if(Items.Name === "item_blink") {
			let Range = Items.GetSpecialValue("blink_range") + unit.CastRangeBonus,
				distance = Enemy.NetworkPosition.Subtract(unit.NetworkPosition),
				disToTarget = unit.Distance(Enemy)
			distance.SetZ(0)
			distance.Normalize()
			if (disToTarget > Range) {
				let di = disToTarget - Range,
					minus = 0
				if (di < BlinkRadius.value)
					minus = BlinkRadius.value - di
				distance.ScaleTo(Range - 1 - minus)
			} else {
				distance.ScaleTo(disToTarget - BlinkRadius.value - 1)
			}
			Sleeper.Sleep(100, "Combo")
			unit.CastPosition(Items, unit.NetworkPosition.Add(distance))
		}
		if (Items.Name === "item_mjollnir" || Items.Name === "item_lotus_orb") {
			unit.CastTarget(Items, unit)
			return true
		}
		if (Items.Name === "item_bloodthorn" || Items.Name === "item_orchid") {
			if (Enemy.IsSilenced)
				continue
			Sleeper.Sleep(100, "Combo")
			unit.UseSmartAbility(Items, Enemy)
			return true
		}
		if (Items.Name === "item_sheepstick") {
			if (Enemy.IsHexed)
				continue
			Sleeper.Sleep(100, "Combo")
			unit.UseSmartAbility(Items, Enemy)
			return true
		}
		if (Items.Name === "item_nullifier") {
			if (Enemy.IsMuted)
				continue
			Sleeper.Sleep(100, "Combo")
			unit.UseSmartAbility(Items, Enemy)
			return true
		}
		if (Items.Name === "item_manta") {
			Sleeper.Sleep(200, "Combo")
			unit.UseSmartAbility(Items, Enemy)
			return true
		}
		Sleeper.Sleep(100, "Combo")
		unit.UseSmartAbility(Items, Enemy)
		return true
	}
	for (let index = 0; index < MyAbility.length; index++) {
		let IsEnebled = Ability_settings.IsEnabledID(index),
			Abils = unit.GetAbilityByName(MyAbility[index])
		if (Abils === undefined || !Abils.CanBeCasted() || !IsEnebled)
			continue
		if (Abils.Name === "arc_warden_magnetic_field") {
			let IsRanged = Enemy.IsRanged ? (Enemy.AttackRange + unit.HullRadius) : 600
			if (unit.Distance2D(Enemy) <= IsRanged) {
				Sleeper.Sleep(Abils.CastPoint * 1000, "Combo")
				unit.CastPosition(Abils, unit.InFront(-150))
				return true
			}
			return false
		}
		if (Abils.Name === "arc_warden_spark_wraith" && !Abils.CanBeCasted()) {
			Sleeper.Sleep(Abils.CastPoint * 1000, "Combo")
			unit.CastPosition(Abils, Enemy.VelocityWaypoint(2.3))
			return true
		}
		Sleeper.Sleep(Abils.CastPoint * 1000, "Combo")
		unit.UseSmartAbility(Abils, Enemy)
		return true
	}
	return true
}

EventsSDK.on("Tick", () => {
	if (!State.value || Sleeper.Sleeping("Combo") || Heroes === undefined || Heroes.length <= 0 || !Game.IsInGame || Game.IsPaused)
		return false
	Enemy = ArrayExtensions.orderBy(Heroes.filter(hero => hero.Distance(Utils.CursorWorldVec) <= CursorPos.value && hero.IsAlive), ent => ent.Distance(Utils.CursorWorldVec))[0]
	if (Enemy === undefined)
		return false
	let myHero = EntityManager.LocalPlayer
	if (myHero === undefined || !KeyCombo.is_pressed)
		return false
	let myName = myHero.Hero.Name
	if (myName !== "npc_dota_hero_arc_warden")
		return false
	if (!myHeroes.some(hero_ => !MainCombo(hero_, Enemy)))
		return false
})

EventsSDK.on("GameStarted", LocalPlayer => {
	if (LocalPlayer.m_pBaseEntity instanceof CDOTA_Unit_Hero_ArcWarden)
		myHeroes.push(LocalPlayer)
})

EventsSDK.on("GameEnded", () => {
	Heroes = []
	myHeroes = []
	Sleeper.FullReset()
	Enemy = undefined
	if (TargetParticle !== undefined) {
		ParticlesSDK.Destroy(TargetParticle, true)
		TargetParticle = undefined
	}
})

EventsSDK.on("EntityCreated", npc => {
	if (npc instanceof Hero && npc.IsEnemy() && !npc.IsIllusion)
		Heroes.push(npc)
	if (npc instanceof Hero && !npc.IsEnemy() && npc.IsControllableByPlayer) {
		myHeroes.push(npc)
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(Heroes, ent)
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(myHeroes, ent)
})

EventsSDK.on("Draw", () => {
	if (!State.value || !DrawTargetParticle.value || !Game.IsInGame || Game.IsPaused)
		return
	let myHero = EntityManager.LocalPlayer
	if (myHero === undefined)
		return false
	if (TargetParticle === undefined && (Enemy !== undefined || Heroes.length > 0)) {
		TargetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, Enemy)
	}
	if (TargetParticle !== undefined) {
		if (Enemy === undefined) {
			ParticlesSDK.Destroy(TargetParticle, true)
			TargetParticle = undefined
		} else {
			ParticlesSDK.SetControlPoint(TargetParticle, 2, myHero.Hero.Position)
			ParticlesSDK.SetControlPoint(TargetParticle, 6, new Vector3(1))
			ParticlesSDK.SetControlPoint(TargetParticle, 7, Enemy.Position)
		}
	}
})