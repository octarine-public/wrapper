#include "stdafx.h"
#define Assert assert

struct BGRA8888_t {
	unsigned char b;		// change the order of names to change the 
	unsigned char g;		//  order of the output ARGB or BGRA, etc...
	unsigned char r;		//  Last one is MSB, 1st is LSB.
	unsigned char a;
	inline BGRA8888_t& operator=(const BGRA8888_t& in) {
		*(uint32_t*)this = *(uint32_t*)&in;
		return *this;
	}
};

struct RGBA8888_t {
	unsigned char r;		// change the order of names to change the 
	unsigned char g;		//  order of the output ARGB or BGRA, etc...
	unsigned char b;		//  Last one is MSB, 1st is LSB.
	unsigned char a;
	inline RGBA8888_t& operator=(const BGRA8888_t& in) {
		r = in.r;
		g = in.g;
		b = in.b;
		a = in.a;
		return *this;
	}
};

struct BGR565_t {
	unsigned short b : 5;		// order of names changes
	unsigned short g : 6;		//  byte order of output to 32 bit
	unsigned short r : 5;
	inline BGR565_t& operator=(const BGRA8888_t& in) {
		r = in.r >> 3;
		g = in.g >> 2;
		b = in.b >> 3;
		return *this;
	}
	inline BGR565_t& Set(int red, int green, int blue) {
		r = red >> 3;
		g = green >> 2;
		b = blue >> 3;
		return *this;
	}
};

struct DXTColBlock {
	uint16_t col0;
	uint16_t col1;

	// no bit fields - use bytes
	uint8_t row[4];
};

struct DXTAlphaBlock3BitLinear {
	uint8_t alpha0;
	uint8_t alpha1;

	uint8_t stuff[6];
};

FORCEINLINE uint16_t LittleShort(uint16_t l) {
#ifdef __BIG_ENDIAN__
	return (x >> 8) | (x << 8);
#else
	return l;
#endif
}

static inline void GetColorBlockColorsBGRA8888( DXTColBlock *pBlock, BGRA8888_t *col_0, 
											    BGRA8888_t *col_1, BGRA8888_t *col_2, 
												BGRA8888_t *col_3, uint16_t & wrd  )
{
	// input data is assumed to be x86 order
	// swap to target platform for proper dxt decoding
	uint16_t color0 = LittleShort( pBlock->col0 );
	uint16_t color1 = LittleShort( pBlock->col1 );

	// shift to full precision
	col_0->a = 0xff;
	col_0->r = ((BGR565_t*)&color0)->r << 3;
	col_0->g = ((BGR565_t*)&color0)->g << 2;
	col_0->b = ((BGR565_t*)&color0)->b << 3;

	col_1->a = 0xff;
	col_1->r = ((BGR565_t*)&color1)->r << 3;
	col_1->g = ((BGR565_t*)&color1)->g << 2;
	col_1->b = ((BGR565_t*)&color1)->b << 3;

	if ( color0 > color1 )
	{
		// Four-color block: derive the other two colors.    
		// 00 = color_0, 01 = color_1, 10 = color_2, 11 = color_3
		// These two bit codes correspond to the 2-bit fields 
		// stored in the 64-bit block.

		wrd = ((uint16_t)col_0->r * 2 + (uint16_t)col_1->r )/3;
											// no +1 for rounding
											// as bits have been shifted to 888
		col_2->r = (uint8_t)wrd;

		wrd = ((uint16_t)col_0->g * 2 + (uint16_t)col_1->g )/3;
		col_2->g = (uint8_t)wrd;

		wrd = ((uint16_t)col_0->b * 2 + (uint16_t)col_1->b )/3;
		col_2->b = (uint8_t)wrd;
		col_2->a = 0xff;

		wrd = ((uint16_t)col_0->r + (uint16_t)col_1->r *2 )/3;
		col_3->r = (uint8_t)wrd;

		wrd = ((uint16_t)col_0->g + (uint16_t)col_1->g *2 )/3;
		col_3->g = (uint8_t)wrd;

		wrd = ((uint16_t)col_0->b + (uint16_t)col_1->b *2 )/3;
		col_3->b = (uint8_t)wrd;
		col_3->a = 0xff;
	}
	else
	{
		// Three-color block: derive the other color.
		// 00 = color_0,  01 = color_1,  10 = color_2,  
		// 11 = transparent.
		// These two bit codes correspond to the 2-bit fields 
		// stored in the 64-bit block. 

		// explicit for each component, unlike some refrasts...????
		
		wrd = ((uint16_t)col_0->r + (uint16_t)col_1->r )/2;
		col_2->r = (uint8_t)wrd;
		wrd = ((uint16_t)col_0->g + (uint16_t)col_1->g )/2;
		col_2->g = (uint8_t)wrd;
		wrd = ((uint16_t)col_0->b + (uint16_t)col_1->b )/2;
		col_2->b = (uint8_t)wrd;
		col_2->a = 0xff;

		col_3->r = 0x00;		// random color to indicate alpha
		col_3->g = 0xff;
		col_3->b = 0xff;
		col_3->a = 0x00;
	}
}

template <class CDestPixel> 
static inline void DecodeColorBlock( CDestPixel *pOutputImage, DXTColBlock *pColorBlock, int width,
					                 BGRA8888_t *col_0, BGRA8888_t *col_1, 
					                 BGRA8888_t *col_2, BGRA8888_t *col_3 )
{
	// width is width of image in pixels
	uint32_t bits;
	int r,n;

	// bit masks = 00000011, 00001100, 00110000, 11000000
	const uint32_t masks[] = { 3 << 0, 3 << 2, 3 << 4, 3 << 6 };
	const int   shift[] = { 0, 2, 4, 6 };

	// r steps through lines in y
	for ( r=0; r < 4; r++, pOutputImage += width-4 )	// no width*4 as DWORD ptr inc will *4
	{
		// width * 4 bytes per pixel per line
		// each j dxtc row is 4 lines of pixels

		// n steps through pixels
		for ( n=0; n < 4; n++ )
		{
			bits = pColorBlock->row[r] & masks[n];
			bits >>= shift[n];

			switch( bits )
			{
			case 0:
				*pOutputImage = *col_0;
				pOutputImage++;		// increment to next output pixel
				break;
			case 1:
				*pOutputImage = *col_1;
				pOutputImage++;
				break;
			case 2:
				*pOutputImage = *col_2;
				pOutputImage++;
				break;
			case 3:
				*pOutputImage = *col_3;
				pOutputImage++;
				break;
			default:
				Assert( 0 );
				pOutputImage++;
				break;
			}
		}
	}
}

template <class CDestPixel> 
static inline void DecodeAlpha3BitLinear( CDestPixel *pImPos, DXTAlphaBlock3BitLinear *pAlphaBlock, int width, int nChannelSelect = 3 )
{
	static uint8_t		gBits[4][4];
	static uint16_t		gAlphas[8];
	static BGRA8888_t	gACol[4][4];

	gAlphas[0] = pAlphaBlock->alpha0;
	gAlphas[1] = pAlphaBlock->alpha1;

	// 8-alpha or 6-alpha block?    

	if( gAlphas[0] > gAlphas[1] )
	{
		// 8-alpha block:  derive the other 6 alphas.    
		// 000 = alpha_0, 001 = alpha_1, others are interpolated

		gAlphas[2] = ( 6 * gAlphas[0] +     gAlphas[1]) / 7;	// bit code 010
		gAlphas[3] = ( 5 * gAlphas[0] + 2 * gAlphas[1]) / 7;	// Bit code 011    
		gAlphas[4] = ( 4 * gAlphas[0] + 3 * gAlphas[1]) / 7;	// Bit code 100    
		gAlphas[5] = ( 3 * gAlphas[0] + 4 * gAlphas[1]) / 7;	// Bit code 101
		gAlphas[6] = ( 2 * gAlphas[0] + 5 * gAlphas[1]) / 7;	// Bit code 110    
		gAlphas[7] = (     gAlphas[0] + 6 * gAlphas[1]) / 7;	// Bit code 111
	}    
	else
	{
		// 6-alpha block:  derive the other alphas.    
		// 000 = alpha_0, 001 = alpha_1, others are interpolated

		gAlphas[2] = (4 * gAlphas[0] +     gAlphas[1]) / 5;	// Bit code 010
		gAlphas[3] = (3 * gAlphas[0] + 2 * gAlphas[1]) / 5;	// Bit code 011    
		gAlphas[4] = (2 * gAlphas[0] + 3 * gAlphas[1]) / 5;	// Bit code 100    
		gAlphas[5] = (    gAlphas[0] + 4 * gAlphas[1]) / 5;	// Bit code 101
		gAlphas[6] = 0;										// Bit code 110
		gAlphas[7] = 255;									// Bit code 111
	}

	// Decode 3-bit fields into array of 16 BYTES with same value

	// first two rows of 4 pixels each:
	// pRows = (Alpha3BitRows*) & ( pAlphaBlock->stuff[0] );
	const uint32_t mask = 0x00000007;		// bits = 00 00 01 11

	uint32_t bits = *( (uint32_t*) & ( pAlphaBlock->stuff[0] ));

	gBits[0][0] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[0][1] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[0][2] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[0][3] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[1][0] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[1][1] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[1][2] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[1][3] = (uint8_t)( bits & mask );

	// now for last two rows:
	bits = *( (uint32_t*) & ( pAlphaBlock->stuff[3] ));		// last 3 bytes

	gBits[2][0] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[2][1] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[2][2] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[2][3] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[3][0] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[3][1] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[3][2] = (uint8_t)( bits & mask );
	bits >>= 3;
	gBits[3][3] = (uint8_t)( bits & mask );

	// decode the codes into alpha values
	int row, pix;
	for ( row = 0; row < 4; row++ )
	{
		for ( pix=0; pix < 4; pix++ )
		{
			gACol[row][pix].a = (uint8_t) gAlphas[ gBits[row][pix] ];

			Assert( gACol[row][pix].r == 0 );
			Assert( gACol[row][pix].g == 0 );
			Assert( gACol[row][pix].b == 0 );
		}
	}

	// Write out alpha values to the image bits
	for ( row=0; row < 4; row++, pImPos += width-4 )
	{
		for ( pix = 0; pix < 4; pix++ )
		{
			// zero the alpha bits of image pixel
			switch ( nChannelSelect )
			{
				case 0:
					pImPos->r = ( *(( BGRA8888_t *) &(gACol[row][pix])) ).a;
					pImPos->g = 0;	// Danger...stepping on the other color channels
					pImPos->b = 0;
					pImPos->a = 0;
					break;
				case 1:
					pImPos->g = ( *(( BGRA8888_t *) &(gACol[row][pix])) ).a;
					break;
				case 2:
					pImPos->b = ( *(( BGRA8888_t *) &(gACol[row][pix])) ).a;
					break;
				default:
				case 3:
					pImPos->a = ( *(( BGRA8888_t *) &(gACol[row][pix])) ).a;
					break;
			}

			pImPos++;
		}
	}
}

void ConvertFromDXT1( const uint8_t *src, RGBA8888_t *dst, int width, int height ) {
	static_assert( sizeof( BGRA8888_t ) == 4 );
	static_assert( sizeof( RGBA8888_t ) == 4 );
	static_assert( sizeof( BGR565_t ) == 2 );

	int realWidth = 0;
	int realHeight = 0;
	RGBA8888_t*realDst = NULL;

	// Deal with the case where we have a dimension smaller than 4.
	if ( width < 4 || height < 4 )
	{
		realWidth = width;
		realHeight = height;
		// round up to the nearest four
		width = ( width + 3 ) & ~3;
		height = ( height + 3 ) & ~3;
		realDst = dst;
		dst = ( RGBA8888_t * )alloca( width * height * sizeof( RGBA8888_t ) );
		Assert( dst );
	}
	Assert( !( width % 4 ) );
	Assert( !( height % 4 ) );

	int xblocks, yblocks;
	xblocks = width >> 2;
	yblocks = height >> 2;
	RGBA8888_t *pDstScan = dst;
	uint32_t *pSrcScan = ( uint32_t * )src;

	DXTColBlock *pBlock;
	BGRA8888_t col_0, col_1, col_2, col_3;
	uint16_t wrdDummy;

	for ( int j = 0; j < yblocks; j++ )
	{
		// 8 bytes per block
		pBlock = ( DXTColBlock * )( ( uint8_t * )pSrcScan + j * xblocks * 8 );
		for ( int i=0; i < xblocks; i++, pBlock++ )
		{
			GetColorBlockColorsBGRA8888( pBlock, &col_0, &col_1, &col_2, &col_3, wrdDummy );

			// now decode the color block into the bitmap bits
			// inline func:
			pDstScan = dst + i*4 + j*4*width;
			DecodeColorBlock<RGBA8888_t>( pDstScan, pBlock, width, &col_0, &col_1, &col_2, &col_3 );
		}
	}

	// Deal with the case where we have a dimension smaller than 4.
	if ( realDst )
		for ( int y = 0; y < realHeight; y++ )
			for ( int x = 0; x < realWidth; x++ )
				realDst[x+(y*realWidth)] = dst[x+(y*width)];
}

void ConvertFromDXT5( const uint8_t *src, RGBA8888_t *dst, int width, int height )
{
	int realWidth = 0;
	int realHeight = 0;
	RGBA8888_t *realDst = NULL;

	// Deal with the case where we have a dimension smaller than 4.
	if ( width < 4 || height < 4 )
	{
		realWidth = width;
		realHeight = height;
		// round up to the nearest four
		width = ( width + 3 ) & ~3;
		height = ( height + 3 ) & ~3;
		realDst = dst;
		dst = ( RGBA8888_t * )alloca( width * height * sizeof( RGBA8888_t ) );
		Assert( dst );
	}
	Assert( !( width % 4 ) );
	Assert( !( height % 4 ) );

	int xblocks, yblocks;
	xblocks = width >> 2;
	yblocks = height >> 2;
	
	RGBA8888_t *pDstScan = dst;
	uint32_t *pSrcScan = ( uint32_t * )src;

	DXTColBlock				*pBlock;
	DXTAlphaBlock3BitLinear *pAlphaBlock;

	BGRA8888_t col_0, col_1, col_2, col_3;
	uint16_t wrd;

	for ( int j=0; j < yblocks; j++ )
	{
		// 8 bytes per block
		// 1 block for alpha, 1 block for color
		pBlock = (DXTColBlock*) ( (uint8_t *)pSrcScan + j * xblocks * 16 );

		for ( int i=0; i < xblocks; i++, pBlock ++ )
		{
			// inline
			// Get alpha block
			pAlphaBlock = (DXTAlphaBlock3BitLinear*) pBlock;

			// inline func:
			// Get color block & colors
			pBlock++;

			GetColorBlockColorsBGRA8888( pBlock, &col_0, &col_1, &col_2, &col_3, wrd );

			pDstScan = dst + i*4 + j*4*width;

			// Decode the color block into the bitmap bits
			// inline func:
			DecodeColorBlock<RGBA8888_t>( pDstScan, pBlock, width, &col_0, &col_1, &col_2, &col_3 );

			// Overwrite the previous alpha bits with the alpha block
			//  info
			DecodeAlpha3BitLinear( pDstScan, pAlphaBlock, width );
		}
	}

	// Deal with the case where we have a dimension smaller than 4.
	if ( realDst )
		for( int y = 0; y < realHeight; y++ )
			for( int x = 0; x < realWidth; x++ )
				realDst[x+(y*realWidth)] = dst[x+(y*width)];
}

// wrappers

void ConvertFromDXT1(const uint8_t *src, uint8_t *dst, int width, int height) {
	ConvertFromDXT1(src, (RGBA8888_t*)dst, width, height);
}

void ConvertFromDXT5(const uint8_t *src, uint8_t *dst, int width, int height) {
	ConvertFromDXT5(src, (RGBA8888_t*)dst, width, height);
}
