import Entity, { GameRules } from "../Objects/Base/Entity"
import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"
import Unit from "../Objects/Base/Unit"
import { arrayRemove } from "../Utils/ArrayExtensions"
import Events from "./Events"
import EventsSDK from "./EventsSDK"
import Color from "../Base/Color"
import RendererSDK from "../Native/RendererSDK"
import { ParseProtobufDesc, ParseProtobufNamed, CMsgVectorToVector3, RecursiveProtobuf, CMsgVector2DToVector2, NumberToColor, ServerHandleToIndex } from "../Utils/Protobuf"
import EntityManager from "./EntityManager"
import GameState from "../Utils/GameState"
import Manifest from "./Manifest"
import Vector2 from "../Base/Vector2"

let ProjectileManager = new (class CProjectileManager {
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

function TrackingProjectileCreated(projectile: TrackingProjectile) {
	projectile.Position.Extend(projectile.TargetLoc, (GameState.CurrentServerTick - projectile.LaunchTick) / 30 * projectile.Speed).CopyTo(projectile.Position)
	EventsSDK.emit("TrackingProjectileCreated", false, projectile)
	ProjectileManager.AllTrackingProjectiles.push(projectile)
	ProjectileManager.AllTrackingProjectilesMap.set(projectile.ID, projectile)
}

function DestroyTrackingProjectile(proj: TrackingProjectile) {
	EventsSDK.emit("TrackingProjectileDestroyed", false, proj)
	arrayRemove(ProjectileManager.AllTrackingProjectiles, proj)
	ProjectileManager.AllTrackingProjectilesMap.delete(proj.ID)
	proj.IsValid = false
}

EventsSDK.on("Tick", () => {
	let cur_time = GameRules!.RawGameTime
	ProjectileManager.AllLinearProjectiles.forEach(proj => {
		proj.Position.AddForThis(proj.Velocity.MultiplyScalar(cur_time - proj.LastUpdate).toVector3())
		proj.LastUpdate = cur_time
		proj.Position.z = RendererSDK.GetPositionHeight(Vector2.FromVector3(proj.Position))
	})
	ProjectileManager.AllTrackingProjectiles.forEach(proj => {
		if (!proj.Position.IsValid)
			if (proj.Target instanceof Entity && proj.Source instanceof Entity && !proj.IsDodged)
				proj.Source.Position
					.Extend(proj.TargetLoc, (GameState.CurrentServerTick - proj.LaunchTick) / 30 * proj.Speed)
					.CopyTo(proj.Position)
			else
				return
		proj.Position.Extend(proj.TargetLoc, proj.Speed * (cur_time - proj.LastUpdate)).CopyTo(proj.Position)
		proj.LastUpdate = cur_time
		if (proj.Position.Distance(proj.TargetLoc) < proj.Speed / 30 + (proj.Target instanceof Unit ? proj.Target.HullRadius : 0))
			DestroyTrackingProjectile(proj)
	})
})

ParseProtobufDesc(`
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
}

message CDOTAUserMsg_TE_DestroyProjectile {
	optional int32 handle = 1;
}
`)
Events.on("ServerMessage", (msg_id, buf_len) => {
	const buf = ServerMessageBuffer.subarray(0, buf_len)
	switch (msg_id) {
		case 471: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_CreateLinearProjectile")
			const particle_system_handle = msg.get("particle_index") as bigint
			const projectile = new LinearProjectile(
				msg.get("handle") as number,
				EntityManager.EntityByIndex(msg.get("entindex") as number),
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
			EventsSDK.emit("LinearProjectileCreated", false, projectile)
			ProjectileManager.AllLinearProjectiles.push(projectile)
			ProjectileManager.AllLinearProjectilesMap.set(projectile.ID, projectile)
			break
		}
		case 472: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_DestroyLinearProjectile")
			const projectile = ProjectileManager.AllLinearProjectilesMap.get(msg.get("handle") as number)
			if (projectile === undefined)
				return
			EventsSDK.emit("LinearProjectileDestroyed", false, projectile)
			arrayRemove(ProjectileManager.AllLinearProjectiles, projectile)
			ProjectileManager.AllLinearProjectilesMap.delete(projectile.ID)
			break
		}
		case 473: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_DodgeTrackingProjectiles")
			const handle = msg.get("entindex") as number
			const ent = EntityManager.EntityByIndex(handle)
			EventsSDK.emit("TrackingProjectilesDodged", false, ent ?? ServerHandleToIndex(handle))
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
				EntityManager.EntityByIndex(msg.get("hSource") as number),
				EntityManager.EntityByIndex(msg.get("hTarget") as number),
				msg.get("moveSpeed") as number,
				msg.get("sourceAttachment") as number,
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

			TrackingProjectileCreated(projectile)
			break
		}
		case 519: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_TE_ProjectileLoc")
			const target = EntityManager.EntityByIndex(msg.get("hTarget") as number)
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
					undefined,
					path,
					particle_system_handle ?? 0n,
					dodgeable,
					is_attack,
					expire_time,
					undefined,
					launch_tick,
					TargetLoc,
					Color.fromIOBuffer(true, 6)!
				)
				projectile.Position.CopyFrom(CMsgVectorToVector3(msg.get("vSourceLoc") as RecursiveProtobuf))

				TrackingProjectileCreated(projectile)
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
			EventsSDK.emit("TrackingProjectileUpdated", false, projectile)
			break
		}
		case 571: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_TE_DestroyProjectile")
			const projectile = ProjectileManager.AllTrackingProjectilesMap.get(msg.get("handle") as number)
			if (projectile !== undefined)
				DestroyTrackingProjectile(projectile)
			break
		}
	}
})
