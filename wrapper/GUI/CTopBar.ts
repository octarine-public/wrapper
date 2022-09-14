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
	public readonly RadiantTeamImage = new Rectangle()
	public readonly DireTeamImage = new Rectangle()
	public readonly RadiantTeamBackground = new Rectangle()
	public readonly DireTeamBackground = new Rectangle()

	constructor(screen_size: Vector2) {
		this.CalculateTopBar(screen_size)
		this.CalculateTimeOfDay(screen_size)
		this.CalculateTimeOfDayTimeUntil(screen_size)
		this.CalculateSpectatorGoldDisplay(screen_size)
		this.CalculateTeamScoreAndPlayers(screen_size)
		this.CalculateHealthbars(screen_size)
		this.CalculateManabars(screen_size)
		this.CalculateBuybacks(screen_size)
		this.CalculateRespawnTimers(screen_size)
		this.CalculateTPIndicators(screen_size)
		this.CalculateUltReadyIndicators(screen_size)
		this.CalculateHeroImages(screen_size)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.TimeOfDay.pos1, this.TimeOfDay.Size, Color.Aqua.SetA(128))
		RendererSDK.FilledRect(this.TimeOfDayTimeUntil.pos1, this.TimeOfDayTimeUntil.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.RadiantTeamScore.pos1, this.RadiantTeamScore.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(this.DireTeamScore.pos1, this.DireTeamScore.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(this.RadiantTeamImage.pos1, this.RadiantTeamImage.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.DireTeamImage.pos1, this.DireTeamImage.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.RadiantSpectatorGoldDisplay.pos1, this.RadiantSpectatorGoldDisplay.Size, Color.BlackGray.SetA(128))
		RendererSDK.FilledRect(this.DireSpectatorGoldDisplay.pos1, this.DireSpectatorGoldDisplay.Size, Color.BlackGray.SetA(128))

		this.RadiantPlayersHealthbars.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Red.SetA(128)))
		this.DirePlayersHealthbars.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Red.SetA(128)))

		this.RadiantPlayersManabars.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Aqua.SetA(128)))
		this.DirePlayersManabars.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Aqua.SetA(128)))

		this.RadiantPlayersBuybacks.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Yellow.SetA(128)))
		this.DirePlayersBuybacks.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Yellow.SetA(128)))

		this.RadiantPlayersTPIndicators.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Fuchsia.SetA(128)))
		this.DirePlayersTPIndicators.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Fuchsia.SetA(128)))

		this.RadiantPlayersHeroImages.forEach((rect, i) => RendererSDK.FilledRect(rect.pos1, rect.Size, new Color(50, 50 * i, 0, 128)))
		this.DirePlayersHeroImages.forEach((rect, i) => RendererSDK.FilledRect(rect.pos1, rect.Size, new Color(50 * i, 0, 50, 128)))

		this.RadiantPlayersUltReadyIndicators.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Green.SetA(128)))
		this.DirePlayersUltReadyIndicators.forEach(rect => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Green.SetA(128)))
	}
	public HasChanged(): boolean {
		return false
	}

	private CalculateTopBar(screen_size: Vector2): void {
		this.TopBar.Width = ScaleWidth(1240, screen_size)
		this.TopBar.Height = ScaleHeight(165, screen_size)
		this.TopBar.x = Math.round((screen_size.x - this.TopBar.Width) / 2)

		// These resolutions have incorrect centering - they assign more pixels to the right side
		// instead of the left one.
		// Leave as-is unless anything breaks.
		if (
			(screen_size.x === 1280 && (screen_size.y === 800 || screen_size.y === 720))
			|| ((screen_size.x === 720 || screen_size.x === 640) && screen_size.y === 480)
		)
			this.TopBar.x -= 1
	}
	private CalculateTimeOfDay(screen_size: Vector2): void {
		this.TimeOfDay.Width = ScaleWidth(80, screen_size)
		this.TimeOfDay.Height = ScaleHeight(45, screen_size)
		this.TimeOfDay.x = this.TopBar.x + Math.round((this.TopBar.Width - this.TimeOfDay.Width) / 2)
	}
	private CalculateTimeOfDayTimeUntil(screen_size: Vector2): void {
		this.TimeOfDayTimeUntil.Width = ScaleWidth(150, screen_size)
		this.TimeOfDayTimeUntil.Height = ScaleWidth(18, screen_size)
		this.TimeOfDayTimeUntil.x = this.TopBar.x + Math.round((this.TopBar.Width - this.TimeOfDayTimeUntil.Width) / 2)
		this.TimeOfDayTimeUntil.y = this.TopBar.Height - ScaleHeight(64, screen_size) - this.TimeOfDayTimeUntil.Height
	}
	private CalculateSpectatorGoldDisplay(screen_size: Vector2): void {
		const DisplayWidth = ScaleWidth(62, screen_size),
			DisplayHeight = ScaleHeight(24, screen_size),
			DisplayMargin = ScaleWidth(3, screen_size)
		const SpectatorGoldDisplayContainer = new Rectangle()
		SpectatorGoldDisplayContainer.Width = ScaleWidth(210, screen_size)
		SpectatorGoldDisplayContainer.Height = ScaleHeight(50, screen_size)
		SpectatorGoldDisplayContainer.x = (
			this.TopBar.x
			+ Math.round((this.TopBar.Width - SpectatorGoldDisplayContainer.Width) / 2)
		)
		SpectatorGoldDisplayContainer.y = this.TopBar.y + ScaleHeight(40, screen_size)

		this.RadiantSpectatorGoldDisplay.Width = DisplayWidth
		this.RadiantSpectatorGoldDisplay.Height = DisplayHeight
		this.RadiantSpectatorGoldDisplay.x = SpectatorGoldDisplayContainer.x + DisplayMargin
		this.RadiantSpectatorGoldDisplay.y = SpectatorGoldDisplayContainer.y

		this.DireSpectatorGoldDisplay.Width = DisplayWidth
		this.DireSpectatorGoldDisplay.Height = DisplayHeight
		this.DireSpectatorGoldDisplay.x = (
			SpectatorGoldDisplayContainer.x
			+ SpectatorGoldDisplayContainer.Width
			- this.DireSpectatorGoldDisplay.Width
			- DisplayMargin
		)
		this.DireSpectatorGoldDisplay.y = SpectatorGoldDisplayContainer.y
	}
	private CalculateTeamScoreAndPlayers(screen_size: Vector2): void {
		const ContainerWidth = ScaleWidth(620, screen_size),
			TeamBackgroundWidth = ScaleWidth(410, screen_size),
			TeamBackgroundHeight = ScaleWidth(40, screen_size),
			TeamScoreAndPlayersWidth = ScaleWidth(540, screen_size),
			TeamScoreAndPlayersMargin1 = ScaleWidth(10, screen_size),
			TeamScoreAndPlayersMargin2 = ScaleWidth(40, screen_size),
			ScoreWidth = ScaleWidth(58, screen_size),
			ScoreHeight = ScaleHeight(38, screen_size),
			ScoreMargin = ScaleWidth(4, screen_size),
			ScoreMarginTop = ScaleHeight(7, screen_size),
			PlayerWidth = ScaleWidth(66, screen_size),
			PlayerHeight = ScaleHeight(165, screen_size),
			PlayerMargin = ScaleWidth(4, screen_size),
			ProTeamInfoMargin = ScaleWidth(2, screen_size),
			TeamImageWidth = ScaleWidth(66, screen_size),
			TeamImageHeight = ScaleHeight(40, screen_size)

		{
			this.RadiantTeamBackground.Width = TeamBackgroundWidth
			this.RadiantTeamBackground.Height = TeamBackgroundHeight
			this.RadiantTeamBackground.x = this.TopBar.x + ContainerWidth - TeamBackgroundWidth

			this.DireTeamBackground.Width = TeamBackgroundWidth
			this.DireTeamBackground.Height = TeamBackgroundHeight
			this.DireTeamBackground.x = this.TopBar.x + this.TopBar.Width - ContainerWidth
		}
		{
			const RadiantTeamScoreAndPlayers = new Rectangle()
			RadiantTeamScoreAndPlayers.Width = TeamScoreAndPlayersWidth - TeamScoreAndPlayersMargin1 - TeamScoreAndPlayersMargin2
			RadiantTeamScoreAndPlayers.Height = this.TopBar.Height
			RadiantTeamScoreAndPlayers.x = this.TopBar.x + ContainerWidth - TeamScoreAndPlayersWidth + TeamScoreAndPlayersMargin1

			this.RadiantTeamScore.Width = ScoreWidth
			this.RadiantTeamScore.Height = ScoreHeight
			this.RadiantTeamScore.x = (
				RadiantTeamScoreAndPlayers.x
				+ RadiantTeamScoreAndPlayers.Width
				- ScoreMargin
				- this.RadiantTeamScore.Width
			)
			this.RadiantTeamScore.y = ScoreMarginTop

			let current_x = this.RadiantTeamScore.x - PlayerWidth
			for (let i = 0; i < 5; i++) {
				const PlayerRect = new Rectangle()
				PlayerRect.Width = PlayerWidth
				PlayerRect.Height = PlayerHeight
				PlayerRect.x = current_x
				current_x -= PlayerRect.Width - PlayerMargin

				this.RadiantPlayers.push(PlayerRect)
			}
			this.RadiantPlayers.reverse()
			current_x += PlayerWidth

			this.RadiantTeamImage.Width = TeamImageWidth
			this.RadiantTeamImage.Height = TeamImageHeight
			this.RadiantTeamImage.x = current_x + ProTeamInfoMargin - this.RadiantTeamImage.Width
		}

		{
			const DireTeamScoreAndPlayers = new Rectangle()
			DireTeamScoreAndPlayers.Width = TeamScoreAndPlayersWidth - TeamScoreAndPlayersMargin2 - TeamScoreAndPlayersMargin1
			DireTeamScoreAndPlayers.Height = this.TopBar.Height
			DireTeamScoreAndPlayers.x = this.TopBar.x + this.TopBar.Width - ContainerWidth + TeamScoreAndPlayersMargin2

			this.DireTeamScore.Width = ScoreWidth
			this.DireTeamScore.Height = ScoreHeight
			this.DireTeamScore.x = (
				DireTeamScoreAndPlayers.x
				+ ScoreMargin
			)
			this.DireTeamScore.y = ScoreMarginTop

			let current_x = this.DireTeamScore.x + this.DireTeamScore.Width
			for (let i = 0; i < 5; i++) {
				const PlayerRect = new Rectangle()
				PlayerRect.Width = PlayerWidth
				PlayerRect.Height = PlayerHeight
				PlayerRect.x = current_x
				current_x += PlayerRect.Width - PlayerMargin

				this.DirePlayers.push(PlayerRect)
			}

			this.DireTeamImage.Width = TeamImageWidth
			this.DireTeamImage.Height = TeamImageHeight
			this.DireTeamImage.x = current_x - ProTeamInfoMargin
		}
	}
	private CalculateBar(
		PlayerRect: Rectangle,
		RectWidth: number,
		RectHeight: number,
		RectMarginBottom: number,
		RectMargin: number,
		CenterWidth: boolean,
	): Rectangle {
		const BarRect = new Rectangle()
		BarRect.Width = RectWidth
		BarRect.Height = RectHeight
		BarRect.x = PlayerRect.x + RectMargin
		if (CenterWidth)
			BarRect.x += Math.sign(RectMargin) * Math.round((PlayerRect.Width - RectWidth - Math.abs(RectMargin)) / 2)
		if (RectMargin < 0)
			BarRect.x += PlayerRect.Width - RectWidth
		BarRect.y = PlayerRect.y - RectMarginBottom
		if (RectMarginBottom > 0)
			BarRect.y += PlayerRect.Height - RectHeight
		return BarRect
	}
	private CalculateBasicRects(
		BarWidth: number,
		BarHeight: number,
		BarMarginBottom: number,
		BarMargin: number,
		RadiantBarArray: Rectangle[],
		DireBarArray: Rectangle[],
		CenterWidth = false,
	): void {
		this.RadiantPlayers.forEach(PlayerRect => RadiantBarArray.push(this.CalculateBar(
			PlayerRect,
			BarWidth,
			BarHeight,
			BarMarginBottom,
			BarMargin,
			CenterWidth,
		)))
		this.DirePlayers.forEach(PlayerRect => DireBarArray.push(this.CalculateBar(
			PlayerRect,
			BarWidth,
			BarHeight,
			BarMarginBottom,
			-BarMargin,
			CenterWidth,
		)))
	}
	private CalculateHealthbars(screen_size: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(60, screen_size),
			ScaleHeight(8, screen_size),
			ScaleHeight(129, screen_size) - ScaleHeight(11, screen_size),
			ScaleWidth(6, screen_size),
			this.RadiantPlayersHealthbars,
			this.DirePlayersHealthbars,
		)
	}
	private CalculateManabars(screen_size: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(60, screen_size),
			ScaleHeight(8, screen_size),
			ScaleHeight(121, screen_size) - ScaleHeight(11, screen_size),
			ScaleWidth(6, screen_size),
			this.RadiantPlayersManabars,
			this.DirePlayersManabars,
		)
	}
	private CalculateBuybacks(screen_size: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(60, screen_size),
			ScaleHeight(4, screen_size),
			ScaleHeight(106, screen_size),
			ScaleWidth(6, screen_size),
			this.RadiantPlayersBuybacks,
			this.DirePlayersBuybacks,
		)
	}
	private CalculateRespawnTimers(screen_size: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(60, screen_size),
			ScaleHeight(26, screen_size),
			ScaleHeight(99, screen_size),
			ScaleWidth(6, screen_size),
			this.RadiantPlayersRespawnTimers,
			this.DirePlayersRespawnTimers,
		)
	}
	private CalculateTPIndicators(screen_size: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(48, screen_size),
			ScaleHeight(48, screen_size),
			ScaleHeight(40, screen_size),
			ScaleWidth(6, screen_size),
			this.RadiantPlayersTPIndicators,
			this.DirePlayersTPIndicators,
			true,
		)
	}
	private CalculateUltReadyIndicators(screen_size: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(38, screen_size),
			ScaleHeight(20, screen_size),
			ScaleHeight(-28, screen_size),
			ScaleWidth(6, screen_size),
			this.RadiantPlayersUltReadyIndicators,
			this.DirePlayersUltReadyIndicators,
			true,
		)
	}
	private CalculateHeroImages(screen_size: Vector2): void {
		this.CalculateBasicRects(
			ScaleWidth(66, screen_size),
			ScaleHeight(36, screen_size),
			ScaleHeight(-4, screen_size),
			0,
			this.RadiantPlayersHeroImages,
			this.DirePlayersHeroImages,
		)
	}
}
