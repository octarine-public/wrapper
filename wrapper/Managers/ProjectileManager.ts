import { Vector3 } from "../Base/Vector3"
import { GetPositionHeight } from "../Native/WASM"
import { Entity } from "../Objects/Base/Entity"
import { GetPredictionTarget } from "../Objects/Base/FakeUnit"
import { LinearProjectile, TrackingProjectile } from "../Objects/Base/Projectile"
import { Unit } from "../Objects/Base/Unit"
import { GameState } from "../Utils/GameState"
import {
	CMsgVector2DToVector2,
	CMsgVectorToVector3,
	NumberToColor,
	ParseProtobufDesc,
	ParseProtobufNamed,
	RecursiveProtobuf
} from "../Utils/Protobuf"
import { EntityManager } from "./EntityManager"
import { Events } from "./Events"
import { QueueEvent } from "./EventsQueue"
import { EventsSDK } from "./EventsSDK"

export const ProjectileManager = new (class CProjectileManager {
	public readonly AllLinearProjectiles: LinearProjectile[] = []
	public readonly AllTrackingProjectiles: TrackingProjectile[] = []

	public readonly AllLinearProjectilesMap = new Map<number, LinearProjectile>()
	public readonly AllTrackingProjectilesMap = new Map<number, TrackingProjectile>()
})()

EventsSDK.on("GameEnded", () => {
	ProjectileManager.AllLinearProjectiles.clear()
	ProjectileManager.AllTrackingProjectiles.clear()

	ProjectileManager.AllLinearProjectilesMap.clear()
	ProjectileManager.AllTrackingProjectilesMap.clear()
})

function TrackingProjectileCreated(projectile: TrackingProjectile) {
	// TODO
	// projectile.Position.Extend(
	// 	projectile.TargetLoc,
	// 	(GameState.CurrentGameTick - projectile.LaunchTick) *
	// 		GameState.TickInterval *
	// 		projectile.Speed
	// ).CopyTo(projectile.Position)
	EventsSDK.emit("TrackingProjectileCreated", false, projectile)
	ProjectileManager.AllTrackingProjectiles.push(projectile)
	ProjectileManager.AllTrackingProjectilesMap.set(projectile.ID, projectile)
}

function DestroyTrackingProjectile(proj: TrackingProjectile) {
	EventsSDK.emit("TrackingProjectileDestroyed", false, proj)
	ProjectileManager.AllTrackingProjectiles.remove(proj)
	ProjectileManager.AllTrackingProjectilesMap.delete(proj.ID)
	proj.IsValid = false
}

EventsSDK.on("EntityCreated", ent => {
	if (!(ent instanceof Unit)) {
		return
	}
	for (const proj of ProjectileManager.AllTrackingProjectiles) {
		if (proj.Source?.EntityMatches(ent)) {
			proj.Source = ent
		}
		if (proj.Target?.EntityMatches(ent)) {
			proj.Target = ent
		}
	}
	for (const proj of ProjectileManager.AllLinearProjectiles) {
		if (proj.Source?.EntityMatches(ent)) {
			proj.Source = ent
		}
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Unit)) {
		return
	}
	const arrTraking = ProjectileManager.AllTrackingProjectiles
	for (let index = arrTraking.length - 1; index > -1; index--) {
		const proj = arrTraking[index]
		if (proj.Source === ent) {
			proj.Source = undefined
		}
		if (proj.Target === ent) {
			proj.Target = undefined
		}
	}
	const arrLinear = ProjectileManager.AllLinearProjectiles
	for (let index = arrLinear.length - 1; index > -1; index--) {
		const proj = arrLinear[index]
		if (proj.Source === ent) {
			proj.Source = undefined
		}
	}
})

EventsSDK.on("PostDataUpdate", dt => {
	if (dt === 0) {
		return
	}
	for (const proj of ProjectileManager.AllTrackingProjectiles) {
		proj.UpdateProjectileSpeed()
		if (!proj.IsDodged) {
			const target = proj.Target
			if (target instanceof Entity) {
				const extendPos = !proj.TargetLoc.IsValid && proj.Position.IsValid
				proj.TargetLoc.CopyFrom(target.GetAttachmentPosition("attach_hitloc"))
				if (extendPos) {
					proj.Position.Extend(
						proj.TargetLoc,
						(GameState.CurrentGameTick - proj.LaunchTick) * dt * proj.Speed
					).CopyTo(proj.Position)
				}
			}
		}
		if (!proj.TargetLoc.IsValid) {
			continue
		}
		if (!proj.Position.IsValid) {
			if (!(proj.Source instanceof Entity)) {
				continue
			}
			proj.Source.GetAttachmentPosition(proj.SourceAttachment).CopyTo(proj.Position)
			proj.Position.Extend(
				proj.TargetLoc,
				(GameState.CurrentGameTick - proj.LaunchTick) * dt * proj.Speed
			).CopyTo(proj.Position)
		}
		const velocity = proj.Position.GetDirectionTo(
			proj.TargetLoc
		).MultiplyScalarForThis(
			Math.min(proj.Speed * dt, proj.Position.Distance(proj.TargetLoc))
		)
		proj.Position.AddForThis(velocity)
		const distSqr = proj.Position.DistanceSqr(proj.TargetLoc)
		const collisionSize =
			proj.Target instanceof Entity ? proj.Target.ProjectileCollisionSize ** 2 : 0
		if (distSqr <= collisionSize) {
			DestroyTrackingProjectile(proj)
		}
	}
	const expiredLinearProjectiles: LinearProjectile[] = []
	for (const proj of ProjectileManager.AllLinearProjectiles) {
		const add = Vector3.FromVector2(proj.Velocity.MultiplyScalar(dt))
		proj.Position.AddForThis(add)
		proj.Position.z = GetPositionHeight(proj.Position)
		if (proj.Position.DistanceSqr2D(proj.TargetLoc) < add.LengthSqr) {
			expiredLinearProjectiles.push(proj)
		}
	}
	for (const proj of expiredLinearProjectiles) {
		EventsSDK.emit("LinearProjectileDestroyed", false, proj)
		ProjectileManager.AllLinearProjectiles.remove(proj)
		ProjectileManager.AllLinearProjectilesMap.delete(proj.ID)
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
	optional int32 entindex = 4 [default = -1];
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
	required int32 entindex = 1 [default = -1];
	optional bool attacks_only = 2;
}

message CDOTAUserMsg_TE_Projectile {
	optional uint32 source = 1 [default = 16777215];
	optional uint32 target = 2 [default = 16777215];
	optional int32 move_speed = 3;
	optional int32 source_attachment = 4;
	optional int64 particle_system_handle = 5;
	optional bool dodgeable = 6;
	optional bool is_attack = 7;
	optional float expire_time = 9;
	optional float maximpacttime = 10;
	optional fixed32 colorgemcolor = 11;
	optional int32 launch_tick = 12;
	optional int32 handle = 13;
	optional .CMsgVector target_loc = 14;
	repeated .CDOTAUserMsg_ProjectileParticleCPData particle_cp_data = 15;
	optional int64 additional_particle_system_handle = 16;
	optional int32 original_move_speed = 17;
	optional uint32 ability = 18 [default = 16777215];
}

message CDOTAUserMsg_TE_ProjectileLoc {
	optional .CMsgVector source_loc = 1;
	optional uint32 target = 2 [default = 16777215];
	optional int32 move_speed = 3;
	optional int64 particle_system_handle = 4;
	optional bool dodgeable = 5;
	optional bool is_attack = 6;
	optional float expire_time = 9;
	optional .CMsgVector target_loc = 10;
	optional fixed32 colorgemcolor = 11;
	optional int32 launch_tick = 12;
	optional int32 handle = 13;
	optional uint32 source = 14 [default = 16777215];
	optional int32 source_attachment = 15;
	repeated .CDOTAUserMsg_ProjectileParticleCPData particle_cp_data = 16;
	optional int64 additional_particle_system_handle = 17;
	optional int32 original_move_speed = 18;
}

message CDOTAUserMsg_TE_DestroyProjectile {
	optional int32 handle = 1;
}
`)
const projectileAttachmentsNames = [
	"",
	"attach_attack1",
	"attach_attack2",
	"attach_hitloc",
	"attach_attack3",
	"attach_attack4"
]
Events.on("ServerMessage", (msgID, buf_) => {
	switch (msgID) {
		case 471: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_CreateLinearProjectile"
				)
				const particleSystemHandle = msg.get("particle_index") as bigint
				const projectile = new LinearProjectile(
					msg.get("handle") as number,
					GetPredictionTarget(msg.get("entindex") as number),
					(particleSystemHandle !== undefined
						? GetPathByHash(particleSystemHandle)
						: undefined)!,
					particleSystemHandle ?? 0n,
					msg.get("max_speed") as number,
					msg.get("fow_radius") as number,
					msg.get("sticky_fow_reveal") as boolean,
					msg.get("distance") as number,
					CMsgVectorToVector3(msg.get("origin") as RecursiveProtobuf),
					CMsgVector2DToVector2(msg.get("velocity") as RecursiveProtobuf),
					CMsgVector2DToVector2(msg.get("acceleration") as RecursiveProtobuf),
					NumberToColor(msg.get("colorgemcolor") as number)
				)
				// TODO: do we need particle_cp_data?
				EventsSDK.emit("LinearProjectileCreated", false, projectile)
				ProjectileManager.AllLinearProjectiles.push(projectile)
				ProjectileManager.AllLinearProjectilesMap.set(projectile.ID, projectile)
			})
			break
		}
		case 472: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_DestroyLinearProjectile"
				)
				const projectile = ProjectileManager.AllLinearProjectilesMap.get(
					msg.get("handle") as number
				)
				if (projectile === undefined) {
					return
				}
				EventsSDK.emit("LinearProjectileDestroyed", false, projectile)
				ProjectileManager.AllLinearProjectiles.remove(projectile)
				ProjectileManager.AllLinearProjectilesMap.delete(projectile.ID)
			})
			break
		}
		case 473: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_DodgeTrackingProjectiles"
				)
				const ent = GetPredictionTarget(msg.get("entindex") as number)
				if (ent === undefined) {
					return
				}
				const attacksOnly = msg.get("attacks_only") as boolean
				const removedTrackingProjectiles: TrackingProjectile[] = []
				for (const proj of ProjectileManager.AllTrackingProjectiles) {
					if (
						proj.IsDodgeable &&
						proj.Target === ent &&
						(!attacksOnly || proj.IsAttack)
					) {
						proj.IsDodged = true
						if (!proj.TargetLoc.IsValid || !proj.Position.IsValid) {
							removedTrackingProjectiles.push(proj)
						}
					}
				}
				for (const proj of removedTrackingProjectiles) {
					DestroyTrackingProjectile(proj)
				}
				EventsSDK.emit("TrackingProjectilesDodged", false, ent, attacksOnly)
			})
			break
		}
		case 518: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_TE_Projectile"
				)
				const particleSystemHandle = msg.get("particle_system_handle") as bigint
				const ability = EntityManager.EntityByIndex(msg.get("ability") as number)
				const projectile = new TrackingProjectile(
					msg.get("handle") as number,
					GetPredictionTarget(msg.get("source") as number),
					GetPredictionTarget(msg.get("target") as number),
					msg.get("move_speed") as number,
					projectileAttachmentsNames[
						(msg.get("source_attachment") as Nullable<number>) ?? 0
					],
					(particleSystemHandle !== undefined
						? GetPathByHash(particleSystemHandle)
						: undefined)!,
					particleSystemHandle ?? 0n,
					msg.get("dodgeable") as boolean,
					msg.get("is_attack") as boolean,
					msg.get("expire_time") as number,
					msg.get("maximpacttime") as number,
					msg.get("launch_tick") as number,
					CMsgVectorToVector3(msg.get("target_loc") as RecursiveProtobuf),
					NumberToColor(msg.get("colorgemcolor") as number),
					msg.get("original_move_speed") as number,
					ability
				)
				TrackingProjectileCreated(projectile)
			})
			break
		}
		case 519: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_TE_ProjectileLoc"
				)
				// const source = GetPredictionTarget(msg.get("source") as number)
				const target = GetPredictionTarget(msg.get("target") as number)
				const handle = msg.get("handle") as number,
					launchTick = msg.get("launch_tick") as number,
					expireTime = msg.get("expire_time") as number,
					moveSpeed = msg.get("move_speed") as number,
					dodgeable = msg.get("dodgeable") as boolean,
					isAttack = msg.get("is_attack") as boolean,
					particleSystemHandle = msg.get("particle_system_handle") as bigint,
					targetLoc = CMsgVectorToVector3(
						msg.get("target_loc") as RecursiveProtobuf
					)
				const path = (
					particleSystemHandle !== undefined
						? GetPathByHash(particleSystemHandle)
						: undefined
				)!

				let projectile = ProjectileManager.AllTrackingProjectilesMap.get(handle)
				if (projectile === undefined) {
					projectile = new TrackingProjectile(
						handle,
						undefined,
						target,
						moveSpeed,
						"",
						path,
						particleSystemHandle ?? 0n,
						dodgeable,
						isAttack,
						expireTime,
						undefined,
						launchTick,
						targetLoc,
						NumberToColor(msg.get("colorgemcolor") as number),
						msg.get("original_move_speed") as number
					)
					// TODO: do we need particle_cp_data?
					projectile.Position.CopyFrom(
						CMsgVectorToVector3(msg.get("source_loc") as RecursiveProtobuf)
					)
					TrackingProjectileCreated(projectile)
				}
				projectile.Update(
					target,
					moveSpeed,
					path,
					particleSystemHandle ?? 0n,
					dodgeable,
					isAttack,
					expireTime,
					launchTick,
					targetLoc
				)
				EventsSDK.emit("TrackingProjectileUpdated", false, projectile)
			})
			break
		}
		case 571: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_TE_DestroyProjectile"
				)
				const projectile = ProjectileManager.AllTrackingProjectilesMap.get(
					msg.get("handle") as number
				)
				if (projectile !== undefined) {
					DestroyTrackingProjectile(projectile)
				}
			})
			break
		}
	}
})
