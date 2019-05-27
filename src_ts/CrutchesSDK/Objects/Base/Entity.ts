import { DegreesToRadian } from "../../Utils/Math";
import QAngle from "../../Base/QAngle";
import Vector3 from "../../Base/Vector3";
import { default as EntityManager, LocalPlayer } from "../../Managers/EntityManager";

/*
m_pEntity.m_flags

1 << 2 is EF_IN_STAGING_LIST
1 << 4 is EF_DELETE_IN_PROGRESS
*/
export default class Entity {
	
	/* protected */ readonly m_pBaseEntity: C_BaseEntity
	m_iIndex: number
	private m_bIsValid: boolean = false
	
	/* ============ BASE  ============ */
	
	constructor(ent?: C_BaseEntity, id: number = -1) {
		this.m_pBaseEntity = ent;
		this.m_iIndex = id;
	}
	get Angles(): QAngle {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode !== undefined)
			return QAngle.fromIOBuffer(gameSceneNode.m_angAbsRotation);
		
		return this.NetworkAngles;
	}
	get CreateTime(): number {
		return this.m_pBaseEntity.m_flCreateTime
	}
	get HP(): number {
		return this.m_pBaseEntity.m_iHealth
	}
	get Index(): number {
		return this.m_iIndex;
	}
	get IsAlive(): boolean {
		return this.LifeState === LifeState_t.LIFE_ALIVE // || this.HP === 0
	}
	get IsDormant(): boolean {
		return !this.IsVisible
	}
	get IsDOTANPC(): boolean {
		return this.m_pBaseEntity.m_bIsDOTANPC;
	}
	get IsNPC(): boolean {
		return this.m_pBaseEntity.m_bIsNPC;
	}
	set IsValid(value: boolean) {
		this.m_bIsValid = value;
	}
	get IsValid(): boolean {
		return this.m_bIsValid;
	}
	get IsVisible(): boolean {
		let ent = this.m_pBaseEntity.m_pEntity
		return ent !== undefined && (ent.m_flags & (1 << 7)) === 0
	}
	get LifeState(): LifeState_t {
		return this.m_pBaseEntity.m_lifeState
	}
	get MaxHP(): number {
		return this.m_pBaseEntity.m_iMaxHealth
	}
	get Name(): string {
		return this.m_pBaseEntity.m_pEntity.m_name || "";
	}
	get NetworkAngles(): QAngle {
		return QAngle.fromIOBuffer(this.m_pBaseEntity.m_angNetworkAngles)
	}
	get NetworkPosition(): Vector3 {
		return Vector3.fromIOBuffer(this.m_pBaseEntity.m_vecNetworkOrigin);
	}
	get NetworkRotation(): number {
		return this.m_pBaseEntity.m_angNetworkAngles ? IOBuffer[1] : 0
	}
	get NetworkRotationRad(): number {
		return DegreesToRadian(this.NetworkRotation);
	}
	get Forward(): Vector3 {
		return Vector3.FromAngle(this.NetworkRotationRad);
	}
	get Owner(): Entity {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hOwnerEntity);
	}
	get Position(): Vector3 {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode !== undefined)
			return Vector3.fromIOBuffer(gameSceneNode.m_vecAbsOrigin);

		return this.NetworkPosition;
	}
	get Rotation(): number {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode !== undefined)
			return gameSceneNode.m_angRotation ? IOBuffer[1] : 0

		return this.NetworkRotation;
	}
	get RotationRad(): number {
		return DegreesToRadian(this.Rotation);
	}
	get Scale(): number {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode === undefined)
			return 1.0

		return gameSceneNode.m_flAbsScale
	}
	/**
	 * Buffs/debuffs are not taken
	 */
	get Speed(): number {
		return this.m_pBaseEntity.m_flSpeed
	}
	get Team(): DOTATeam_t {
		return this.m_pBaseEntity.m_iTeamNum
	}
	
	toString(): string {
		return this.Name;
	}
	
	/* ============ EXTENSIONS ============ */
	
	/**
	 * @param fromCenterToCenter include hullradiuses
	 */
	Distance(vec: Vector3 | Entity): number {
		if (vec instanceof Vector3)
			return this.NetworkPosition.Distance(vec)

		return this.NetworkPosition.Distance(vec.NetworkPosition)
	}
	/**
	 * @param fromCenterToCenter include hullradiuses
	 */
	Distance2D(vec: Vector3 | Entity): number {
		if (vec instanceof Vector3)
			return this.NetworkPosition.Distance2D(vec)
			
		return this.NetworkPosition.Distance2D(vec.NetworkPosition)
	}
	/**
	 * @param fromCenterToCenter include hullradiuses
	 */
	DistanceSquared(vec: Vector3 | Entity): number {
		if (vec instanceof Vector3)
			return this.NetworkPosition.DistanceSqr(vec)
			
		return this.NetworkPosition.DistanceSqr(vec.NetworkPosition)
	}
	AngleBetweenFaces(front: Vector3) {
		return this.Forward.AngleBetweenFaces(front)
	}
	InFront(distance: number): Vector3 {
		return this.Position.Rotation(this.Forward, distance)
	}
	FindRotationAngle(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position

		let thisPos = this.Position
		let angle = Math.abs(
			Math.atan2(
				vec.y - thisPos.y,
				vec.x - thisPos.x,
			) - this.NetworkRotationRad,
		)

		if (angle > Math.PI)
			angle = Math.abs((Math.PI * 2) - angle)

		return angle
	}
	IsInRange(ent: Vector3 | Entity, range: number): boolean {
		return this.DistanceSquared(ent) < range ** 2
	}
	/**
	 * @param ent if undefined => this compare with LocalPlayer
	 */
	IsEnemy(ent: Entity = LocalPlayer): boolean {
		/* console.log("IsEnemy", ent, ent ? ent.m_pBaseEntity : undefined, LocalDOTAPlayerID);
		console.log(ent === undefined || ent.Team !== this.Team);
		console.log(new Error("asdas").stack); */
		return ent === undefined || ent.Team !== this.Team
	}
	
	Select(bAddToGroup: boolean = false): boolean {
		return SelectUnit(this.m_pBaseEntity, bAddToGroup)
	}
}

//let e=LocalDOTAPlayer,t=Date.now();for(let i=10000000;i--;)e.m_vecForward;console.log(Date.now()-t)
// Vector3.FromAngle(EntityManager.LocalHero.NetworkAngles.DegreesToRadians().Angle + Math.PI);