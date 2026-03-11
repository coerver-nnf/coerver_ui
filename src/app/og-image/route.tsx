import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Coerver Yellow Ball */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: '#FFD700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
              boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)',
            }}
          >
            <span style={{ fontSize: 60, fontWeight: 900, color: '#000' }}>C</span>
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 10,
              letterSpacing: '-2px',
            }}
          >
            COERVER COACHING
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: '#FFD700',
              letterSpacing: '4px',
            }}
          >
            CROATIA
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#999',
              marginTop: 30,
            }}
          >
            Nogometna Akademija | Kampovi | Edukacija Trenera
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
