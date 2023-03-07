import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { GITHUB_REPO_URL } from '@/const'

export function middleware(request: NextRequest) {
    return NextResponse.redirect(GITHUB_REPO_URL)
}

export const config = {
    matcher: '/contribute',
}
