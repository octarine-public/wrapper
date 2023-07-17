import { AABB } from "../../Base/AABB"
import { Color } from "../../Base/Color"
import { EntityPropertiesNode } from "../../Base/EntityProperties"
import { QAngle } from "../../Base/QAngle"
import { Vector2 } from "../../Base/Vector2"
import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { LifeState } from "../../Enums/LifeState"
import { RenderMode } from "../../Enums/RenderMode"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { Events } from "../../Managers/Events"
import { EventsSDK } from "../../Managers/EventsSDK"
import * as StringTables from "../../Managers/StringTables"
import { RendererSDK } from "../../Native/RendererSDK"
import { Player } from "../../Objects/Base/Player"
import { FieldHandler, RegisterFieldHandler } from "../../Objects/NativeToSDK"
import {
	ComputeAttachmentsAndBoundsAsync,
	ComputedAttachment,
	ComputedAttachments,
} from "../../Resources/ComputeAttachments"
import { GameState } from "../../Utils/GameState"
import { DegreesToRadian } from "../../Utils/Math"
import { CGameRules } from "./GameRules"
import { Item } from "./Item"

export var LocalPlayer: Nullable<Player>
let playerSlot = NaN
EventsSDK.on(
	"ServerInfo",
	info => (playerSlot = (info.get("player_slot") as number) ?? NaN)
)
let gameInProgress = false
const modelDataCache = new Map<
	string,
	Promise<[ComputedAttachments, Vector3, Vector3]>
>()
function SetGameInProgress(newVal: boolean) {
	if (!gameInProgress && newVal) EventsSDK.emit("GameStarted", false)
	else if (gameInProgress && !newVal) {
		EventsSDK.emit("GameEnded", false)
		if (IS_MAIN_WORKER) Particles.DeleteAll()
		RendererSDK.FreeTextureCache()
	}
	gameInProgress = newVal
}
EventsSDK.on("PreEntityCreated", ent => {
	if (ent.Index === playerSlot + 1) {
		LocalPlayer = ent as Player
		SetGameInProgress(true)
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent === LocalPlayer) {
		LocalPlayer = undefined
		SetGameInProgress(false)
	}
})
export let GameRules: Nullable<CGameRules>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent.IsGameRules) GameRules = ent as CGameRules
})
EventsSDK.on("EntityDestroyed", ent => {
	if (!ent.IsGameRules) return
	GameRules = undefined
	GameState.RawGameTime = 0
})

const activity2name = new Map<GameActivity, string>(
	Object.entries(GameActivity).map(([k, v]) => [v as GameActivity, k])
)
@WrapperClass("CBaseEntity")
export class Entity {
	public IsValid = true
	public Name_ = ""
	@NetworkedBasicField("m_flCreateTime")
	public CreateTime_ = 0
	public FakeCreateTime_ = GameState.RawGameTime
	public Team = Team.None
	public LifeState = LifeState.LIFE_DEAD
	@NetworkedBasicField("m_iHealth")
	public HP = 0
	@NetworkedBasicField("m_iMaxHealth")
	public MaxHP = 0
	public ClassName = ""
	public BecameDormantTime = 0
	public ModelName = ""
	@NetworkedBasicField("m_flScale")
	public ModelScale = 1
	@NetworkedBasicField("m_flPlaybackRate")
	public PlaybackRate = 1
	public Agility = 0
	public Intellect = 0
	public Strength = 0
	public TotalAgility = 0
	public TotalIntellect = 0
	public TotalStrength = 0
	public Owner_ = 0
	public OwnerEntity: Nullable<Entity> = undefined
	@NetworkedBasicField("CBodyComponent")
	public CBodyComponent_: Nullable<EntityPropertiesNode> = undefined
	public IsVisible = true
	public DeltaZ = 0
	public RotationDifference = 0
	public AnimationTime = 0
	public FieldHandlers_: Nullable<Map<number, FieldHandler>>
	public Properties_ = new EntityPropertiesNode()
	public readonly VisualPosition = new Vector3()
	public readonly NetworkedPosition = new Vector3().Invalidate()
	public readonly VisualAngles = new QAngle()
	public readonly NetworkedAngles = new QAngle()
	public readonly BoundingBox = new AABB(this.VisualPosition)
	public readonly SpawnPosition = new Vector3()
	public Attachments: Nullable<ComputedAttachments>
	private CustomGlowColor_: Nullable<Color>
	private CustomDrawColor_: Nullable<[Color, RenderMode]>
	private RingRadius_ = 30

	constructor(public readonly Index: number, private readonly Serial: number) {
		this._ChangeNetworkPosition()
	}

	public get CustomGlowColor(): Nullable<Color> {
		return this.CustomGlowColor_
	}
	public set CustomGlowColor(val: Nullable<Color>) {
		if (this.CustomGlowColor_ === undefined && val === undefined) return
		this.CustomGlowColor_ = val
		lastGlowEnts.add(this)
	}
	public get CustomDrawColor(): Nullable<[Color, RenderMode]> {
		return this.CustomDrawColor_
	}
	public set CustomDrawColor(val: Nullable<[Color, RenderMode]>) {
		if (this.CustomDrawColor_ === undefined && val === undefined) return
		this.CustomDrawColor_ = val
		lastColoredEnts.add(this)
	}
	public get Name(): string {
		return this.Name_
	}
	public get Owner(): Nullable<Entity> {
		return this.OwnerEntity
	}
	public get RootOwner(): Nullable<Entity> {
		let owner = this.Owner
		while (true) {
			const rootOwner = owner?.Owner
			if (rootOwner === undefined) break

			owner = rootOwner
		}
		return owner
	}
	public get Position(): Vector3 {
		return this.RealPosition
	}

	public get RealPosition(): Vector3 {
		return GameState.IsInDraw ? this.VisualPosition : this.NetworkedPosition
	}

	public get Angles(): QAngle {
		return GameState.IsInDraw ? this.VisualAngles : this.NetworkedAngles
	}
	public get NetworkedRotation(): number {
		const ang = this.NetworkedAngles.y
		if (ang >= 180) return ang - 360
		return ang
	}
	public get Rotation(): number {
		const ang = this.Angles.y
		if (ang >= 180) return ang - 360
		return ang
	}
	public get CreateTime() {
		return this.CreateTime_ !== 0 ? this.CreateTime_ : this.FakeCreateTime_
	}
	public get HPPercent(): number {
		return Math.floor((this.HP / this.MaxHP) * 100) || 0
	}
	public get IsAlive(): boolean {
		return (
			this.LifeState === LifeState.LIFE_ALIVE ||
			this.LifeState === LifeState.LIFE_RESPAWNING
		)
	}
	public get Forward(): Vector3 {
		return Vector3.FromAngle(this.RotationRad)
	}
	public get RotationRad(): number {
		return DegreesToRadian(this.Rotation)
	}
	public get NetworkedRotationRad(): number {
		return DegreesToRadian(this.NetworkedRotation)
	}
	public get IsNeutral(): boolean {
		return this.Team === Team.Neutral || this.Team === Team.Shop
	}

	public get Speed(): number {
		return 0
	}
	public get CollisionRadius(): number {
		return 20 // TODO: native crutch broke, we need to completely rewrite that in TS
	}
	public get ProjectileCollisionSize(): number {
		return this.CollisionRadius
	}
	public get RingRadius(): number {
		return this.RingRadius_
	}
	public get IsGameRules(): boolean {
		return false
	}
	public get IsShop(): boolean {
		return false
	}
	public get IsHero(): boolean {
		return false
	}
	public get CustomNativeID(): number {
		return this.Index << 1
	}

	public get Handle(): number {
		return (this.Serial << EntityManager.INDEX_BITS) | this.Index
	}

	public SerialMatches(serial: number): boolean {
		return serial === 0 || this.Serial === 0 || serial === this.Serial
	}
	public HandleMatches(handle: number): boolean {
		const index = handle & EntityManager.INDEX_MASK
		const serial =
			(handle >> EntityManager.INDEX_BITS) & EntityManager.SERIAL_MASK
		return this.Index === index && this.SerialMatches(serial)
	}
	public EntityMatches(ent: Entity): boolean {
		return this === ent
	}
	public Distance(vec: Vector3 | Entity): number {
		if (vec instanceof Entity) vec = vec.Position
		return this.Position.Distance(vec)
	}
	public Distance2D(vec: Vector3 | Vector2 | Entity): number {
		if (vec instanceof Entity) vec = vec.Position
		return this.Position.Distance2D(vec)
	}
	public DistanceSqr(vec: Vector3 | Entity): number {
		if (vec instanceof Entity) vec = vec.Position
		return this.Position.DistanceSqr(vec)
	}
	public DistanceSqr2D(vec: Vector3 | Vector2 | Entity): number {
		if (vec instanceof Entity) vec = vec.Position
		return this.Position.DistanceSqr2D(vec)
	}
	public AngleBetweenFaces(front: Vector3): number {
		return this.Forward.AngleBetweenFaces(front)
	}
	public InFront(distance: number): Vector3 {
		return this.Position.Rotation(this.Forward, distance)
	}
	public InFrontFromAngle(angle: number, distance: number): Vector3 {
		return this.Position.InFrontFromAngle(this.RotationRad + angle, distance)
	}
	public FindRotationAngle(vec: Vector3 | Entity): number {
		if (vec instanceof Entity) vec = vec.Position
		return this.Position.FindRotationAngle(vec, this.RotationRad)
	}
	/**
	 * That's a bit faster than just checking this.Distance(ent) < range,
	 * since square root is omitted, and square of number is easier to calculate
	 * than square root
	 */
	public IsInRange(ent: Vector3 | Vector2 | Entity, range: number): boolean {
		return this.DistanceSqr2D(ent) < range ** 2
	}
	public Closest(ents: Entity[]): Entity {
		const thisPos = this.Position

		let entity: Nullable<Entity>
		let distance = Number.POSITIVE_INFINITY

		ents.forEach(ent => {
			const tempDist = ent.Distance(thisPos)
			if (tempDist < distance) {
				distance = tempDist
				entity = ent
			}
		})

		return entity as Entity
	}
	/**
	 * @example
	 * unit.ClosestGroup(groups, group => Vector3.GetCenterType(creeps, creep => creep.InFront(200)))
	 */
	public ClosestGroup(
		groups: Entity[][],
		callback: (entity: Entity[]) => Vector3
	): [Entity[], Vector3] {
		const thisPos = this.Position

		let entities: Entity[] = []
		let vec = new Vector3()
		let distance = Number.POSITIVE_INFINITY

		groups.forEach(group => {
			const tempVec = callback(group)
			const tempDist = thisPos.Distance(tempVec)

			if (tempDist < distance) {
				distance = tempDist
				entities = group
				vec = tempVec
			}
		})
		return [entities, vec]
	}
	/**
	 * @param ent optional, defaults to LocalPlayer
	 */
	public IsEnemy(ent?: Entity): boolean {
		const team = ent?.Team ?? GameState.LocalTeam
		return this.Team !== team
	}

	public OnModelUpdated(): void {
		const initialRadius = this.RingRadius !== 0 ? this.RingRadius : 50
		const min = this.BoundingBox.MinOffset,
			max = this.BoundingBox.MaxOffset
		min.x = -initialRadius
		min.y = -initialRadius
		min.z = 0
		max.x = initialRadius
		max.y = initialRadius
		max.z = initialRadius
		if (this.ModelName === "") return
		let promise = modelDataCache.get(this.ModelName)
		if (promise === undefined) {
			promise = ComputeAttachmentsAndBoundsAsync(this.ModelName)
			modelDataCache.set(this.ModelName, promise)
		}

		promise.then(
			ar => {
				this.Attachments = ar[0]
				this.BoundingBox.MinOffset.CopyFrom(ar[1])
				this.BoundingBox.MaxOffset.CopyFrom(ar[2])
				const minXY = Math.min(min.x, min.y, max.x, max.y),
					maxXY = Math.max(min.x, min.y, max.x, max.y)
				this.RingRadius_ = Math.max(Math.abs(minXY), Math.abs(maxXY))
				min.x = -this.RingRadius
				min.y = -this.RingRadius
				max.x = this.RingRadius
				max.y = this.RingRadius
			},
			err => console.error(this.ModelName, err)
		)
	}

	public CalculateActivityModifiers(
		_activity: GameActivity,
		_ar: string[]
	): void {
		// to be implemented in child classes
	}

	public GetSequenceActivityModifiers(
		activity = GameActivity.ACT_DOTA_IDLE,
		sequenceNum = -1
	): Map<string, number> | undefined {
		if (this.Attachments === undefined || this.Attachments.length === 0)
			return undefined
		const activityName = activity2name.get(activity)
		if (sequenceNum >= 0 && activityName !== undefined) {
			let i = 0
			for (const attachment of this.Attachments)
				if (attachment[0].has(activityName) && i++ === sequenceNum)
					return attachment[0]
		}
		return undefined
	}

	public GetAttachments(
		activity = GameActivity.ACT_DOTA_IDLE,
		sequenceNum = -1
	): Nullable<Map<string, ComputedAttachment>> {
		if (this.Attachments === undefined || this.Attachments.length === 0)
			return undefined
		const activityName = activity2name.get(activity)
		if (sequenceNum >= 0 && activityName !== undefined) {
			let i = 0
			for (const attachment of this.Attachments)
				if (attachment[0].has(activityName) && i++ === sequenceNum)
					return attachment[1]
		}
		const modifiers: string[] = []
		if (activityName !== undefined) modifiers.push(activityName)
		this.CalculateActivityModifiers(activity, modifiers)
		let highestScore = 0,
			highestScored: Nullable<Map<string, ComputedAttachment>>
		for (const ar of this.Attachments) {
			const score =
				modifiers.reduce((prev, name) => prev + (ar[0].get(name) ?? 0), 0) /
				ar[0].size
			if (score > highestScore) {
				highestScore = score
				highestScored = ar[1]
			}
		}
		if (highestScored !== undefined) {
			const defaultAr = this.Attachments.find(ar =>
				ar[0].has("ACT_DOTA_CONSTANT_LAYER")
			)
			if (defaultAr !== undefined) highestScored = defaultAr[1]
		}
		return highestScored
	}

	public GetAttachment(
		name: string,
		activity = GameActivity.ACT_DOTA_IDLE,
		sequenceNum = -1
	): Nullable<ComputedAttachment> {
		return this.GetAttachments(activity, sequenceNum)?.get(name)
	}

	/**
	 * @returns attachment position mid-animation
	 */
	public GetAttachmentPosition(
		name: string,
		activity = GameActivity.ACT_DOTA_IDLE,
		sequenceNum = -1
	): Nullable<Vector3> {
		const attachment = this.GetAttachment(name, activity, sequenceNum)
		if (attachment === undefined) return undefined
		return attachment.GetPosition(
			attachment.FrameCount / attachment.FPS / 2,
			this.RotationRad,
			this.ModelScale
		)
	}
	/**
	 * @deprecated
	 */
	public ForwardNativeProperties(
		_healthBarOffset: number,
		_moveCapabilities: number,
		_absPosition: Vector3
	) {
		// To be implemented in child classes
		this._ChangeNetworkPosition()
	}

	public CannotUseItem(_item: Item): boolean {
		return false
	}

	public toString(): string {
		return this.Name
	}

	public _ChangeNetworkPosition() {
		if (this.NetworkedPosition.Length < this.VisualPosition.Length) {
			this.NetworkedPosition.CopyFrom(this.VisualPosition)
		}
	}
}

function QuantitizedVecCoordToCoord(
	cell: Nullable<number>,
	inside: Nullable<number>
): number {
	return ((cell ?? 0) - 128) * 128 + (inside ?? 0)
}

RegisterFieldHandler(Entity, "m_iTeamNum", (ent, newVal) => {
	const oldTeam = ent.Team
	ent.Team = newVal as Team
	if (ent.IsValid && oldTeam !== ent.Team)
		EventsSDK.emit("EntityTeamChanged", false, ent)
})
RegisterFieldHandler(Entity, "m_lifeState", (ent, newVal) => {
	const oldState = ent.LifeState
	ent.LifeState = newVal as LifeState
	if (ent.IsValid && oldState !== ent.LifeState)
		EventsSDK.emit("LifeStateChanged", false, ent)
})
RegisterFieldHandler(Entity, "m_hModel", (ent, newVal) => {
	ent.ModelName = GetPathByHash(newVal as bigint) ?? ""
	ent.OnModelUpdated()
})
EventsSDK.on("GameEnded", () => modelDataCache.clear())
RegisterFieldHandler(Entity, "m_angRotation", (ent, newVal) => {
	const angRotation = newVal as QAngle
	ent.NetworkedAngles.CopyFrom(angRotation)
	ent.VisualAngles.CopyFrom(angRotation)
})
RegisterFieldHandler(Entity, "m_nameStringableIndex", (ent, newVal) => {
	ent.Name_ =
		StringTables.GetString("EntityNames", newVal as number) ?? ent.Name_
})

RegisterFieldHandler(Entity, "m_hOwnerEntity", (ent, newVal) => {
	ent.Owner_ = newVal as number
	ent.OwnerEntity = EntityManager.EntityByIndex(ent.Owner_)
})

EventsSDK.on("PreEntityCreated", ent => {
	ent.SpawnPosition.CopyFrom(ent.NetworkedPosition)
	if (ent.Index === 0) return
	for (const iter of EntityManager.AllEntities)
		if (ent.HandleMatches(iter.Owner_)) iter.OwnerEntity = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent.Index === 0) return
	for (const iter of EntityManager.AllEntities)
		if (ent.HandleMatches(iter.Owner_)) iter.OwnerEntity = undefined
})

RegisterFieldHandler(Entity, "m_cellX", (ent, newVal) => {
	ent.NetworkedPosition.x = ent.VisualPosition.x = QuantitizedVecCoordToCoord(
		newVal as number,
		ent.CBodyComponent_?.get("m_vecX") as Nullable<number>
	)
	ent._ChangeNetworkPosition()
})
RegisterFieldHandler(Entity, "m_vecX", (ent, newVal) => {
	ent.NetworkedPosition.x = ent.VisualPosition.x = QuantitizedVecCoordToCoord(
		ent.CBodyComponent_?.get("m_cellX") as Nullable<number>,
		newVal as number
	)
	ent._ChangeNetworkPosition()
})
RegisterFieldHandler(Entity, "m_cellY", (ent, newVal) => {
	ent.NetworkedPosition.y = ent.VisualPosition.y = QuantitizedVecCoordToCoord(
		newVal as number,
		ent.CBodyComponent_?.get("m_vecY") as Nullable<number>
	)
	ent._ChangeNetworkPosition()
})
RegisterFieldHandler(Entity, "m_vecY", (ent, newVal) => {
	ent.NetworkedPosition.y = ent.VisualPosition.y = QuantitizedVecCoordToCoord(
		ent.CBodyComponent_?.get("m_cellY") as Nullable<number>,
		newVal as number
	)
	ent._ChangeNetworkPosition()
})
RegisterFieldHandler(Entity, "m_cellZ", (ent, newVal) => {
	ent.NetworkedPosition.z = ent.VisualPosition.z = QuantitizedVecCoordToCoord(
		newVal as number,
		ent.CBodyComponent_?.get("m_vecZ") as Nullable<number>
	)
	ent._ChangeNetworkPosition()
})
RegisterFieldHandler(Entity, "m_vecZ", (ent, newVal) => {
	ent.NetworkedPosition.z = ent.VisualPosition.z = QuantitizedVecCoordToCoord(
		ent.CBodyComponent_?.get("m_cellZ") as Nullable<number>,
		newVal as number
	)
	ent._ChangeNetworkPosition()
})

EventsSDK.on("GameEvent", (name, obj) => {
	switch (name) {
		case "entity_hurt": {
			const ent = EntityManager.EntityByIndex(obj.entindex_killed)
			if (ent !== undefined && ent.IsAlive)
				ent.HP = Math.max(Math.round(ent.HP - obj.damage), 1)
			break
		}
		case "entity_killed": {
			const ent = EntityManager.EntityByIndex(obj.entindex_killed)
			if (
				ent !== undefined &&
				!ent.IsVisible &&
				ent.LifeState !== LifeState.LIFE_DEAD
			) {
				ent.LifeState = LifeState.LIFE_DEAD
				ent.HP = 0
				EventsSDK.emit("LifeStateChanged", false, ent)
			}
			break
		}
		case "dota_buyback": {
			const ent = EntityManager.EntityByIndex(obj.entindex)
			if (ent !== undefined && ent.LifeState === LifeState.LIFE_DEAD) {
				ent.LifeState = LifeState.LIFE_ALIVE
				ent.HP = ent.MaxHP
				EventsSDK.emit("LifeStateChanged", false, ent)
			}
		}
		default:
			break
	}
})

const lastGlowEnts = new Set<Entity>()
function CustomGlowEnts(): void {
	for (const ent of lastGlowEnts) {
		if (!ent.IsValid) {
			lastGlowEnts.delete(ent)
			continue
		}
		const customID = ent.CustomNativeID
		const customGlowColor = ent.CustomGlowColor
		let colorU32 = 0
		if (customGlowColor !== undefined) colorU32 = customGlowColor.toUint32()
		else lastGlowEnts.delete(ent)
		SetEntityGlow(customID, colorU32)
	}
}

const lastColoredEnts = new Set<Entity>()
function CustomColorEnts(): void {
	for (const ent of lastColoredEnts) {
		if (!ent.IsValid) {
			lastColoredEnts.delete(ent)
			continue
		}
		const customDrawColor = ent.CustomDrawColor
		let colorU32 = 0,
			renderMode = RenderMode.Normal
		if (customDrawColor !== undefined) {
			colorU32 = customDrawColor[0].toUint32()
			renderMode = customDrawColor[1]
		} else {
			colorU32 = Color.White.toUint32()
			lastColoredEnts.delete(ent)
		}
		SetEntityColor(ent.CustomNativeID, colorU32, renderMode)
	}
}

EventsSDK.after("PostDataUpdate", () => {
	CustomColorEnts()
	CustomGlowEnts()
})
Events.on("NewConnection", () => {
	lastGlowEnts.clear()
	lastColoredEnts.clear()
})
