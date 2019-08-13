import { EventsSDK, Color,EntityManager } from "wrapper/Imports";
import { LinearProjectile, TrackingProjectile } from '../Objects/Base/Projectile';
import { arrayRemove } from "../Utils/ArrayExtensions"
let AllLinearProjectiles: LinearProjectile[] = [],
	AllLinearProjectilesMap: Map<number,LinearProjectile> = new Map(),
	AllTrackingProjectilesMap: Map<number,TrackingProjectile> = new Map(),
	AllTrackingProjectiles: TrackingProjectile[] = []

class ProjectileManager {
	get AllLinearProjectiles(): LinearProjectile[] {
		return AllLinearProjectiles.slice()
	}
	get AllTrackingProjectiles(): TrackingProjectile[] {
		return AllTrackingProjectiles.slice()
	}
}

export default new ProjectileManager()
Events.on("TrackingProjectileCreated", (proj, source, target, moveSpeed, sourceAttachment, path, particleSystemHandle, dodgeable, isAttack, expireTime, maximpacttime, launch_tick) => {
	let projectile = new TrackingProjectile (
		proj,
		source instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(source)
			: source, 
		target instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(target)
			: target,
		moveSpeed,
		sourceAttachment,
		path,
		particleSystemHandle,
		dodgeable,
		isAttack,
		expireTime,
		maximpacttime,
		launch_tick
	)
	EventsSDK.emit('TrackingProjectileCreated', false, projectile)
	AllTrackingProjectiles.push(projectile)
	AllTrackingProjectilesMap.set(proj,projectile)
})

Events.on("LinearProjectileCreated", (proj, ent, path, particleSystemHandle, max_speed, fow_radius, sticky_fow_reveal, distance) => {
	let projectile = new LinearProjectile (
		proj,
		ent instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(ent)
			: ent,
		path,
		particleSystemHandle,
		max_speed,
		fow_radius,
		sticky_fow_reveal,
		distance,
		Color.fromIOBuffer(7)
	)
	EventsSDK.emit("LinearProjectileCreated", false, projectile)
	AllLinearProjectiles.push(projectile)
	AllLinearProjectilesMap.set(proj,projectile)
})

Events.on("TrackingProjectileDestroyed", proj => {
	let projectile = AllTrackingProjectilesMap.get(proj)
	if (projectile === undefined)
		return
	EventsSDK.emit('TrackingProjectileDestroyed', false, projectile)
	arrayRemove(AllTrackingProjectiles, projectile)
	AllTrackingProjectilesMap.delete(proj)
})

Events.on("TrackingProjectilesDodged", (ent, attacks_only) => {
	let ent_ = ent instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(ent)
		: ent
	AllTrackingProjectiles.forEach(val => {
		if (!val.IsDodgeable || val.Target !== ent_)
			return
		if (!attacks_only || (attacks_only && val.IsAttack))
			val.Dodge()
	})
})

Events.on("TrackingProjectileUpdated", (proj, hTarget, moveSpeed, path, particleSystemHandle, dodgeable, isAttack, expireTime, launch_tick) => {
	let projectile = AllTrackingProjectilesMap.get(proj)
	if (projectile === undefined)
		return
	projectile.Update (
		hTarget instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(hTarget)
			: hTarget,
		moveSpeed,
		path,
		particleSystemHandle,
		dodgeable,
		isAttack,
		expireTime,
		launch_tick
	)
	EventsSDK.emit("TrackingProjectileUpdated", false, projectile)
})

Events.on("LinearProjectileDestroyed", proj => {
	let projectile = AllLinearProjectilesMap.get(proj)
	if (projectile === undefined)
		return
	EventsSDK.emit('LinearProjectileDestroyed', false, projectile)
	arrayRemove(AllLinearProjectiles, projectile)
	AllLinearProjectilesMap.delete(proj)
})
