const ParticleRangePath = "panorama/crutches/particles/range_display/range_display_"
const ParticleLinePath = "panorama/crutches/particles/range_line/"

export enum PARTICLE_RENDER_NAME {
	NORMAL = "Normal",
	ROPE = "Rope",
	ANIMATION = "Animation"
}

export enum PARTICLE_RENDER {
	NORMAL = 0,
	ROPE,
	ANIMATION
}

const RenderPath = (basePath: string, render = PARTICLE_RENDER.NORMAL) => {
	switch (render) {
		default:
		case PARTICLE_RENDER.NORMAL: return basePath + PARTICLE_RENDER_NAME.NORMAL
		case PARTICLE_RENDER.ROPE: return basePath + PARTICLE_RENDER_NAME.ROPE
		case PARTICLE_RENDER.ANIMATION: return basePath + PARTICLE_RENDER_NAME.ANIMATION
	}
}

export const RangeRenderPath = (render = PARTICLE_RENDER.NORMAL) => RenderPath(ParticleRangePath, render)
export const LineRenderPath = (render = PARTICLE_RENDER.NORMAL) => RenderPath(ParticleLinePath, render)