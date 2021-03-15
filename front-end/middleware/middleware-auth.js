export default function (ctx) {
    const isLogged = ctx.store.getters['authentification/isLogged']

    // If the user's logged in
    if (isLogged) {
        // Does the user try again to login / signin ?
        const goesToLogin = ctx.route.name === 'auth-login'
        const goesToSignup = ctx.route.name === 'auth-signup'

        if (goesToLogin || goesToSignup) {
            // Redirect to main page
            ctx.redirect(301, '/')
        }
    } else {
        // Does the user try to logout when he's not even logged in ?
        const goesToLogout = ctx.route.name === 'auth-logout'

        if (goesToLogout) {
            // Redirect to main page
            ctx.redirect(301, '/')
        }
    }
}
