/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init'
// Angular requires Zone.js
// These are important and needed before anything else
/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */
import 'zone.js/dist/zone-node'
import 'reflect-metadata'

// import { enableProdMode } from '@angular/core';

import express from 'express'
import { join } from 'path'

import compression from 'compression'

import { APP_BASE_HREF } from '@angular/common'
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine'
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'
import { existsSync } from 'fs'
import { AppServerModule } from './src/main.server'

// import serve from '../isense/src/app'
// import { DB } from '../isense/src/db';
// var enforce = require('express-sslify')

export function app() {
  // Faster server renders w/ Prod mode (dev mode never needed)
  // enableProdMode()

  const app: express.Application = express()

  app.use(compression())


  const DIST_FOLDER = join(process.cwd(), 'dist/browser')
  const indexHtml = existsSync(join(DIST_FOLDER, 'index.orginal.html')) ? 'index.orginal.html' : 'index'


  // * NOTE :: leave this as require() since this file is built Dynamically from webpack AppServerModuleNgFactory
  // const { AppServerModule } = require('./dist/server/main');



  // ip = IP.toString();
  // app.set('port', port);
  // app.set('ip', ip);


  // Our Universal express-engine 
  // (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  //@ts-ignore
  app.engine('html', ngExpressEngine({
    bootstrap: AppServerModule/* ,
    providers: [
      provideModuleMap(LAZY_MODULE_MAP)
    ] */
  }))

  app.set('view engine', 'html')
  app.set('views', DIST_FOLDER)

  console.log(`DIST_FOLDER: ${DIST_FOLDER}`)
  // set Headers and methods
  // app.use((req, res, next) => {
  /* res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PATCH, POST, PUT, DELETE'); */
  /* if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
  
    console.log(`${req.ip} ${req.method} ${req.url}`);
    next();
  }
  
  });
  */
  // app.use(express.static(join(DIST_FOLDER, 'browser/assets'), { index: false }));

  // TODO: implement data requests securely
  app.get('/api/**', (req, res) => {
    res.status(404).send('data requests are not supported')
  })

  // Server static files from /browser
  app.get('*.*', express.static(DIST_FOLDER, { maxAge: '1y' }))

  // All regular routes use the Universal engine
  app.get('*', (req, res) => {
    // tslint:disable-next-line: no-console
    console.time(`GET: ${req.originalUrl}`)
    // res.render('index', { req });

    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] })
    // tslint:disable-next-line: no-console
    console.timeEnd(`GET: ${req.originalUrl}`)
  })

  return app
}


function run() {
  // tslint:disable-next-line: radix
  //  @ts-ignore
  const PORT = parseInt(process.env.PORT) || 4200
  /**
 * Get port from environment and store in Express.
 */
  var port = normalizePort(PORT.toString())

  /**
 * Create HTTPS server.
 */
  // for https
  // app.use(enforce.HTTPS({ trustProtoHeader: true }))

  /**
   * Listen on provided port, on all network interfaces.
   */


  // Start up the Node server
  const server = app()
  server.listen(port, () => { console.log(`Angular NodeJs Server listening on ${''}:${PORT}`) })
  server.on('error', (error: any) => {
    if (error.syscall !== 'listen') {
      throw error
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  })
  server.on('listening', onListening)
}



/**
 * Event listener for HTTP server "listening" event.
 */

async function onListening() {

  let addr = { port: 0 }// server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + (addr ? addr.port : null)
  try {
    // await DB.connect();
  } catch (err) {
    console.error(`Unable to connect to Mongo!`, err)
  }
  // debug('Listening on ' + bind);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  var port = parseInt(val, 10)

  if (isNaN(port)) { return val }	// named pipe
  if (port >= 0) { return port }	// port number
  return false
}

/**
 * Event listener for HTTP server "error" event.
 */


// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire
const mainModule = __non_webpack_require__.main
const moduleFilename = mainModule && mainModule.filename || ''
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run()
}

export * from './src/main.server'