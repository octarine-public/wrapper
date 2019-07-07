declare class EntityManager {
	readonly AllEntities: C_BaseEntity[];
	readonly EntitiesIDs: C_BaseEntity[];
	
	GetEntityID(ent: C_BaseEntity): number
	GetEntityByID(id: number): C_BaseEntity
}
declare var Entities: EntityManager;

type Listener = (...args: any) => false | any
declare class EventEmitter {
	public on(name: string, listener: Listener): EventEmitter
	public removeListener(name: string, listener: Listener): EventEmitter
	//public removeAllListeners(): EventEmitter
	public emit(name: string, cancellable?: boolean, ...args: any[]): boolean
	public once(name: string, listener: Listener): EventEmitter
}

declare interface Events extends EventEmitter {
	on(name: "GameStarted", callback: (pl_ent: C_DOTA_BaseNPC_Hero) => void): EventEmitter
	on(name: "GameEnded", callback: () => void): EventEmitter
	on(name: "LocalPlayerTeamAssigned", callback: (team_num: number) => void): EventEmitter
	/**
	 * Also, this event emitted about ALL entities that have already been created before reloading scripts
	 */
	on(name: "EntityCreated", callback: (ent: C_BaseEntity, id: number) => void): EventEmitter
	on(name: "EntityDestroyed", callback: (ent: C_BaseEntity, id: number) => void): EventEmitter
	on(name: "WndProc", callback: (message_type: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	on(name: "Tick", callback: () => void): EventEmitter
	on(name: "Update", callback: (cmd: CUserCmd) => void): EventEmitter
	on(name: "UnitStateChanged", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	on(name: "TeamVisibilityChanged", callback: (npc: C_DOTA_BaseNPC, new_m_iTaggedAsVisibleByTeam: number) => void): EventEmitter
	on(name: "Draw", callback: () => void): EventEmitter
	on(name: "ParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target: C_BaseEntity | number) => void): EventEmitter
	on(name: "ParticleUpdated", callback: (id: number, control_point: number) => void): EventEmitter // position: Vector3 at IOBuffer offset 0
	on(name: "ParticleUpdatedEnt", callback: ( // fallback_position: Vector3 at IOBuffer offset 0
		id: number,
		control_point: number,
		ent: C_BaseEntity | number,
		attach: ParticleAttachment_t,
		attachment: number,
		include_wearables: boolean
	) => void): EventEmitter
	on(name: "BloodImpact", callback: (target: C_BaseEntity | number, scale: number, xnormal: number, ynormal: number) => void): EventEmitter
	on(name: "PrepareUnitOrders", callback: (order: CUnitOrder) => false | any): EventEmitter
	on(name: "LinearProjectileCreated", callback: ( // colorgemcolor: Color at IOBuffer offset 0
		proj: LinearProjectile,
		ent: C_BaseEntity | number,
		path: string,
		particleSystemHandle: bigint,
		max_speed: number,
		fow_radius: number,
		sticky_fow_reveal: boolean,
		distance: number
	) => void): EventEmitter
	on(name: "LinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventEmitter
	on(name: "TrackingProjectileCreated", callback: ( // colorgemcolor: Color at IOBuffer offset 0
		proj: TrackingProjectile,
		sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		maximpacttime: number,
		launch_tick: number
	) => void): EventEmitter
	on(name: "TrackingProjectileUpdated", callback: ( // vSourceLoc: Vector3 at IOBuffer offset 0, colorgemcolor: Color at IOBuffer offset 3
		proj: TrackingProjectile,
		path: string,
		particleSystemHandle: bigint,
		launch_tick: number
	) => void): EventEmitter
	on(name: "TrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventEmitter
	on(name: "TrackingProjectilesDodged", callback: (ent: C_BaseEntity | number, attacks_only: boolean) => void): EventEmitter
	on(name: "UnitAnimation", callback: (
		npc: C_DOTA_BaseNPC,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number
	) => void): EventEmitter
	on(name: "UnitAnimationEnd", callback: (
		npc: C_DOTA_BaseNPC,
		snap: boolean
	) => void): EventEmitter
	on(name: "BuffAdded", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): EventEmitter
	on(name: "BuffRemoved", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): EventEmitter
	on(name: "BuffStackCountChanged", listener: (buff: CDOTA_Buff) => void): EventEmitter
	on(name: "CustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	on(name: "NetworkFieldChanged", listener: (object: any, name: string) => void): EventEmitter
	on(name: "UnitSpeech", listener: (
		npc: C_DOTA_BaseNPC | number,
		concept: number,
		response: string,
		recipient_type: number,
		level: number,
		muteable: boolean
	) => void): EventEmitter
	on(name: "UnitSpeechMute", listener: (npc: C_DOTA_BaseNPC | number, delay: number) => void): EventEmitter
	on(name: "UnitAddGesture", listener: (
		npc: C_DOTA_BaseNPC | number,
		activity: number,
		slot: number,
		fade_in: number,
		fade_out: number,
		playback_rate: number,
		sequence_variant: number
	) => void): EventEmitter
	on(name: "UnitRemoveGesture", listener: (npc: C_DOTA_BaseNPC | number, activity: number) => void): EventEmitter
	on(name: "UnitFadeGesture", listener: (npc: C_DOTA_BaseNPC | number, activity: number) => void): EventEmitter
	on(name: "ParticleUpdatedFwd", listener: ( // forward: Vector3 at IOBuffer offset 0
		id: number,
		control_point: number
	) => void): EventEmitter
	on(name: "ParticleUpdatedOrient", listener: ( // forward: Vector3 at IOBuffer offset 0, up: Vector3 at IOBuffer offset 3, left: Vector3 at IOBuffer offset 6
		id: number,
		control_point: number
	) => void): EventEmitter 
	on(name: "ParticleUpdatedFallback", listener: ( // position: Vector3 at IOBuffer offset 0
		id: number,
		control_point: number
	) => void): EventEmitter
	on(name: "ParticleUpdatedOffset", listener: ( // origin_offset: Vector3 at IOBuffer offset 0, angle_offset: QAngle at IOBuffer offset 3
		id: number,
		control_point: number
	) => void): EventEmitter
	on(name: "ParticleDestroyed", listener: (id: number, destroy_immediately: boolean) => void): EventEmitter
	on(name: "ParticleDestroyedInvolving", listener: (
		id: number,
		destroy_immediately: boolean,
		ent: C_BaseEntity
	) => void): EventEmitter
	on(name: "ParticleReleased", listener: (id: number) => void): EventEmitter
	on(name: "ParticleUpdatedShouldDraw", listener: (id: number, should_draw: boolean) => void): EventEmitter
	on(name: "ParticleUpdatedSetFrozen", listener: (id: number, set_frozen: boolean) => void): EventEmitter
	on(name: "ParticleChangedControlPointAttachment", listener: (
		id: number,
		attachment_old: number,
		attachment_new: number,
		ent: C_BaseEntity | number
	) => void): EventEmitter
	on(name: "ParticleUpdatedEntityPosition", listener: ( // position: Vector3 at IOBuffer offset 0
		id: number,
		ent: C_BaseEntity | number
	) => void): EventEmitter
	on(name: "ParticleSetText", listener: (id: number, text: string) => void): EventEmitter
	on(name: "ParticleSetControlPointModel", listener: (
		id: number,
		control_point: number,
		model_name: string
	) => void): EventEmitter
	on(name: "ParticleSetControlPointSnapshot", listener: (
		id: number,
		control_point: number,
		snapshot_name: string
	) => void): EventEmitter
	on(name: "ParticleSetTextureAttribute", listener: (
		id: number,
		attribute_name: string,
		texture_name: string
	) => void): EventEmitter
}
declare var Events: Events
