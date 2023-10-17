import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Team } from "../Enums/Team"
import { RendererSDK } from "../Native/RendererSDK"
import { GameRules } from "../Objects/Base/Entity"
import { PlayerResource } from "../Objects/Base/PlayerResource"
import { ScaleHeight, ScaleWidth } from "./Helpers"

export class CPreGame {
	private static get HasRadiantCoach(): boolean {
		return (
			PlayerResource?.PlayerData?.some(
				data => data !== undefined && data.CoachTeam === Team.Radiant
			) ?? false
		)
	}
	private static get HasDireCoach(): boolean {
		return (
			PlayerResource?.PlayerData?.some(
				data => data !== undefined && data.CoachTeam === Team.Dire
			) ?? false
		)
	}
	private static get IsEmptyGameMode(): boolean {
		return (GameRules?.GameMode ?? 0) === 0
	}

	public readonly Center = new Rectangle()
	public readonly RadiantCoach = new Rectangle()
	public readonly DireCoach = new Rectangle()
	public readonly RadiantPlayersNames: Rectangle[] = []
	public readonly DirePlayersNames: Rectangle[] = []
	public readonly RadiantPlayersHeroImages: Rectangle[] = []
	public readonly DirePlayersHeroImages: Rectangle[] = []
	public readonly RadiantPlayersRoles: Rectangle[] = []
	public readonly DirePlayersRoles: Rectangle[] = []
	public readonly HasRadiantCoach = CPreGame.HasRadiantCoach
	public readonly HasDireCoach = CPreGame.HasDireCoach
	private readonly RadiantPlayers: Rectangle[] = []
	private readonly DirePlayers: Rectangle[] = []
	private readonly IsEmptyGameMode = CPreGame.IsEmptyGameMode

	constructor(screenSize: Vector2) {
		const aspectRatio = RendererSDK.GetAspectRatio(screenSize)
		this.CalculateCenter(screenSize, aspectRatio)
		this.CalculateCoachesAndPlayers(screenSize, aspectRatio)
		this.CalculateNames(screenSize, aspectRatio)
		this.CalculateHeroImages(screenSize, aspectRatio)
		this.CalculateRoles(screenSize)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.Center.pos1, this.Center.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(
			this.RadiantCoach.pos1,
			this.RadiantCoach.Size,
			Color.Aqua.SetA(128)
		)
		RendererSDK.FilledRect(
			this.DireCoach.pos1,
			this.DireCoach.Size,
			Color.Aqua.SetA(128)
		)

		for (const rect of this.RadiantPlayersNames) {
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Yellow.SetA(128))
		}
		for (const rect of this.DirePlayersNames) {
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Yellow.SetA(128))
		}

		this.RadiantPlayersHeroImages.forEach((rect, i) =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, new Color(50, 50 * i, 0, 128))
		)
		this.DirePlayersHeroImages.forEach((rect, i) =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, new Color(50 * i, 0, 50, 128))
		)

		for (const rect of this.RadiantPlayersRoles) {
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Green.SetA(128))
		}
		for (const rect of this.DirePlayersRoles) {
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Green.SetA(128))
		}
	}
	public HasChanged(): boolean {
		return (
			this.HasRadiantCoach !== CPreGame.HasRadiantCoach ||
			this.HasDireCoach !== CPreGame.HasDireCoach ||
			this.IsEmptyGameMode !== CPreGame.IsEmptyGameMode
		)
	}

	private CalculateCenter(screenSize: Vector2, aspectRatio: string): void {
		this.Center.Width = ScaleWidth(aspectRatio === "16x10" ? 300 : 250, screenSize)
		this.Center.Height = ScaleHeight(88, screenSize)
		this.Center.x = Math.round((screenSize.x - this.Center.Width) / 2)

		// No clue how pregame aligns center, but this seem to fix it for several resolutions
		if (this.IsEmptyGameMode) {
			if (aspectRatio === "4x3") {
				this.Center.x += ScaleWidth(4, screenSize)
			}
			if (
				(screenSize.x === 720 && screenSize.y === 576) ||
				(screenSize.x === 720 && screenSize.y === 480) ||
				(screenSize.x === 640 && screenSize.y === 480)
			) {
				this.Center.x -= 1
			}
		}
	}
	private CalculateCoachesAndPlayers(screenSize: Vector2, aspectRatio: string): void {
		const coachMargin = ScaleWidth(10, screenSize),
			coachWidth = ScaleHeight(80, screenSize),
			coachHeight = ScaleHeight(50, screenSize),
			playersContainerMargin = ScaleWidth(8, screenSize),
			playerMargin = ScaleWidth(aspectRatio === "4x3" ? -4 : -2, screenSize),
			playerWidth = ScaleWidth(aspectRatio === "4x3" ? 110 : 128, screenSize)

		{
			let currentPos = this.Center.x
			if (this.HasRadiantCoach) {
				this.RadiantCoach.Width = coachWidth
				this.RadiantCoach.Height = coachHeight

				this.RadiantCoach.x = currentPos - this.RadiantCoach.Width + coachMargin
				currentPos = this.RadiantCoach.x + coachMargin
			}
			currentPos -= playersContainerMargin
			for (let i = 0; i < 5; i++) {
				const playerRect = new Rectangle()
				playerRect.Width = playerWidth
				playerRect.Height = 0
				// No clue why, but on 4:3 resolutions gap between 1st and 2nd radiant players
				// is bigger than other ones.
				if (aspectRatio === "4x3" && i === 4 && this.IsEmptyGameMode) {
					currentPos -= ScaleWidth(9, screenSize)
				}
				playerRect.x = currentPos - playerRect.Width - playerMargin
				currentPos = playerRect.x - playerMargin
				this.RadiantPlayers.push(playerRect)
			}
			this.RadiantPlayers.reverse()
		}

		{
			let currentPos = this.Center.x + this.Center.Width
			if (this.HasDireCoach) {
				this.DireCoach.Width = coachWidth
				this.DireCoach.Height = coachHeight

				this.DireCoach.x = currentPos - coachMargin
				currentPos = this.DireCoach.x + this.DireCoach.Width - coachMargin
			}
			currentPos += playersContainerMargin
			for (let i = 0; i < 5; i++) {
				const playerRect = new Rectangle()
				playerRect.Width = playerWidth
				playerRect.Height = 0
				playerRect.x = currentPos + playerMargin
				currentPos = playerRect.x + playerMargin + playerWidth
				this.DirePlayers.push(playerRect)
			}
		}
	}
	private CalculateBar(
		playerRect: Rectangle,
		rectWidth: number,
		rectHeight: number,
		rectMarginBottom: number,
		rectMargin: number,
		centerWidth: boolean
	): Rectangle {
		const barRect = new Rectangle()
		if (rectWidth === 0) {
			rectWidth = playerRect.Width - Math.abs(rectMargin)
		}
		barRect.Width = rectWidth
		barRect.Height = rectHeight
		barRect.x = playerRect.x + rectMargin
		if (centerWidth) {
			barRect.x +=
				Math.sign(rectMargin) *
				Math.round((playerRect.Width - rectWidth - Math.abs(rectMargin)) / 2)
		}
		if (rectMargin < 0) {
			barRect.x += playerRect.Width - rectWidth
		}
		barRect.y = playerRect.y - rectMarginBottom
		if (rectMarginBottom > 0) {
			barRect.y += playerRect.Height - rectHeight
		}
		return barRect
	}
	private CalculateBasicRects(
		barWidth: number,
		barHeight: number,
		barMarginBottom: number,
		barMargin: number,
		radiantBarArray: Rectangle[],
		direBarArray: Rectangle[],
		centerWidth = false
	): void {
		for (const playerRect of this.RadiantPlayers) {
			radiantBarArray.push(
				this.CalculateBar(
					playerRect,
					barWidth,
					barHeight,
					barMarginBottom,
					barMargin,
					centerWidth
				)
			)
		}
		for (const playerRect of this.DirePlayers) {
			direBarArray.push(
				this.CalculateBar(
					playerRect,
					barWidth,
					barHeight,
					barMarginBottom,
					-barMargin,
					centerWidth
				)
			)
		}
	}
	private CalculateNames(screenSize: Vector2, aspectRatio: string): void {
		this.CalculateBasicRects(
			0,
			ScaleHeight(27, screenSize),
			ScaleHeight(-(aspectRatio === "4x3" ? 68 : 78), screenSize),
			0,
			this.RadiantPlayersNames,
			this.DirePlayersNames
		)
	}
	private CalculateHeroImages(screenSize: Vector2, aspectRatio: string): void {
		const width = ScaleWidth(aspectRatio === "4x3" ? 100 : 118, screenSize)
		this.CalculateBasicRects(
			width,
			Math.round(width * 0.5625),
			-0,
			ScaleWidth(4, screenSize),
			this.RadiantPlayersHeroImages,
			this.DirePlayersHeroImages
		)
	}
	private CalculateRoles(screenSize: Vector2): void {
		this.CalculateBasicRects(
			0,
			ScaleHeight(16, screenSize),
			ScaleHeight(-104, screenSize),
			ScaleWidth(6, screenSize),
			this.RadiantPlayersRoles,
			this.DirePlayersRoles
		)
	}
}
