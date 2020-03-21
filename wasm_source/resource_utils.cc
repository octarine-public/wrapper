#include "stdafx.h"

#define DEBUG_PRINT(...) do {} while(false)

#pragma pack(push, 1)
struct ResourceHeader {
	uint32_t file_size;
	uint16_t header_version;
	uint16_t version;
	uint32_t block_offset;
	uint32_t block_count;
	// char offset[block_offset - 8];
	// BlockData[block_count] blocks_data;;
	// ...
};
#pragma pack(pop)

// https://github.com/SteamDatabase/ValveResourceFormat/blob/cdc150c810e124d6dfc4ec8911852a0278210835/ValveResourceFormat/Resource/Resource.cs#L161
BlockData* ExtractBlockFromResource(char* data, size_t data_size, const char* type) {
	auto invalid_res = "Invalid resource file.\n";
	constexpr uint16_t KnownHeaderVersion = 12;
	if (data_size < sizeof(ResourceHeader)) {
		DEBUG_PRINT("%s", invalid_res);
		return nullptr;
	}
	auto header = (ResourceHeader*)data;
	if (
		header->file_size == /* VPK magic */ 0x55AA1234
		|| header->file_size == /* compiled shader magic */ 0x32736376
		/*|| header->file_size != data_size*/ // TODO: Some real files seem to have different file size
		|| header->header_version != KnownHeaderVersion
	) {
		DEBUG_PRINT("%s", invalid_res);
		return nullptr;
	}

	data += header->block_offset + 8;
	char* image_data = nullptr;
	size_t image_size = 0;
	for (uint32_t i = 0, end = header->block_count; i < end; i++, data += sizeof(BlockData)) {
		auto block_data = (BlockData*)data;
		if (strncmp(block_data->type, type, 4) == 0)
			return block_data;
	}
	return nullptr;
}
