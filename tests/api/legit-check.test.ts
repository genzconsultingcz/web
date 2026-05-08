import { describe, it, expect, vi } from 'vitest'

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    },
  })),
}))

// Import AFTER mock
const importRoute = () => import('@/app/api/legit-check/route')

describe('POST /api/legit-check', () => {
  it('returns 400 for missing email', async () => {
    const { POST } = await importRoute()
    const req = new Request('http://localhost/api/legit-check', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it('returns 400 for invalid email format', async () => {
    const { POST } = await importRoute()
    const req = new Request('http://localhost/api/legit-check', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 with downloadUrl for valid email', async () => {
    const { POST } = await importRoute()
    const req = new Request('http://localhost/api/legit-check', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.downloadUrl).toBe('/downloads/legit-check.pdf')
  })
})
