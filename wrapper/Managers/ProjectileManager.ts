import Color from "../Base/Color"
import Vector3 from "../Base/Vector3"
import { GetPositionHeight } from "../Native/WASM"
import Entity from "../Objects/Base/Entity"
import { GetPredictionTarget } from "../Objects/Base/FakeUnit"
import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"
import Unit from "../Objects/Base/Unit"
import { arrayRemove } from "../Utils/ArrayExtensions"
import GameState from "../Utils/GameState"
import { CMsgVector2DToVector2, CMsgVectorToVector3, NumberToColor, ParseProtobufDesc, ParseProtobufNamed, RecursiveProtobuf } from "../Utils/Protobuf"
import EntityManager from "./EntityManager"
import Events from "./Events"
import EventsSDK from "./EventsSDK"
import Manifest from "./Manifest"

const ProjectileManager = new (class CProjectileManager {
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

async function TrackingProjectileCreated(projectile: TrackingProjectile) {
	// TODO
	// projectile.Position.Extend(projectile.TargetLoc, (GameState.CurrentServerTick - projectile.LaunchTick) / 30 * projectile.Speed).CopyTo(projectile.Position)
	await EventsSDK.emit("TrackingProjectileCreated", false, projectile)
	ProjectileManager.AllTrackingProjectiles.push(projectile)
	ProjectileManager.AllTrackingProjectilesMap.set(projectile.ID, projectile)
}

async function DestroyTrackingProjectile(proj: TrackingProjectile) {
	await EventsSDK.emit("TrackingProjectileDestroyed", false, proj)
	arrayRemove(ProjectileManager.AllTrackingProjectiles, proj)
	ProjectileManager.AllTrackingProjectilesMap.delete(proj.ID)
	proj.IsValid = false
}

EventsSDK.on("EntityCreated", ent => {
	if (!(ent instanceof Unit))
		return
	for (const proj of ProjectileManager.AllTrackingProjectiles) {
		if (proj.Source?.EntityMatches(ent))
			proj.Source = ent
		if (proj.Target?.EntityMatches(ent))
			proj.Target = ent
	}
	for (const proj of ProjectileManager.AllLinearProjectiles)
		if (proj.Source?.EntityMatches(ent))
			proj.Source = ent
})
EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Unit))
		return
	for (const proj of ProjectileManager.AllTrackingProjectiles) {
		if (proj.Source === ent)
			proj.Source = undefined
		if (proj.Target === ent)
			proj.Target = undefined
	}
	for (const proj of ProjectileManager.AllLinearProjectiles)
		if (proj.Source === ent)
			proj.Source = undefined
})

EventsSDK.on("PostDataUpdate", async () => {
	const cur_time = GameState.RawGameTime
	const ExpiredLinearProjectiles: LinearProjectile[] = []
	for (const proj of ProjectileManager.AllLinearProjectiles) {
		if (proj.LastUpdate === 0) {
			proj.LastUpdate = cur_time
			continue
		}
		const dt = cur_time - proj.LastUpdate
		const add = Vector3.FromVector2(proj.Velocity.MultiplyScalar(dt))
		proj.Position.AddForThis(add)
		proj.LastUpdate = cur_time
		proj.Position.z = GetPositionHeight(proj.Position)
		if (proj.Position.DistanceSqr2D(proj.TargetLoc) < add.LengthSqr)
			ExpiredLinearProjectiles.push(proj)
	}
	for (const proj of ExpiredLinearProjectiles) {
		await EventsSDK.emit("LinearProjectileDestroyed", false, proj)
		arrayRemove(ProjectileManager.AllLinearProjectiles, proj)
		ProjectileManager.AllLinearProjectilesMap.delete(proj.ID)
	}
	for (const proj of ProjectileManager.AllTrackingProjectiles) {
		proj.UpdateTargetLoc()
		if (proj.LastUpdate === 0) {
			proj.LastUpdate = cur_time
			const source = proj.Source
			if (source instanceof Entity && proj.SourceAttachment !== "") {
				const attachment = source.GetAttachment(proj.SourceAttachment)
				if (attachment !== undefined)
					proj.Position.AddForThis(attachment.GetPosition(
						(attachment.FrameCount / 2) / attachment.FPS,
						source.RotationRad,
						source.ModelScale,
					))
			}
		}
		const dt = cur_time - proj.LastUpdate
		if (!proj.Position.IsValid)
			if (proj.Target instanceof Entity && proj.Source instanceof Entity && !proj.IsDodged) {
				proj.Position.CopyFrom(proj.Source.Position)
				const attachment = proj.SourceAttachment !== ""
					? proj.Source.GetAttachment(proj.SourceAttachment)
					: undefined
				if (attachment !== undefined)
					proj.Position.AddForThis(attachment.GetPosition(
						(attachment.FrameCount / 2) / attachment.FPS,
						proj.Source.RotationRad,
						proj.Source.ModelScale,
					))
				proj.Position
					.Extend(proj.TargetLoc, (GameState.CurrentServerTick - proj.LaunchTick) * dt * proj.Speed)
					.CopyTo(proj.Position)
			} else
				continue
		const velocity = proj.Position.GetDirectionTo(proj.TargetLoc).MultiplyScalarForThis(proj.Speed * dt)
		proj.Position.AddForThis(velocity)
		proj.LastUpdate = cur_time
		const distSqr = proj.Position.DistanceSqr(proj.TargetLoc)
		const collision_size = proj.Target instanceof Entity ? proj.Target.ProjectileCollisionSize ** 2 : 0
		if (
			(collision_size !== 0 && distSqr < collision_size)
			|| (distSqr < velocity.LengthSqr)
		)
			await DestroyTrackingProjectile(proj)
	}
})

ParseProtobufDesc(`
message CDOTAUserMsg_ProjectileParticleCPData {
	optional int32 control_point = 1;
	optional .CMsgVector vector = 2;
}

message CDOTAUserMsg_CreateLinearProjectile {
	optional .CMsgVector origin = 1;
	optional .CMsgVector2D velocity = 2;
	optional int32 entindex = 4;
	optional uint64 particle_index = 5;
	optional int32 handle = 6;
	optional .CMsgVector2D acceleration = 7;
	optional float max_speed = 8;
	optional float fow_radius = 9;
	optional bool sticky_fow_reveal = 10;
	optional float distance = 11;
	optional fixed32 colorgemcolor = 12;
	repeated .CDOTAUserMsg_ProjectileParticleCPData particle_cp_data = 13;
}

message CDOTAUserMsg_DestroyLinearProjectile {
	optional int32 handle = 1;
}

message CDOTAUserMsg_DodgeTrackingProjectiles {
	required int32 entindex = 1;
	optional bool attacks_only = 2;
}

message CDOTAUserMsg_TE_Projectile {
	optional int32 hSource = 1;
	optional int32 hTarget = 2;
	optional int32 moveSpeed = 3;
	optional int32 sourceAttachment = 4;
	optional int64 particleSystemHandle = 5;
	optional bool dodgeable = 6;
	optional bool isAttack = 7;
	optional float expireTime = 9;
	optional float maximpacttime = 10;
	optional fixed32 colorgemcolor = 11;
	optional int32 launch_tick = 12;
	optional int32 handle = 13;
	optional .CMsgVector vTargetLoc = 14;
}

message CDOTAUserMsg_TE_ProjectileLoc {
	optional .CMsgVector vSourceLoc = 1;
	optional int32 hTarget = 2;
	optional int32 moveSpeed = 3;
	optional int64 particleSystemHandle = 4;
	optional bool dodgeable = 5;
	optional bool isAttack = 6;
	optional float expireTime = 9;
	optional .CMsgVector vTargetLoc = 10;
	optional fixed32 colorgemcolor = 11;
	optional int32 launch_tick = 12;
	optional int32 handle = 13;
	optional int32 hSource = 14;
	optional int32 sourceAttachment = 15;
	repeated .CDOTAUserMsg_ProjectileParticleCPData particle_cp_data = 16;
}

message CDOTAUserMsg_TE_DestroyProjectile {
	optional int32 handle = 1;
}
`)
const projectile_attachments_names = [
	"",
	"attach_attack1",
	"attach_attack2",
	"attach_hitloc",
	"attach_attack3",
	"attach_attack4",
]
Events.on("ServerMessage", async (msg_id, buf_) => {
	const buf = new Uint8Array(buf_)
	switch (msg_id) {
		case 471: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_CreateLinearProjectile")
			const particle_system_handle = msg.get("particle_index") as bigint
			const projectile = new LinearProjectile(
				msg.get("handle") as number,
				await GetPredictionTarget(msg.get("entindex") as number),
				(particle_system_handle !== undefined ? Manifest.GetPathByHash(particle_system_handle) : undefined)!,
				particle_system_handle ?? 0n,
				msg.get("max_speed") as number,
				msg.get("fow_radius") as number,
				msg.get("sticky_fow_reveal") as boolean,
				msg.get("distance") as number,
				CMsgVectorToVector3(msg.get("origin") as RecursiveProtobuf),
				CMsgVector2DToVector2(msg.get("velocity") as RecursiveProtobuf),
				CMsgVector2DToVector2(msg.get("acceleration") as RecursiveProtobuf),
				NumberToColor(msg.get("colorgemcolor") as number),
			)
			// TODO: do we need particle_cp_data?
			await EventsSDK.emit("LinearProjectileCreated", false, projectile)
			ProjectileManager.AllLinearProjectiles.push(projectile)
			ProjectileManager.AllLinearProjectilesMap.set(projectile.ID, projectile)
			break
		}
		case 472: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_DestroyLinearProjectile")
			const projectile = ProjectileManager.AllLinearProjectilesMap.get(msg.get("handle") as number)
			if (projectile === undefined)
				return
			await EventsSDK.emit("LinearProjectileDestroyed", false, projectile)
			arrayRemove(ProjectileManager.AllLinearProjectiles, projectile)
			ProjectileManager.AllLinearProjectilesMap.delete(projectile.ID)
			break
		}
		case 473: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_DodgeTrackingProjectiles")
			const handle = msg.get("entindex") as number
			const ent = EntityManager.EntityByIndex(handle)
			await EventsSDK.emit("TrackingProjectilesDodged", false, ent ?? handle)
			if (ent === undefined)
				break
			const attacks_only = msg.get("attacks_only") as boolean
			ProjectileManager.AllTrackingProjectiles.filter(proj =>
				proj.IsDodgeable
				&& proj.Target === ent
				&& (!attacks_only || proj.IsAttack),
			).forEach(proj => proj.IsDodged = true)
			break
		}
		case 518: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_TE_Projectile")
			const particle_system_handle = msg.get("particleSystemHandle") as bigint
			const projectile = new TrackingProjectile(
				msg.get("handle") as number,
				await GetPredictionTarget(msg.get("hSource") as number),
				await GetPredictionTarget(msg.get("hTarget") as number),
				msg.get("moveSpeed") as number,
				projectile_attachments_names[msg.get("sourceAttachment") as Nullable<number> ?? 0],
				(particle_system_handle !== undefined ? Manifest.GetPathByHash(particle_system_handle) : undefined)!,
				particle_system_handle ?? 0n,
				msg.get("dodgeable") as boolean,
				msg.get("isAttack") as boolean,
				msg.get("expireTime") as number,
				msg.get("maximpacttime") as number,
				msg.get("launch_tick") as number,
				CMsgVectorToVector3(msg.get("vTargetLoc") as RecursiveProtobuf),
				NumberToColor(msg.get("colorgemcolor") as number),
			)

			await TrackingProjectileCreated(projectile)
			break
		}
		case 519: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_TE_ProjectileLoc")
			const target = await GetPredictionTarget(msg.get("hTarget") as number)
			const handle = msg.get("handle") as number,
				launch_tick = msg.get("launch_tick") as number,
				expire_time = msg.get("expireTime") as number,
				move_speed = msg.get("moveSpeed") as number,
				dodgeable = msg.get("dodgeable") as boolean,
				is_attack = msg.get("isAttack") as boolean,
				particle_system_handle = msg.get("particleSystemHandle") as bigint,
				TargetLoc = CMsgVectorToVector3(msg.get("vTargetLoc") as RecursiveProtobuf)
			const path = (particle_system_handle !== undefined ? Manifest.GetPathByHash(particle_system_handle) : undefined)!
			let projectile = ProjectileManager.AllTrackingProjectilesMap.get(handle)

			if (projectile === undefined) {
				projectile = new TrackingProjectile(
					handle,
					undefined,
					target,
					move_speed,
					"",
					path,
					particle_system_handle ?? 0n,
					dodgeable,
					is_attack,
					expire_time,
					undefined,
					launch_tick,
					TargetLoc,
					Color.fromIOBuffer(6),
				)
				// TODO: do we need particle_cp_data?
				projectile.Position.CopyFrom(CMsgVectorToVector3(msg.get("vSourceLoc") as RecursiveProtobuf))

				await TrackingProjectileCreated(projectile)
			}

			projectile.Update(
				target,
				move_speed,
				path,
				particle_system_handle ?? 0n,
				dodgeable,
				is_attack,
				expire_time,
				launch_tick,
				TargetLoc,
			)
			await EventsSDK.emit("TrackingProjectileUpdated", false, projectile)
			break
		}
		case 571: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_TE_DestroyProjectile")
			const projectile = ProjectileManager.AllTrackingProjectilesMap.get(msg.get("handle") as number)
			if (projectile !== undefined)
				await DestroyTrackingProjectile(projectile)
			break
		}
	}
})
