import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { RendererSDK } from "../Native/RendererSDK"
import { ScaleHeight, ScaleWidth } from "./Helpers"

export class CTopBar {
	public readonly TopBar = new Rectangle()
	public readonly TimeOfDay = new Rectangle()
	public readonly TimeOfDayTimeUntil = new Rectangle()
	public readonly RadiantSpectatorGoldDisplay = new Rectangle()
	public readonly DireSpectatorGoldDisplay = new Rectangle()
	public readonly RadiantTeamScore = new Rectangle()
	public readonly DireTeamScore = new Rectangle()
	public readonly RadiantPlayers: Rectangle[] = []
	public readonly DirePlayers: Rectangle[] = []
	public readonly RadiantPlayersHealthbars: Rectangle[] = []
	public readonly DirePlayersHealthbars: Rectangle[] = []
	public readonly RadiantPlayersManabars: Rectangle[] = []
	public readonly DirePlayersManabars: Rectangle[] = []
	public readonly RadiantPlayersBuybacks: Rectangle[] = []
	public readonly DirePlayersBuybacks: Rectangle[] = []
	public readonly RadiantPlayersRespawnTimers: Rectangle[] = []
	public readonly DirePlayersRespawnTimers: Rectangle[] = []
	public readonly RadiantPlayersTPIndicators: Rectangle[] = []
	public readonly DirePlayersTPIndicators: Rectangle[] = []
	public readonly RadiantPlayersUltReadyIndicators: Rectangle[] = []
	public readonly DirePlayersUltReadyIndicators: Rectangle[] = []
	public readonly RadiantPlayersHeroImages: Rectangle[] = []
	public readonly DirePlayersHeroImages: Rectangle[] = []
	public readonly RadiantPlayersSalutes: Rectangle[] = []
	public readonly DirePlayersSalutes: Rectangle[] = []
	public readonly RadiantTeamImage = new Rectangle()
	public readonly DireTeamImage = new Rectangle()
	public readonly RadiantTeamBackground = new Rectangle()
	public readonly DireTeamBackground = new Rectangle()

	constructor(screenSize: Vector2) {
		this.CalculateTopBar(screenSize)
		this.CalculateTimeOfDay(screenSize)
		this.CalculateTimeOfDayTimeUntil(screenSize)
		this.CalculateSpectatorGoldDisplay(screenSize)
		this.CalculateTeamScoreAndPlayers(screenSize)
		this.CalculateHealthbars(screenSize)
		this.CalculateManabars(screenSize)
		this.CalculateBuybacks(screenSize)
		this.CalculateRespawnTimers(screenSize)
		this.CalculateTPIndicators(screenSize)
		this.CalculateUltReadyIndicators(screenSize)
		this.CalculateHeroImages(screenSize)
		this.CalculateSalute(screenSize)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(
			this.TimeOfDay.pos1,
			this.TimeOfDay.Size,
			Color.Aqua.SetA(128)
		)
		RendererSDK.FilledRect(
			this.TimeOfDayTimeUntil.pos1,
			this.TimeOfDayTimeUntil.Size,
			Color.White.SetA(128)
		)
		RendererSDK.FilledRect(
			this.RadiantTeamScore.pos1,
			this.RadiantTeamScore.Size,
			Color.Green.SetA(128)
		)
		RendererSDK.FilledRect(
			this.DireTeamScore.pos1,
			this.DireTeamScore.Size,
			Color.Green.SetA(128)
		)
		RendererSDK.FilledRect(
			this.RadiantTeamImage.pos1,
			this.RadiantTeamImage.Size,
			Color.White.SetA(128)
		)
		RendererSDK.FilledRect(
			this.DireTeamImage.pos1,
			this.DireTeamImage.Size,
			Color.White.SetA(128)
		)
		RendererSDK.FilledRect(
			this.RadiantSpectatorGoldDisplay.pos1,
			this.RadiantSpectatorGoldDisplay.Size,
			Color.BlackGray.SetA(128)
		)
		RendererSDK.FilledRect(
			this.DireSpectatorGoldDisplay.pos1,
			this.DireSpectatorGoldDisplay.Size,
			Color.BlackGray.SetA(128)
		)

		this.RadiantPlayersHealthbars.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Red.SetA(128))
		)
		this.DirePlayersHealthbars.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Red.SetA(128))
		)

		this.RadiantPlayersManabars.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Aqua.SetA(128))
		)
		this.DirePlayersManabars.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Aqua.SetA(128))
		)

		this.RadiantPlayersBuybacks.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Yellow.SetA(128))
		)
		this.DirePlayersBuybacks.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Yellow.SetA(128))
		)
		this.RadiantPlayersSalutes.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.White.SetA(128))
		)
		this.DirePlayersSalutes.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.White.SetA(128))
		)

		this.RadiantPlayersTPIndicators.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Fuchsia.SetA(128))
		)

		this.DirePlayersTPIndicators.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Fuchsia.SetA(128))
		)

		this.RadiantPlayersHeroImages.forEach((rect, i) =>
			RendererSDK.FilledRect(
				rect.pos1,
				rect.Size,
				new Color(50, 50 * i, 0, 128)
			)
		)
		this.DirePlayersHeroImages.forEach((rect, i) =>
			RendererSDK.FilledRect(
				rect.pos1,
				rect.Size,
				new Color(50 * i, 0, 50, 128)
			)
		)

		this.RadiantPlayersUltReadyIndicators.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Green.SetA(128))
		)
		this.DirePlayersUltReadyIndicators.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Green.SetA(128))
		)
	}
	public HasChanged(): boolean {
		return false
	}
	private CalculateTopBar(screenSize: Vector2): void {
		this.TopBar.Width = ScaleWidth(1240, screenSize)
		this.TopBar.Height = ScaleHeight(165, screenSize)
		this.TopBar.x = Math.round((screenSize.x - this.TopBar.Width) / 2)

		// These resolutions have incorrect centering - they assign more pixels to the right side
		// instead of the left one.
		// Leave as-is unless anything breaks.
		if (
			(screenSize.x === 1280 &&
				(screenSize.y === 800 || screenSize.y === 720)) ||
			((screenSize.x === 720 || screenSize.x === 640) && screenSize.y === 480)
		)
			this.TopBar.x -= 1
	}
	private CalculateTimeOfDay(screenSize: Vector2): void {
		this.TimeOfDay.Width = ScaleWidth(80, screenSize)
		this.TimeOfDay.Height = ScaleHeight(45, screenSize)
		this.TimeOfDay.x =
			this.TopBar.x + Math.round((this.TopBar.Width - this.TimeOfDay.Width) / 2)
	}
	private CalculateTimeOfDayTimeUntil(screenSize: Vector2): void {
		this.TimeOfDayTimeUntil.Width = ScaleWidth(150, screenSize)
		this.TimeOfDayTimeUntil.Height = ScaleWidth(18, screenSize)
		this.TimeOfDayTimeUntil.x =
			this.TopBar.x +
			Math.round((this.TopBar.Width - this.TimeOfDayTimeUntil.Width) / 2)
		this.TimeOfDayTimeUntil.y =
			this.TopBar.Height -
			ScaleHeight(64, screenSize) -
			this.TimeOfDayTimeUntil.Height
	}
	private CalculateSpectatorGoldDisplay(screenSize: Vector2): void {
		const displayWidth = ScaleWidth(62, screenSize),
			displayHeight = ScaleHeight(24, screenSize),
			displayMargin = ScaleWidth(3, screenSize)
		const spectatorGoldDisplayContainer = new Rectangle()
		spectatorGoldDisplayContainer.Width = ScaleWidth(210, screenSize)
		spectatorGoldDisplayContainer.Height = ScaleHeight(50, screenSize)
		spectatorGoldDisplayContainer.x =
			this.TopBar.x +
			Math.round((this.TopBar.Width - spectatorGoldDisplayContainer.Width) / 2)
		spectatorGoldDisplayContainer.y =
			this.TopBar.y + ScaleHeight(40, screenSize)

		this.RadiantSpectatorGoldDisplay.Width = displayWidth
		this.RadiantSpectatorGoldDisplay.Height = displayHeight
		this.RadiantSpectatorGoldDisplay.x =
			spectatorGoldDisplayContainer.x + displayMargin
		this.RadiantSpectatorGoldDisplay.y = spectatorGoldDisplayContainer.y

		this.DireSpectatorGoldDisplay.Width = displayWidth
		this.DireSpectatorGoldDisplay.Height = displayHeight
		this.DireSpectatorGoldDisplay.x =
			spectatorGoldDisplayContainer.x +
			spectatorGoldDisplayContainer.Width -
			this.DireSpectatorGoldDisplay.Width -
			displayMargin
		this.DireSpectatorGoldDisplay.y = spectatorGoldDisplayContainer.y
	}
	private CalculateTeamScoreAndPlayers(screenSize: Vector2): void {
		const containerWidth = ScaleWidth(620, screenSize),
			teamBackgroundWidth = ScaleWidth(410, screenSize),
			teamBackgroundHeight = ScaleWidth(40, screenSize),
			teamScoreAndPlayersWidth = ScaleWidth(540, screenSize),
			teamScoreAndPlayersMargin1 = ScaleWidth(10, screenSize),
			teamScoreAndPlayersMargin2 = ScaleWidth(40, screenSize),
			scoreWidth = ScaleWidth(58, screenSize),
			scoreHeight = ScaleHeight(38, screenSize),
			scoreMargin = ScaleWidth(4, screenSize),
			scoreMarginTop = ScaleHeight(7, screenSize),
			playerWidth = ScaleWidth(66, screenSize),
			playerHeight = ScaleHeight(165, screenSize),
			playerMargin = ScaleWidth(4, screenSize),
			proTeamInfoMargin = ScaleWidth(2, screenSize),
			teamImageWidth = ScaleWidth(66, screenSize),
			teamImageHeight = ScaleHeight(40, screenSize)

		this.RadiantTeamBackground.Width = teamBackgroundWidth
		this.RadiantTeamBackground.Height = teamBackgroundHeight
		this.RadiantTeamBackground.x =
			this.TopBar.x + containerWidth - teamBackgroundWidth

		this.DireTeamBackground.Width = teamBackgroundWidth
		this.DireTeamBackground.Height = teamBackgroundHeight
		this.DireTeamBackground.x =
			this.TopBar.x + this.TopBar.Width - containerWidth
		{
			const radiantTeamScoreAndPlayers = new Rectangle()
			radiantTeamScoreAndPlayers.Width =
				teamScoreAndPlayersWidth -
				teamScoreAndPlayersMargin1 -
				teamScoreAndPlayersMargin2
			radiantTeamScoreAndPlayers.Height = this.TopBar.Height
			radiantTeamScoreAndPlayers.x =
				this.TopBar.x +
				containerWidth -
				teamScoreAndPlayersWidth +
				teamScoreAndPlayersMargin1

			this.RadiantTeamScore.Width = scoreWidth
			this.RadiantTeamScore.Height = scoreHeight
			this.RadiantTeamScore.x =
				radiantTeamScoreAndPlayers.x +
				radiantTeamScoreAndPlayers.Width -
				scoreMargin -
				this.RadiantTeamScore.Width
			this.RadiantTeamScore.y = scoreMarginTop

			let currentX = this.RadiantTeamScore.x - playerWidth
			for (let i = 0; i < 5; i++) {
				const playerRect = new Rectangle()
				playerRect.Width = playerWidth
				playerRect.Height = playerHeight
				playerRect.x = currentX
				currentX -= playerRect.Width - playerMargin

				this.RadiantPlayers.push(playerRect)
			}
			this.RadiantPlayers.reverse()
			currentX += playerWidth

			this.RadiantTeamImage.Width = teamImageWidth
			this.RadiantTeamImage.Height = teamImageHeight
			this.RadiantTeamImage.x =
				currentX + proTeamInfoMargin - this.RadiantTeamImage.Width
		}

		{
			const direTeamScoreAndPlayers = new Rectangle()
			direTeamScoreAndPlayers.Width =
				teamScoreAndPlayersWidth -
				teamScoreAndPlayersMargin2 -
				teamScoreAndPlayersMargin1
			direTeamScoreAndPlayers.Height = this.TopBar.Height
			direTeamScoreAndPlayers.x =
				this.TopBar.x +
				this.TopBar.Width -
				containerWidth +
				teamScoreAndPlayersMargin2

			this.DireTeamScore.Width = scoreWidth
			this.DireTeamScore.Height = scoreHeight
			this.DireTeamScore.x = direTeamScoreAndPlayers.x + scoreMargin
			this.DireTeamScore.y = scoreMarginTop

			let currentX = this.DireTeamScore.x + this.DireTeamScore.Width
			for (let i = 0; i < 5; i++) {
				const playerRect = new Rectangle()
				playerRect.Width = playerWidth
				playerRect.Height = playerHeight
				playerRect.x = currentX
				currentX += playerRect.Width - playerMargin

				this.DirePlayers.push(playerRect)
			}

			this.DireTeamImage.Width = teamImageWidth
			this.DireTeamImage.Height = teamImageHeight
			this.DireTeamImage.x = currentX - proTeamInfoMargin
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
		barRect.Width = rectWidth
		barRect.Height = rectHeight
		barRect.x = playerRect.x + rectMargin
		if (centerWidth)
			barRect.x +=
				Math.sign(rectMargin) *
				Math.round((playerRect.Width - rectWidth - Math.abs(rectMargin)) / 2)
		if (rectMargin < 0) barRect.x += playerRect.Width - rectWidth
		barRect.y = playerRect.y - rectMarginBottom
		if (rectMarginBottom > 0) barRect.y += playerRect.Height - rectHeight
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
		for (const playerRect of this.RadiantPlayers)
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
		for (const playerRect of this.DirePlayers)
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
	private CalculateHealthbars(screenSize: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(60, screenSize),
			ScaleHeight(8, screenSize),
			ScaleHeight(129, screenSize) - ScaleHeight(11, screenSize),
			ScaleWidth(6, screenSize),
			this.RadiantPlayersHealthbars,
			this.DirePlayersHealthbars
		)
	}
	private CalculateManabars(screenSize: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(60, screenSize),
			ScaleHeight(8, screenSize),
			ScaleHeight(121, screenSize) - ScaleHeight(11, screenSize),
			ScaleWidth(6, screenSize),
			this.RadiantPlayersManabars,
			this.DirePlayersManabars
		)
	}
	private CalculateBuybacks(screenSize: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(60, screenSize),
			ScaleHeight(4, screenSize),
			ScaleHeight(106, screenSize),
			ScaleWidth(6, screenSize),
			this.RadiantPlayersBuybacks,
			this.DirePlayersBuybacks
		)
	}
	private CalculateRespawnTimers(screenSize: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(60, screenSize),
			ScaleHeight(26, screenSize),
			ScaleHeight(99, screenSize),
			ScaleWidth(6, screenSize),
			this.RadiantPlayersRespawnTimers,
			this.DirePlayersRespawnTimers
		)
	}
	private CalculateSalute(screenSize: Vector2) {
		this.CalculateBasicRects(
			ScaleWidth(56, screenSize),
			ScaleHeight(19, screenSize),
			ScaleHeight(76, screenSize),
			ScaleWidth(6, screenSize),
			this.RadiantPlayersSalutes,
			this.DirePlayersSalutes,
			true
		)
	}

	private CalculateTPIndicators(screenSize: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(48, screenSize),
			ScaleHeight(48, screenSize),
			ScaleHeight(40, screenSize),
			ScaleWidth(6, screenSize),
			this.RadiantPlayersTPIndicators,
			this.DirePlayersTPIndicators,
			true
		)
	}
	private CalculateUltReadyIndicators(screenSize: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(38, screenSize),
			ScaleHeight(20, screenSize),
			ScaleHeight(-28, screenSize),
			ScaleWidth(6, screenSize),
			this.RadiantPlayersUltReadyIndicators,
			this.DirePlayersUltReadyIndicators,
			true
		)
	}
	private CalculateHeroImages(screenSize: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(66, screenSize),
			ScaleHeight(36, screenSize),
			ScaleHeight(-4, screenSize),
			0,
			this.RadiantPlayersHeroImages,
			this.DirePlayersHeroImages
		)
	}
}
