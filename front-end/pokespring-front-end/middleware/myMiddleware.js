export default function (ctx) {
  // We make sure the root path is redirected to the correct page
  if (ctx.route.fullPath === '/') {
    ctx.redirect(301, '/getting-started')
  }

  // If accessing the root path of an Universe, redirects to the characters
  if (ctx.route.name === 'universe-idUniverse') {
    ctx.redirect(301, (ctx.route.path + '/characters').replace('//', '/'))
  }

  // If accessing the root path of User, redirects to the characters
  if (ctx.route.path === '/user' || ctx.route.path === '/user/') {
    ctx.redirect(301, (ctx.route.path + '/my-characters').replace('//', '/'))
  }

  /*
  // If accessing a User's page while not logged, redirects to the main page
  if (ctx.route.path.startsWith('/user') && !ctx.store.auth.bIsConnected) {
    ctx.redirect(301, ('/getting-started'))
  }
  */
}
