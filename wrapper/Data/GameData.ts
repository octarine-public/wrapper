/** @description use GameState.TickInterval */
export const DefaultTickInterval = 1 / 30
/**
 * https://dota2.gamepedia.com/Attributes
 */
export const MaxManaPerIntellect = 12
export const MaxManaRegenerationPerIntellect = 0.05
export const DamageAmplifyPerIntellectPrecent = 0.07
export const BaseMagicImmunityResist = 50

const armorAmount = 0.06
export function GetArmorResistInternal(armor: number) {
	return (armorAmount * armor) / (1 + armorAmount * Math.abs(armor))
}

export let ArmorPerAgility = 1 / 6
export function SetArmorPerAgilityInternal(value: number) {
	ArmorPerAgility = value
}

export let HealthGainPerStrength = 22
export function SetHealthGainPerStrengthInternal(value: number) {
	HealthGainPerStrength = value
}

export let MagicResistPerIntellect = 1 / 10
export function SetMagicResistPerIntellectInternal(value: number) {
	MagicResistPerIntellect = value
}

export let MeleeDamageBlockAmount = 16
export function SetMeleeDamageBlockAmountInternal(value: number) {
	MeleeDamageBlockAmount = value
}

export const MoveSpeedData = new (class CMoveSpeedData {
	/**
	 * @readonly
	 */
	public readonly Max = 550
	/**
	 * @readonly
	 */
	public readonly Min = 100
})()

export const AttackSpeedData = new (class CAttackSpeedData {
	private readonly maxHaste = 7
	private readonly minHaste = 0.10000000149011612
	private readonly specialAttackDelay = 0

	/**
	 * @readonly
	 * @defaultvalue `0` default value may be changed in progress game
	 */
	public SpecialAttackDelay = this.specialAttackDelay
	/**
	 * @readonly
	 * @defaultvalue `0.10000000149011612` default value may be changed in progress game
	 */
	public MinHaste = this.minHaste
	/**
	 * @readonly
	 * @defaultvalue `7` default value may be changed in progress game
	 */
	public MaxHaste = this.maxHaste

	/**
	 * @readonly
	 * @defaultvalue `10.000000149011612` default value may be changed in progress game
	 */
	public Min = this.MinHaste * 100
	/**
	 * @readonly
	 * @defaultvalue `700` default value may be changed in progress game
	 */
	public Max = this.MaxHaste * 100

	public SetMinMaxFactorInternal(min: number, max: number, special = 0) {
		const minVal = Math.max(min, this.minHaste),
			maxVal = Math.max(max, this.maxHaste)
		this.Min = minVal * 100
		this.Max = maxVal * 100
		this.MinHaste = minVal
		this.MaxHaste = maxVal
		this.SpecialAttackDelay = special
	}
})()

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
	 * @defaultvalue `4` default value may be changed in progress game
	 * @description Represents the number of minutes between each spawn of bounty runes.
	 * @description spawn bounty runes every x minutes
	 */
	public BountySpawnEveryMinutes: number = 4

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
