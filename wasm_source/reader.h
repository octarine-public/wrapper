#include "stdafx.h"

class Reader {
public:
	FORCEINLINE Reader(uint8_t* pData, uint32_t uSize) : m_pData(pData), m_uSize(uSize), m_uPos(0) {}
	template<typename T>
	bool Read(T& out) {
		if (this->m_uSize - this->m_uPos < sizeof(T))
			return false;
		out = *(T*)&this->m_pData[this->m_uPos];
		this->m_uPos += sizeof(T);
		return true;
	}
	FORCEINLINE bool ReadBoolean(bool& out) {
		uint8_t byte;
		if (!this->Read(byte))
			return false;
		out = byte != 0;
		return true;
	}
	FORCEINLINE void SetPos(uint32_t new_pos) {
		this->m_uPos = new_pos;
	}

private:
	uint8_t* m_pData;
	uint32_t m_uSize;
	uint32_t m_uPos;
};
