import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
    matcher: ['/', '/portal/:path*'],
}

export default async function GetLoginData(request: NextRequest) {
    const url = request.nextUrl.clone()
    const usuario = request.cookies.get('usuario')
    const empresa = request.cookies.get('empresa')

    if (!usuario && url.pathname !== "/") {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (url.pathname !== "/portal/escolher-empresa" && !!usuario && !empresa) {
        url.pathname = '/portal/escolher-empresa'
        return NextResponse.redirect(url)
    }

    if ((url.pathname === "/" || url.pathname === "/portal/escolher-empresa") && (!!usuario && !!empresa)) {
        url.pathname = '/portal/calculadora'
        return NextResponse.redirect(url)
    }

    if (
        url.pathname === "/portal/usuarios"
    ) {
        const em = JSON.parse(empresa?.value || "")
        if (!(em.tpUsuario === "MASTER" || em.tpUsuario === "ADMINISTRATIVO")) {
            url.pathname = '/portal/calculadora'
            return NextResponse.redirect(url)
        }
    }

    if (
        url.pathname === "/portal/empresas"
    ) {
        const em = JSON.parse(empresa?.value || "")
        if (!(em.tpUsuario === "MASTER")) {
            url.pathname = '/portal/calculadora'
            return NextResponse.redirect(url)
        }
    }

    if (
        url.pathname === "/portal/calculadora" ||
        url.pathname === "/portal/dashboard"
    ) {
        const em = JSON.parse(empresa?.value || "")
        if (em.tpUsuario === "ADMINISTRATIVO") {
            url.pathname = '/portal/usuarios'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}
