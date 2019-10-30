import { Color, EntityManager, EventsSDK, RendererSDK } from "wrapper/Imports"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import Entity from "../Objects/Base/Entity"
import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"
import Unit from "../Objects/Base/Unit"
import { arrayRemove } from "../Utils/ArrayExtensions"
import { Game } from "./EntityManager"

let ProjectileManager = new (class ProjectileManager {
	public readonly AllLinearProjectiles: LinearProjectile[] = []
	public readonly AllTrackingProjectiles: TrackingProjectile[] = []

	public readonly AllLinearProjectilesMap: Map<number, LinearProjectile> = new Map()
	public readonly AllTrackingProjectilesMap: Map<number, TrackingProjectile> = new Map()
})()
export default ProjectileManager

EventsSDK.on("GameEnded", () => {
	ProjectileManager.AllLinearProjectiles.splice(0)
	ProjectileManager.AllTrackingProjectiles.splice(0)

	ProjectileManager.AllLinearProjectilesMap.clear()
	ProjectileManager.AllTrackingProjectilesMap.clear()
})

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
		launch_tick,
		Vector3.fromIOBuffer(),
		Color.fromIOBuffer(3),
	)
	EventsSDK.emit("TrackingProjectileCreated", false, projectile)
	ProjectileManager.AllTrackingProjectiles.push(projectile)
	ProjectileManager.AllTrackingProjectilesMap.set(proj, projectile)
})

Events.on("TrackingProjectileUpdated", (proj, hTarget, moveSpeed, path, particleSystemHandle, dodgeable, isAttack, expireTime, launch_tick) => {
	let projectile = ProjectileManager.AllTrackingProjectilesMap.get(proj)
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
		launch_tick,
		Vector3.fromIOBuffer(true, 3),
	)
	EventsSDK.emit("TrackingProjectileUpdated", false, projectile)
})

Events.on("TrackingProjectilesDodged", (ent, attacks_only) => {
	let ent_ = ent instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(ent)
		: ent
	ProjectileManager.AllTrackingProjectiles.filter(proj =>
		proj.IsDodgeable
		&& proj.Target === ent_
		&& (!attacks_only || proj.IsAttack),
	).forEach(proj => proj.IsDodged = true)
})

function DestroyTrackingProjectile(proj: TrackingProjectile) {
	EventsSDK.emit("TrackingProjectileDestroyed", false, proj)
	arrayRemove(ProjectileManager.AllTrackingProjectiles, proj)
	ProjectileManager.AllTrackingProjectilesMap.delete(proj.ID)
	proj.IsValid = false
}

Events.on("TrackingProjectileDestroyed", proj => {
	let projectile = ProjectileManager.AllTrackingProjectilesMap.get(proj)
	if (projectile !== undefined)
		DestroyTrackingProjectile(projectile)
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
		Vector3.fromIOBuffer(),
		Vector2.fromIOBuffer(true, 3),
		Vector2.fromIOBuffer(true, 5),
		Color.fromIOBuffer(7),
	)
	EventsSDK.emit("LinearProjectileCreated", false, projectile)
	ProjectileManager.AllLinearProjectiles.push(projectile)
	ProjectileManager.AllLinearProjectilesMap.set(proj, projectile)
})

Events.on("LinearProjectileDestroyed", proj => {
	let projectile = ProjectileManager.AllLinearProjectilesMap.get(proj)
	if (projectile === undefined)
		return
	EventsSDK.emit("LinearProjectileDestroyed", false, projectile)
	arrayRemove(ProjectileManager.AllLinearProjectiles, projectile)
	ProjectileManager.AllLinearProjectilesMap.delete(proj)
})

setInterval(() => {
	if (Game.IsPaused)
		return
	ProjectileManager.AllLinearProjectiles.forEach(proj => {
		proj.Position.x += proj.Velocity.x / 120
		proj.Position.y += proj.Velocity.y / 120
		proj.Position.z = RendererSDK.GetPositionHeight(proj.Position.toVector2())
	})
	ProjectileManager.AllTrackingProjectiles.forEach(proj => {
		if (!proj.Position.IsValid)
			if (proj.Target instanceof Entity && proj.Source instanceof Entity && !proj.IsDodged)
				proj.Source.Position
					.Extend(proj.Target.Position, (Game.CurrentServerTick - proj.LaunchTick) / 30 * proj.Speed)
					.CopyTo(proj.Position)
			else
				return
		proj.Position.Extend(proj.TargetLoc, proj.Speed / 120).CopyTo(proj.Position)
		if (proj.Position.Distance(proj.TargetLoc) < proj.Speed / 30 + (proj.Target instanceof Unit ? proj.Target.HullRadius : 0))
			DestroyTrackingProjectile(proj)
	})
}, 1000 / 120)
