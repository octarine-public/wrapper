#include "stdafx.h"
#include "lodepng/lodepng.h"

#define DEBUG_PRINT(...) do {} while(false)

enum ImageFormat {
	IMAGE_FORMAT_UNKNOWN = -1,
	IMAGE_FORMAT_RGBA8888,
	IMAGE_FORMAT_ABGR8888,
	IMAGE_FORMAT_RGB888,
	IMAGE_FORMAT_BGR888,
	IMAGE_FORMAT_RGB565,
	IMAGE_FORMAT_I8,
	IMAGE_FORMAT_IA88,
	IMAGE_FORMAT_P8,
	IMAGE_FORMAT_A8,
	IMAGE_FORMAT_RGB888_BLUESCREEN,
	IMAGE_FORMAT_BGR888_BLUESCREEN,
	IMAGE_FORMAT_ARGB8888,
	IMAGE_FORMAT_BGRA8888,
	IMAGE_FORMAT_DXT1,
	IMAGE_FORMAT_DXT3,
	IMAGE_FORMAT_DXT5,
	IMAGE_FORMAT_BGRX8888,
	IMAGE_FORMAT_BGR565,
	IMAGE_FORMAT_BGRX5551,
	IMAGE_FORMAT_BGRA4444,
	IMAGE_FORMAT_DXT1_ONEBITALPHA,
	IMAGE_FORMAT_BGRA5551,
	IMAGE_FORMAT_UV88,
	IMAGE_FORMAT_UVWQ8888,
	IMAGE_FORMAT_RGBA16161616F,
	IMAGE_FORMAT_RGBA16161616,
	IMAGE_FORMAT_UVLX8888,
	IMAGE_FORMAT_R32F,			// Single-channel 32-bit floating point
	IMAGE_FORMAT_RGB323232F,
	IMAGE_FORMAT_RGBA32323232F,

	// Depth-stencil texture formats for shadow depth mapping
	IMAGE_FORMAT_NV_DST16,		// 
	IMAGE_FORMAT_NV_DST24,		//
	IMAGE_FORMAT_NV_INTZ,		// Vendor-specific depth-stencil texture
	IMAGE_FORMAT_NV_RAWZ,		// formats for shadow depth mapping 
	IMAGE_FORMAT_ATI_DST16,		// 
	IMAGE_FORMAT_ATI_DST24,		//
	IMAGE_FORMAT_NV_NULL,		// Dummy format which takes no video memory

	// Compressed normal map formats
	IMAGE_FORMAT_ATI2N,			// One-surface ATI2N / DXN format
	IMAGE_FORMAT_ATI1N,			// Two-surface ATI1N format

#if defined( _X360 )
	// Depth-stencil texture formats
	IMAGE_FORMAT_X360_DST16,
	IMAGE_FORMAT_X360_DST24,
	IMAGE_FORMAT_X360_DST24F,
	// supporting these specific formats as non-tiled for procedural cpu access
	IMAGE_FORMAT_LINEAR_BGRX8888,
	IMAGE_FORMAT_LINEAR_RGBA8888,
	IMAGE_FORMAT_LINEAR_ABGR8888,
	IMAGE_FORMAT_LINEAR_ARGB8888,
	IMAGE_FORMAT_LINEAR_BGRA8888,
	IMAGE_FORMAT_LINEAR_RGB888,
	IMAGE_FORMAT_LINEAR_BGR888,
	IMAGE_FORMAT_LINEAR_BGRX5551,
	IMAGE_FORMAT_LINEAR_I8,
	IMAGE_FORMAT_LINEAR_RGBA16161616,

	IMAGE_FORMAT_LE_BGRX8888,
	IMAGE_FORMAT_LE_BGRA8888,
#endif

	NUM_IMAGE_FORMATS
};

enum class VTexFlags : uint16_t {
	SUGGEST_CLAMPS = 1 << 0,
	SUGGEST_CLAMPT = 1 << 1,
	SUGGEST_CLAMPU = 1 << 2,
	NO_LOD = 1 << 3,
	CUBE_TEXTURE = 1 << 4,
	VOLUME_TEXTURE = 1 << 5,
	TEXTURE_ARRAY = 1 << 6
};

enum class VTexFormat : uint8_t {
	UNKNOWN = 0,
	DXT1 = 1,
	DXT5 = 2,
	I8 = 3,
	RGBA8888 = 4,
	R16 = 5,
	RG1616 = 6,
	RGBA16161616 = 7,
	R16F = 8,
	RG1616F = 9,
	RGBA16161616F = 10,
	R32F = 11,
	RG3232F = 12,
	RGB323232F = 13,
	RGBA32323232F = 14,
	JPEG_RGBA8888 = 15,
	PNG_RGBA8888 = 16,
	JPEG_DXT5 = 17,
	PNG_DXT5 = 18,
	BC6H = 19,
	BC7 = 20,
	ATI2N = 21,
	IA88 = 22,
	ETC2 = 23,
	ETC2_EAC = 24,
	R11_EAC = 25,
	RG11_EAC = 26,
	ATI1N = 27,
	BGRA8888 = 28
};

enum class VTexExtraData : uint32_t {
	UNKNOWN = 0,
	FALLBACK_BITS = 1,
	SHEET = 2,
	FILL_TO_POWER_OF_TWO = 3,
	COMPRESSED_MIP_SIZE = 4,
};

#pragma pack(push, 1)
struct VTexHeader {
	uint16_t version;
	VTexFlags flags;
	float reflectivity[4];
	uint16_t width;
	uint16_t height;
	uint16_t depth;
	VTexFormat format;
	uint8_t num_mip_levels;
	uint32_t picmip0_res;
	uint32_t extra_data_offset;
	uint32_t extra_data_count;
};
#pragma pack(pop)

#pragma pack(push, 1)
struct VTexExtraDataBlock {
	VTexExtraData type;
	uint32_t offset;
	uint32_t size;
};
#pragma pack(pop)

uint8_t ClampColor(int a) {
	if (a > 255)
		return 255;

	return a < 0 ? (uint8_t)0 : (uint8_t)a;
}

/*
 * Parses PNG into RGBA
 */
char* ParsePNGInternal(char* data, size_t data_size, int& w, int& h) {
	char* out = nullptr;
	unsigned int res = 0;
	if ((res = lodepng_decode32((unsigned char**)&out, (unsigned int*)&w, (unsigned int*)&h, (unsigned char*)data, data_size))) {
		DEBUG_PRINT("Error parsing PNG: %s\n", lodepng_error_text(res));
		return nullptr;
	}
	return out;
}

extern void ConvertFromDXT1(const uint8_t* src, uint8_t* dst, int width, int height);
extern void ConvertFromDXT5(const uint8_t* src, uint8_t* dst, int width, int height);

/*
 * Parses VTex into RGBA
 * Wrapper function for files (not direct vtex format)
 * Adds more crutches & bikes to this project
 */
char* ParseVTexInternal(char* data, size_t data_size, char* image_data, int& w, int& h) {
	auto vtex_header = (VTexHeader*)data;
	auto image_size = data_size - ((uint64_t)image_data - (uint64_t)data);
	w = vtex_header->width;
	h = vtex_header->height;
	auto extra_data_count = vtex_header->extra_data_count;
	if (extra_data_count != 0) {
		auto extra_data_block = GetPointer<VTexExtraDataBlock>(&vtex_header->extra_data_offset, vtex_header->extra_data_offset);
		for (uint32_t j = 0; j < extra_data_count; j++, extra_data_block++)
			if (extra_data_block->type == VTexExtraData::FILL_TO_POWER_OF_TWO) {
				auto extra_data = GetPointer<uint16_t>(&extra_data_block->offset, extra_data_block->offset);
				auto nw = extra_data[1], nh = extra_data[2];
				if (nw > 0 && w >= nw)
					w = nw;
				if (h >= nh && nh > 0)
					h = nh;
				break;
			}
	}

	void* copy = nullptr;
	size_t out_image_size = (size_t)vtex_header->width * (size_t)vtex_header->height * 4ll;
	auto convert_failed = "Failed to convert image data to the proper format.\n";
	switch (vtex_header->format) {
		case VTexFormat::DXT1: {
			copy = malloc(out_image_size);
			ConvertFromDXT1 (
				(uint8_t*)image_data,
				(uint8_t*)copy,
				vtex_header->width,
				vtex_header->height
			);
			break;
		}
		case VTexFormat::DXT5: {
			copy = malloc(out_image_size);
			ConvertFromDXT5 (
				(uint8_t*)image_data,
				(uint8_t*)copy,
				vtex_header->width,
				vtex_header->height
			);
			auto rgba = (uint8_t*)copy;
			/*if (yCoCg) {*/
			for (size_t i = out_image_size > 0 ? out_image_size - 4 : 0; i != 0; i -= 4) {
				auto finalAlpha = rgba[i + 3];
				auto s = (rgba[i + 2] >> 3) + 1,
					co = (rgba[i] - 128) / s,
					cg = (rgba[i + 1] - 128) / s;

				rgba[i] = ClampColor(finalAlpha + co - cg);
				rgba[i + 1] = ClampColor(finalAlpha + cg);
				rgba[i + 2] = ClampColor(finalAlpha - co - cg);
				rgba[i + 3] = 255;
			}
			/*}*/
			break;
		}
		case VTexFormat::PNG_RGBA8888:
		case VTexFormat::PNG_DXT5:
			int temp_w, temp_h; // fix for incorrect image size
			copy = ParsePNGInternal(image_data, image_size, temp_w, temp_h);
			break;
		case VTexFormat::RGBA8888:
			copy = malloc(out_image_size);
			memcpy(copy, image_data, out_image_size);
			break;
		case VTexFormat::BGRA8888: {
			copy = malloc(out_image_size);
			memcpy(copy, image_data, out_image_size);
			// we need to turn BGRA into RGBA, we can do this by just swapping R <=> B
			auto rgba = (unsigned char*)copy;
			for (size_t i = out_image_size > 0 ? out_image_size - 4 : 0; i != 0; i -= 4) {
				auto r = rgba[i]; // cache blue, so that we'll be able to fast swap
				rgba[i] = rgba[i + 2];
				rgba[i + 2] = r;
			}
			break;
		}
		case VTexFormat::I8:
		case VTexFormat::R16:
		case VTexFormat::RG1616:
		case VTexFormat::RGBA16161616:
		case VTexFormat::R16F:
		case VTexFormat::RG1616F:
		case VTexFormat::RGBA16161616F:
		case VTexFormat::R32F:
		case VTexFormat::RG3232F:
		case VTexFormat::RGB323232F:
		case VTexFormat::RGBA32323232F:
		case VTexFormat::JPEG_DXT5:
		case VTexFormat::JPEG_RGBA8888:
		case VTexFormat::IA88:
		default:
			DEBUG_PRINT("Unsupported vtex_c format: %hhu\n", vtex_header->format);
			return nullptr;
	}

	if (w != vtex_header->width || h != vtex_header->height) {
		auto header_width = vtex_header->width;
		auto copy2 = malloc((size_t)w * (size_t)h * 4ll);
		auto copy_iter = (uint32_t*)copy,
			copy2_iter = (uint32_t*)copy2;
		for (auto height = 0; height < h; height++, copy_iter += header_width, copy2_iter += w)
			for (auto width = 0; width < w; width++)
				copy2_iter[width] = copy_iter[width];

		free(copy);
		copy = copy2;
	}

	return (char*)copy;
}
