import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import { Team } from "../Enums/Team"
import RendererSDK from "../Native/RendererSDK"
import { GameRules } from "../Objects/Base/Entity"
import { PlayerResource } from "../Objects/Base/PlayerResource"
import GUIInfo from "./GUIInfo"

export default class CTopBar {
	private static get HasRadiantCoach(): boolean {
		return PlayerResource?.PlayerData?.some(data => data.CoachTeam === Team.Radiant) ?? false
	}
	private static get HasDireCoach(): boolean {
		return PlayerResource?.PlayerData?.some(data => data.CoachTeam === Team.Dire) ?? false
	}
	private static get IsRetardedGameMode(): boolean {
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
	public readonly HasRadiantCoach = CTopBar.HasRadiantCoach
	public readonly HasDireCoach = CTopBar.HasDireCoach
	private readonly RadiantPlayers: Rectangle[] = []
	private readonly DirePlayers: Rectangle[] = []
	private readonly IsRetardedGameMode = CTopBar.IsRetardedGameMode

	constructor(screen_size: Vector2) {
		const aspect_ratio = RendererSDK.GetAspectRatio(screen_size)
		this.CalculateCenter(screen_size, aspect_ratio)
		this.CalculateCoachesAndPlayers(screen_size, aspect_ratio)
		this.CalculateNames(screen_size, aspect_ratio)
		this.CalculateHeroImages(screen_size, aspect_ratio)
		this.CalculateRoles(screen_size)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.Center.pos1, this.Center.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.RadiantCoach.pos1, this.RadiantCoach.Size, Color.Aqua.SetA(128))
		RendererSDK.FilledRect(this.DireCoach.pos1, this.DireCoach.Size, Color.Aqua.SetA(128))

		this.RadiantPlayersNames.forEach((rect, i) => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Yellow.SetA(128)))
		this.DirePlayersNames.forEach((rect, i) => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Yellow.SetA(128)))

		this.RadiantPlayersHeroImages.forEach((rect, i) => RendererSDK.FilledRect(rect.pos1, rect.Size, new Color(50, 50 * i, 0, 128)))
		this.DirePlayersHeroImages.forEach((rect, i) => RendererSDK.FilledRect(rect.pos1, rect.Size, new Color(50 * i, 0, 50, 128)))

		this.RadiantPlayersRoles.forEach((rect, i) => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Green.SetA(128)))
		this.DirePlayersRoles.forEach((rect, i) => RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Green.SetA(128)))
	}
	public HasChanged(): boolean {
		return (
			this.HasRadiantCoach !== CTopBar.HasRadiantCoach
			|| this.HasDireCoach !== CTopBar.HasDireCoach
			|| this.IsRetardedGameMode !== CTopBar.IsRetardedGameMode
		)
	}

	private CalculateCenter(screen_size: Vector2, aspect_ratio: string): void {
		this.Center.Width = GUIInfo.ScaleWidth(aspect_ratio === "16x10" ? 300 : 250, screen_size)
		this.Center.Height = GUIInfo.ScaleHeight(88, screen_size)
		this.Center.x = Math.round((screen_size.x - this.Center.Width) / 2)

		// No clue how pregame aligns center, but this seem to fix it for several resolutions
		if (this.IsRetardedGameMode) {
			if (aspect_ratio === "4x3")
				this.Center.x += GUIInfo.ScaleWidth(4, screen_size)
			if (
				(screen_size.x === 720 && screen_size.y === 576)
				|| (screen_size.x === 720 && screen_size.y === 480)
				|| (screen_size.x === 640 && screen_size.y === 480)
			)
				this.Center.x -= 1
		}
	}
	private CalculateCoachesAndPlayers(
		screen_size: Vector2,
		aspect_ratio: string,
	): void {
		const CoachMargin = GUIInfo.ScaleWidth(10, screen_size),
			CoachWidth = GUIInfo.ScaleHeight(80, screen_size),
			CoachHeight = GUIInfo.ScaleHeight(50, screen_size),
			PlayersContainerMargin = GUIInfo.ScaleWidth(8, screen_size),
			PlayerMargin = GUIInfo.ScaleWidth(aspect_ratio === "4x3" ? -4 : -2, screen_size),
			PlayerWidth = GUIInfo.ScaleWidth(aspect_ratio === "4x3" ? 110 : 128, screen_size)

		{
			let current_pos = this.Center.x
			if (this.HasRadiantCoach) {
				this.RadiantCoach.Width = CoachWidth
				this.RadiantCoach.Height = CoachHeight

				this.RadiantCoach.x = current_pos - this.RadiantCoach.Width + CoachMargin
				current_pos = this.RadiantCoach.x + CoachMargin
			}
			current_pos -= PlayersContainerMargin
			for (let i = 0; i < 5; i++) {
				const PlayerRect = new Rectangle()
				PlayerRect.Width = PlayerWidth
				PlayerRect.Height = 0
				// No clue why, but on 4:3 resolutions gap between 1st and 2nd radiant players
				// are bigger than other ones.
				if (aspect_ratio === "4x3" && i === 4 && this.IsRetardedGameMode)
					current_pos -= GUIInfo.ScaleWidth(9, screen_size)
				PlayerRect.x = current_pos - PlayerRect.Width - PlayerMargin
				current_pos = PlayerRect.x - PlayerMargin
				this.RadiantPlayers.push(PlayerRect)
			}
			this.RadiantPlayers.reverse()
		}

		{
			let current_pos = this.Center.x + this.Center.Width
			if (this.HasDireCoach) {
				this.DireCoach.Width = CoachWidth
				this.DireCoach.Height = CoachHeight

				this.DireCoach.x = current_pos - CoachMargin
				current_pos = this.DireCoach.x + this.DireCoach.Width - CoachMargin
			}
			current_pos += PlayersContainerMargin
			for (let i = 0; i < 5; i++) {
				const PlayerRect = new Rectangle()
				PlayerRect.Width = PlayerWidth
				PlayerRect.Height = 0
				PlayerRect.x = current_pos + PlayerMargin
				current_pos = PlayerRect.x + PlayerMargin + PlayerWidth
				this.DirePlayers.push(PlayerRect)
			}
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
		if (RectWidth === 0)
			RectWidth = PlayerRect.Width - Math.abs(RectMargin)
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
	private CalculateNames(screen_size: Vector2, aspect_ratio: string): void {
		this.CalculateBasicRects(
			0,
			GUIInfo.ScaleHeight(27, screen_size),
			GUIInfo.ScaleHeight(-(aspect_ratio === "4x3" ? 68 : 78), screen_size),
			0,
			this.RadiantPlayersNames,
			this.DirePlayersNames,
		)
	}
	private CalculateHeroImages(screen_size: Vector2, aspect_ratio: string): void {
		const width = GUIInfo.ScaleWidth(aspect_ratio === "4x3" ? 100 : 118, screen_size)
		this.CalculateBasicRects(
			width,
			Math.round(width * 0.5625),
			-0,
			GUIInfo.ScaleWidth(4, screen_size),
			this.RadiantPlayersHeroImages,
			this.DirePlayersHeroImages,
		)
	}
	private CalculateRoles(screen_size: Vector2): void {
		this.CalculateBasicRects(
			0,
			GUIInfo.ScaleHeight(16, screen_size),
			GUIInfo.ScaleHeight(-104, screen_size),
			GUIInfo.ScaleWidth(6, screen_size),
			this.RadiantPlayersRoles,
			this.DirePlayersRoles,
		)
	}
}
