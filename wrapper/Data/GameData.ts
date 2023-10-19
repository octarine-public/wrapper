export const AegisExpirationTime = 300

export const BuybackCooldown = 480

export const CreepSpeed = 325

export const RoshanMaxRespawnTime = 660

export const RoshanMinRespawnTime = 480

export const RuneRespawnTime = 120

export const ScanActiveTime = 8

export const ScanRadius = 900

/**
 * https://dota2.gamepedia.com/Attributes
 */
export const ArmorPerAgility = 1 / 6
export const DamageAmplifyPerIntellectPrecent = 0.07
export const MaxManaPerIntellect = 12
export const MaxManaRegenerationPerIntellect = 0.05

export const HealthGainPerStrength = 20

export const HurricanePikeBonusAttackSpeed = 100

export const MaxAttackSpeed = 700

export const MaxMovementSpeed = 550

export const MinAttackSpeed = 20

export const Runes = new (class CDataRune {
	/**
	 * @readonly
	 * @defaultvalue `7` default value may be changed in progress game
	 * @description Represents the number of minutes between each spawn of XP runes.
	 * @description spawn XP runes every x minutes
	 */
	public XPSpawnEveryMinutes: number = 7

	/**
	 * @readonly
	 * @defaultvalue `3` default value may be changed in progress game
	 * @description Represents the number of minutes between each spawn of bounty runes.
	 * @description spawn bounty runes every x minutes
	 */
	public BountySpawnEveryMinutes: number = 3

	/**
	 * @readonly
	 * @defaultvalue `2` default value may be changed in progress game
	 * @description Represents the number of minutes between each spawn of Powerup runes.
	 * @description spawn Powerup runes every x minutes
	 */
	public PowerUpSpawnEveryMinutes: number = 2

	/**
	 * @readonly
	 * @defaultvalue `420` default value may be changed in progress game
	 * @description Represents the number of seconds between each spawn of XP runes.
	 * @description spawn XP runes every x seconds
	 */
	public XPSpawnEverySeconds: number = this.XPSpawnEveryMinutes * 60

	/**
	 * @readonly
	 * @defaultvalue `180` default value may be changed in progress game
	 * @description Represents the number of minutes between each spawn of bounty runes.
	 * @description spawn bounty runes every x seconds
	 */
	public BountySpawnEverySeconds: number = this.BountySpawnEveryMinutes * 60

	/**
	 * @readonly
	 * @defaultvalue `120` default value may be changed in progress game
	 * @description Represents the number of seconds between each spawn of Powerup runes.
	 * @description spawn Powerup runes every x seconds
	 */
	public PowerUpSpawnEverySeconds: number = this.PowerUpSpawnEveryMinutes * 60

	/** @description Initial gold earned before the first 5 minutes */
	public readonly InitialGold: number = 40

	/** @description Additional gold earned per minute after the first 5 minutes */
	public readonly GoldPerMinute: number = 9

	/** @description Initial gold earned after 5 minutes */
	public readonly GoldAfterFiveMinute: number = 36

	/**
	 * Calculates the total gold earned based on the game time.
	 * @param gameTime - The total game time in seconds.
	 * @param goldAfterFiveMinute - The initial gold earned after 5 minutes.
	 * @param goldPerMinute - The additional gold earned per minute after the first 5 minutes.
	 * @param initialGold - The initial gold earned before the first 5 minutes.
	 * @description https://dota2.fandom.com/wiki/Gold#Bounty_Rune
	 * @returns {number}
	 */
	public CalculateGoldBountyByTime(
		gameTime: number,
		goldAfterFiveMinute: number = this.GoldAfterFiveMinute,
		goldPerMinute: number = this.GoldPerMinute,
		initialGold: number = this.InitialGold
	): number {
		// Convert game time to minutes
		const gameTimeInMinutes = Math.floor(gameTime / 60)
		// If game time is less than 5 minutes, return initial gold
		if (gameTimeInMinutes < 5) {
			return initialGold
		}
		// Calculate elapsed minutes after the first 5 minutes
		const elapsedMinutes = Math.floor(gameTimeInMinutes / 5)
		// Calculate additional gold earned based on elapsed minutes
		const additionalGold = elapsedMinutes * goldPerMinute
		// Calculate total gold earned
		return goldAfterFiveMinute + additionalGold
	}
})()
