declare class EntityManager {
	public readonly AllEntities: C_BaseEntity[];
	public readonly EntitiesIDs: C_BaseEntity[];
	
	public GetEntityID(ent: C_BaseEntity): number
	public GetEntityByID(id: number): C_BaseEntity
}
declare var Entities: EntityManager;

type Listener = (...args: any) => false | any
declare class EventEmitter {
	public on(name: string, listener: Listener): EventEmitter
	public after(name: string, listener: Listener): EventEmitter
	public removeListener(name: string, listener: Listener): EventEmitter
	//public removeAllListeners(): EventEmitter
	public emit(name: string, cancellable?: boolean, ...args: any[]): boolean
	public once(name: string, listener: Listener): EventEmitter
}

declare interface Events extends EventEmitter {
	on(name: "UIStateChanged", callback: (new_state: number) => void): EventEmitter
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
	on(name: "LinearProjectileCreated", callback: ( // origin: Vector3 at IOBuffer offset 0, velocity: Vector2 at IOBuffer offset 3, acceleration: Vector2 at IOBuffer offset 5, colorgemcolor: Color at IOBuffer offset 7
		proj: number,
		ent: C_BaseEntity | number,
		path: string,
		particleSystemHandle: bigint,
		max_speed: number,
		fow_radius: number,
		sticky_fow_reveal: boolean,
		distance: number
	) => void): EventEmitter
	on(name: "LinearProjectileDestroyed", callback: (proj: number) => void): EventEmitter
	on(name: "TrackingProjectileCreated", callback: ( // vTargetLoc: Vector3 at IOBuffer offset 0, colorgemcolor: Color at IOBuffer offset 3
		proj: number,
		hSource: C_BaseEntity | number,
		hTarget: C_BaseEntity | number,
		moveSpeed: number,
		sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		dodgeable: boolean,
		isAttack: boolean,
		expireTime: number,
		maximpacttime: number,
		launch_tick: number
	) => void): EventEmitter
	on(name: "TrackingProjectileUpdated", callback: ( // vSourceLoc: Vector3 at IOBuffer offset 0, vTargetLoc: Vector3 at IOBuffer offset 3, colorgemcolor: Color at IOBuffer offset 6
		proj: number,
		hTarget: C_BaseEntity | number,
		moveSpeed: number,
		path: string,
		particleSystemHandle: bigint,
		dodgeable: boolean,
		isAttack: boolean,
		expireTime: number,
		launch_tick: number
	) => void): EventEmitter
	on(name: "TrackingProjectileDestroyed", callback: (proj: number) => void): EventEmitter
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
	on(name: "ServerTick", listener: (
		tick: number,
		host_frametime: number,
		host_frametime_std_deviation: number,
		host_computationtime: number,
		host_computationtime_std_deviation: number,
		host_framestarttime_std_deviation: number,
		host_loss: number
	) => void): EventEmitter
	on(name: "NetworkPositionsChanged", listener: (vecs: CNetworkOriginCellCoordQuantizedVector[]) => void): EventEmitter
	on(name: "GameSceneNodesChanged", listener: (vecs: CNetworkOriginCellCoordQuantizedVector[]) => void): EventEmitter
	on(name: "InputCaptured", listener: (is_captured: boolean) => void): EventEmitter
	on(name: "NetworkFieldsChanged", listener: (
		map: Map<C_BaseEntity, Map<any, Array<[string, string, number]>>> // 1st key: entity, 2nd: trigger, values: [field_name, field_type, array_index]
	) => void): EventEmitter
	on(name: "SetEntityName", listener: (ent: C_BaseEntity, new_name: string) => void): EventEmitter
	on(name: "SharedObjectChanged", listener: (id: number, reason: number, uuid: bigint, obj: any) => void): EventEmitter
}
declare var Events: Events
