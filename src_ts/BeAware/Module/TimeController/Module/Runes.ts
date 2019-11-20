import { ArrayExtensions, Color, Entity, Game, Hero, RendererSDK, Rune, Vector2, Vector3 } from "wrapper/Imports";
import {
	NotifyPowerRuneMax, NotifyPowerRuneMin,
	NotifyTimeBountyMax, NotifyTimeBountyMin,
	PMH_Show_bounty, PMH_Show_bounty_size,
	PMH_Show_bountyRGBA, PMH_Show_bountyRGBA_mark, TreeNotificationBountyChat, TreeNotificationBountyDrawMap,
	TreeNotificationBountySound, TreeNotificationPowerChat, TreeNotificationPowerDrawMap,
	TreeNotificationPowerSound,
	TreeRuneState,
} from "../Menu";

let allRunes: Rune[] = [],
	Heroes: Hero[] = [],
	checkTick: number = 0,
	checkTickPower: number = 0,
	bountyRunesAr = [false, false, false, false],
	bountyRunesPos = [
		new Vector3(4140.375, -1771.09375, 256),
		new Vector3(3705.4375, -3619.875, 256),
		new Vector3(-4331.46875, 1591.375, 256),
		new Vector3(-3073.40625, 3680.9375, 128),
	],
	PowerRunesPos = [
		new Vector3(-1708.21875, 1174.0625, 128),
		new Vector3(2404.625, -1864.4375, 128),
	],
	bountyAlreadySeted = false,
	RunePowerTimer: boolean = true,
	RuneBountyTimerBool: boolean = true,
	Particle: Map<number, [bigint, string | Entity, Vector3?]> = new Map(), // TODO Radius for ability
	mt_rand_power: number,
	mt_rand_bounty: number

function mt_rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function DrawRunes() {

	if (Game.GameTime >= 0 && Game.LevelNameShort !== "hero_demo_main") {
		// power
		let Time = Game.RawGameTime;
		if (TreeRuneState.value) {
			let RunePowerTime = Game.GameTime % 120;
			if (TreeNotificationPowerChat.value && RunePowerTime >= 120 || RunePowerTime === 0)
				RunePowerTimer = true
			// loop-optimizer: KEEP
			PowerRunesPos.forEach(val => {
				if (mt_rand_power === undefined)
					mt_rand_power = mt_rand(NotifyPowerRuneMin.value, NotifyPowerRuneMax.value)
				if (mt_rand_power !== undefined && RunePowerTime >= (120 - mt_rand_power)) {
					if (TreeNotificationPowerDrawMap.value)
						RendererSDK.DrawMiniMapIcon("minimap_ping", val, 900)

					if (Time >= checkTickPower) {
						if (RunePowerTime <= 119) {
							if (TreeNotificationBountySound.value > 0) {
								Game.ExecuteCommand("playvol ui/ping " + TreeNotificationPowerSound.value / 100)
								checkTickPower = Time + (NotifyPowerRuneMax.value / 3)
							}
							if (RunePowerTimer) {
								if (TreeNotificationPowerChat.value) {
									Game.ExecuteCommand("chatwheel_say 57")
									RunePowerTimer = false
								}
							}
							mt_rand_power = undefined
						}
					}
				}
			})
		}
		// bounty
		if (PMH_Show_bounty.value) {
			let RuneBountyTime = Game.GameTime % 300
			if (!bountyAlreadySeted) {
				if (RuneBountyTime >= 299 || RuneBountyTime <= 1) {
					bountyRunesAr = [true, true, true, true]
					bountyAlreadySeted = true
					if (TreeNotificationBountyChat.value) {
						RuneBountyTimerBool = true
					}
				}
			}
			// loop-optimizer: KEEP
			bountyRunesPos.forEach((val, key) => {
				if (mt_rand_bounty === undefined) {
					mt_rand_bounty = mt_rand(NotifyTimeBountyMin.value, NotifyTimeBountyMax.value)
				}
				if (mt_rand_bounty !== undefined && RuneBountyTime >= (300 - mt_rand_bounty)) {
					if (TreeNotificationBountyDrawMap.value) {
						RendererSDK.DrawMiniMapIcon("minimap_ping", val, 900)
					}
					if (Time >= checkTick) {
						if (RuneBountyTime <= 299) {
							if (TreeNotificationBountySound.value > 0) {
								Game.ExecuteCommand("playvol ui/ping " + TreeNotificationBountySound.value / 100)
								checkTick = Time + (NotifyTimeBountyMax.value / 3)
							}
							mt_rand_bounty = undefined
						}
						if (RuneBountyTimerBool) {
							if (TreeNotificationBountyChat.value) {
								Game.ExecuteCommand("chatwheel_say 57")
								RuneBountyTimerBool = false
							}
						}
					}
				}
				// Bounty Rune
				let rune = allRunes.some(rune_ => rune_.IsAlive && val.IsInRange(rune_.Position, 430))
				// loop-optimizer: FORWARD
				Heroes.filter((x, i) => {
					if (rune === undefined && x.IsInRange(val, 430)) {
						bountyAlreadySeted = false
						bountyRunesAr[key] = false
					}
				})
				if (bountyRunesAr[key]) {
					RendererSDK.DrawMiniMapIcon("minimap_rune_bounty", val, PMH_Show_bounty_size.value * 14, PMH_Show_bountyRGBA.Color)
					DrawIcon(val, PMH_Show_bountyRGBA_mark.Color)
				}
			})
			if (Particle === undefined || Particle.size <= 0)
				return
			// loop-optimizer: KEEP
			Particle.forEach(([handle, target, position], i) => {
				// loop-optimizer: KEEP
				bountyRunesPos.forEach((val, key) => {
					//Bounty Rune
					if (handle !== 17096352592726237548n)
						return
					let distance = val.Distance(position)
					if (distance <= 800) {
						bountyAlreadySeted = false
						bountyRunesAr[key] = false
						Particle.clear()
					}
				})
			})
		}
	}
}

export function EntityCreatedRune(x: Entity) {
	if (x instanceof Hero)
		Heroes.push(x)
	if (x instanceof Rune)
		allRunes.push(x)
}

export function EntityDestroyedRune(x: Entity) {
	if (x instanceof Rune)
		ArrayExtensions.arrayRemove(allRunes, x)
	if (x instanceof Hero)
		ArrayExtensions.arrayRemove(Heroes, x)
}

export function RuneGameEnded() {
	Heroes = []
	allRunes = []
	Particle.clear()
}

function DrawIcon(position: Vector3, color?: Color) {
	let pos_particle = RendererSDK.WorldToScreen(position)
	if (pos_particle === undefined)
		return
	RendererSDK.Image(`panorama/images/control_icons/check_png.vtex_c`,
		pos_particle.SubtractScalar(PMH_Show_bounty_size.value / 4),
		new Vector2(PMH_Show_bounty_size.value / 2, PMH_Show_bounty_size.value / 2), color,
	)
}

export function RuneParticleDestroyed(id: number) {
	if (!Particle.has(id))
		return
	Particle.delete(id)
}

export function RuneParticleCreate(id: number, entity: Entity, handle: bigint) {
	if (handle !== 17096352592726237548n)
		return
	Particle.set(id, [handle, entity instanceof Hero ? entity : undefined])
}

export function RuneParticleCreateUpdateEnt(id: number, ent: Entity, position: Vector3) {
	let part = Particle.get(id)
	if (part === undefined)
		return
	Particle.set(id, [part[0], ent instanceof Hero ? ent : part[1], position])
}
