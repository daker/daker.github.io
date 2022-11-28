try{self["workbox:core:6.5.3"]&&_()}catch(e){}const e=(e,...s)=>{let t=e;return s.length>0&&(t+=` :: ${JSON.stringify(s)}`),t};class s extends Error{constructor(s,t){super(e(s,t)),this.name=s,this.details=t}}try{self["workbox:routing:6.5.3"]&&_()}catch(e){}const t=e=>e&&"object"==typeof e?e:{handle:e};class a{constructor(e,s,a="GET"){this.handler=t(s),this.match=e,this.method=a}setCatchHandler(e){this.catchHandler=t(e)}}class i extends a{constructor(e,s,t){super((({url:s})=>{const t=e.exec(s.href);if(t&&(s.origin===location.origin||0===t.index))return t.slice(1)}),s,t)}}class n{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:s}=e,t=this.handleRequest({request:s,event:e});t&&e.respondWith(t)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:s}=e.data,t=Promise.all(s.urlsToCache.map((s=>{"string"==typeof s&&(s=[s]);const t=new Request(...s);return this.handleRequest({request:t,event:e})})));e.waitUntil(t),e.ports&&e.ports[0]&&t.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:s}){const t=new URL(e.url,location.href);if(!t.protocol.startsWith("http"))return;const a=t.origin===location.origin,{params:i,route:n}=this.findMatchingRoute({event:s,request:e,sameOrigin:a,url:t});let r=n&&n.handler;const o=e.method;if(!r&&this.i.has(o)&&(r=this.i.get(o)),!r)return;let c;try{c=r.handle({url:t,request:e,event:s,params:i})}catch(e){c=Promise.reject(e)}const f=n&&n.catchHandler;return c instanceof Promise&&(this.o||f)&&(c=c.catch((async a=>{if(f)try{return await f.handle({url:t,request:e,event:s,params:i})}catch(e){e instanceof Error&&(a=e)}if(this.o)return this.o.handle({url:t,request:e,event:s});throw a}))),c}findMatchingRoute({url:e,sameOrigin:s,request:t,event:a}){const i=this.t.get(t.method)||[];for(const n of i){let i;const r=n.match({url:e,sameOrigin:s,request:t,event:a});if(r)return i=r,(Array.isArray(i)&&0===i.length||r.constructor===Object&&0===Object.keys(r).length||"boolean"==typeof r)&&(i=void 0),{route:n,params:i}}return{}}setDefaultHandler(e,s="GET"){this.i.set(s,t(e))}setCatchHandler(e){this.o=t(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new s("unregister-route-but-not-found-with-method",{method:e.method});const t=this.t.get(e.method).indexOf(e);if(!(t>-1))throw new s("unregister-route-route-not-registered");this.t.get(e.method).splice(t,1)}}let r;const o=()=>(r||(r=new n,r.addFetchListener(),r.addCacheListener()),r);function c(e,t,n){let r;if("string"==typeof e){const s=new URL(e,location.href);r=new a((({url:e})=>e.href===s.href),t,n)}else if(e instanceof RegExp)r=new i(e,t,n);else if("function"==typeof e)r=new a(e,t,n);else{if(!(e instanceof a))throw new s("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});r=e}return o().registerRoute(r),r}try{self["workbox:strategies:6.5.3"]&&_()}catch(e){}const f={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null},l={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},d=e=>[l.prefix,e,l.suffix].filter((e=>e&&e.length>0)).join("-"),u=e=>{(e=>{for(const s of Object.keys(l))e(s)})((s=>{"string"==typeof e[s]&&(l[s]=e[s])}))},b=e=>e||d(l.precache),h=e=>e||d(l.runtime);function p(e,s){const t=new URL(e);for(const e of s)t.searchParams.delete(e);return t.href}class g{constructor(){this.promise=new Promise(((e,s)=>{this.resolve=e,this.reject=s}))}}const v=new Set;function m(e){return"string"==typeof e?new Request(e):e}class w{constructor(e,s){this.l={},Object.assign(this,s),this.event=s.event,this.u=e,this.h=new g,this.p=[],this.g=[...e.plugins],this.v=new Map;for(const e of this.g)this.v.set(e,{});this.event.waitUntil(this.h.promise)}async fetch(e){const{event:t}=this;let a=m(e);if("navigate"===a.mode&&t instanceof FetchEvent&&t.preloadResponse){const e=await t.preloadResponse;if(e)return e}const i=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:t})}catch(e){if(e instanceof Error)throw new s("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const n=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this.u.fetchOptions);for(const s of this.iterateCallbacks("fetchDidSucceed"))e=await s({event:t,request:n,response:e});return e}catch(e){throw i&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:i.clone(),request:n.clone()}),e}}async fetchAndCachePut(e){const s=await this.fetch(e),t=s.clone();return this.waitUntil(this.cachePut(e,t)),s}async cacheMatch(e){const s=m(e);let t;const{cacheName:a,matchOptions:i}=this.u,n=await this.getCacheKey(s,"read"),r=Object.assign(Object.assign({},i),{cacheName:a});t=await caches.match(n,r);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))t=await e({cacheName:a,matchOptions:i,cachedResponse:t,request:n,event:this.event})||void 0;return t}async cachePut(e,t){const a=m(e);var i;await(i=0,new Promise((e=>setTimeout(e,i))));const n=await this.getCacheKey(a,"write");if(!t)throw new s("cache-put-with-no-response",{url:(r=n.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const o=await this.m(t);if(!o)return!1;const{cacheName:c,matchOptions:f}=this.u,l=await self.caches.open(c),d=this.hasCallback("cacheDidUpdate"),u=d?await async function(e,s,t,a){const i=p(s.url,t);if(s.url===i)return e.match(s,a);const n=Object.assign(Object.assign({},a),{ignoreSearch:!0}),r=await e.keys(s,n);for(const s of r)if(i===p(s.url,t))return e.match(s,a)}(l,n.clone(),["__WB_REVISION__"],f):null;try{await l.put(n,d?o.clone():o)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of v)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:u,newResponse:o.clone(),request:n,event:this.event});return!0}async getCacheKey(e,s){const t=`${e.url} | ${s}`;if(!this.l[t]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=m(await e({mode:s,request:a,event:this.event,params:this.params}));this.l[t]=a}return this.l[t]}hasCallback(e){for(const s of this.u.plugins)if(e in s)return!0;return!1}async runCallbacks(e,s){for(const t of this.iterateCallbacks(e))await t(s)}*iterateCallbacks(e){for(const s of this.u.plugins)if("function"==typeof s[e]){const t=this.v.get(s),a=a=>{const i=Object.assign(Object.assign({},a),{state:t});return s[e](i)};yield a}}waitUntil(e){return this.p.push(e),e}async doneWaiting(){let e;for(;e=this.p.shift();)await e}destroy(){this.h.resolve(null)}async m(e){let s=e,t=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(s=await e({request:this.request,response:s,event:this.event})||void 0,t=!0,!s)break;return t||s&&200!==s.status&&(s=void 0),s}}class y{constructor(e={}){this.cacheName=h(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[s]=this.handleAll(e);return s}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const s=e.event,t="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,i=new w(this,{event:s,request:t,params:a}),n=this.j(i,t,s);return[n,this.R(n,i,t,s)]}async j(e,t,a){let i;await e.runCallbacks("handlerWillStart",{event:a,request:t});try{if(i=await this.k(t,e),!i||"error"===i.type)throw new s("no-response",{url:t.url})}catch(s){if(s instanceof Error)for(const n of e.iterateCallbacks("handlerDidError"))if(i=await n({error:s,event:a,request:t}),i)break;if(!i)throw s}for(const s of e.iterateCallbacks("handlerWillRespond"))i=await s({event:a,request:t,response:i});return i}async R(e,s,t,a){let i,n;try{i=await e}catch(n){}try{await s.runCallbacks("handlerDidRespond",{event:a,request:t,response:i}),await s.doneWaiting()}catch(e){e instanceof Error&&(n=e)}if(await s.runCallbacks("handlerDidComplete",{event:a,request:t,response:i,error:n}),s.destroy(),n)throw n}}function x(e,s){const t=s();return e.waitUntil(t),t}try{self["workbox:precaching:6.5.3"]&&_()}catch(e){}function j(e){if(!e)throw new s("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const s=new URL(e,location.href);return{cacheKey:s.href,url:s.href}}const{revision:t,url:a}=e;if(!a)throw new s("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(a,location.href),n=new URL(a,location.href);return i.searchParams.set("__WB_REVISION__",t),{cacheKey:i.href,url:n.href}}class R{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:s})=>{s&&(s.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:s,cachedResponse:t})=>{if("install"===e.type&&s&&s.originalRequest&&s.originalRequest instanceof Request){const e=s.originalRequest.url;t?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return t}}}class k{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:s})=>{const t=(null==s?void 0:s.cacheKey)||this.q.getCacheKeyForURL(e.url);return t?new Request(t,{headers:e.headers}):e},this.q=e}}let q,U;async function L(e,t){let a=null;if(e.url){a=new URL(e.url).origin}if(a!==self.location.origin)throw new s("cross-origin-copy-response",{origin:a});const i=e.clone(),n={headers:new Headers(i.headers),status:i.status,statusText:i.statusText},r=t?t(n):n,o=function(){if(void 0===q){const e=new Response("");if("body"in e)try{new Response(e.body),q=!0}catch(e){q=!1}q=!1}return q}()?i.body:await i.blob();return new Response(o,r)}class E extends y{constructor(e={}){e.cacheName=b(e.cacheName),super(e),this.U=!1!==e.fallbackToNetwork,this.plugins.push(E.copyRedirectedCacheableResponsesPlugin)}async k(e,s){const t=await s.cacheMatch(e);return t||(s.event&&"install"===s.event.type?await this.L(e,s):await this._(e,s))}async _(e,t){let a;const i=t.params||{};if(!this.U)throw new s("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{const s=i.integrity,n=e.integrity,r=!n||n===s;a=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?n||s:void 0})),s&&r&&"no-cors"!==e.mode&&(this.C(),await t.cachePut(e,a.clone()))}return a}async L(e,t){this.C();const a=await t.fetch(e);if(!await t.cachePut(e,a.clone()))throw new s("bad-precaching-response",{url:e.url,status:a.status});return a}C(){let e=null,s=0;for(const[t,a]of this.plugins.entries())a!==E.copyRedirectedCacheableResponsesPlugin&&(a===E.defaultPrecacheCacheabilityPlugin&&(e=t),a.cacheWillUpdate&&s++);0===s?this.plugins.push(E.defaultPrecacheCacheabilityPlugin):s>1&&null!==e&&this.plugins.splice(e,1)}}E.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},E.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await L(e):e};class C{constructor({cacheName:e,plugins:s=[],fallbackToNetwork:t=!0}={}){this.O=new Map,this.N=new Map,this.P=new Map,this.u=new E({cacheName:b(e),plugins:[...s,new k({precacheController:this})],fallbackToNetwork:t}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.u}precache(e){this.addToCacheList(e),this.T||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.T=!0)}addToCacheList(e){const t=[];for(const a of e){"string"==typeof a?t.push(a):a&&void 0===a.revision&&t.push(a.url);const{cacheKey:e,url:i}=j(a),n="string"!=typeof a&&a.revision?"reload":"default";if(this.O.has(i)&&this.O.get(i)!==e)throw new s("add-to-cache-list-conflicting-entries",{firstEntry:this.O.get(i),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this.P.has(e)&&this.P.get(e)!==a.integrity)throw new s("add-to-cache-list-conflicting-integrities",{url:i});this.P.set(e,a.integrity)}if(this.O.set(i,e),this.N.set(i,n),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return x(e,(async()=>{const s=new R;this.strategy.plugins.push(s);for(const[s,t]of this.O){const a=this.P.get(t),i=this.N.get(s),n=new Request(s,{integrity:a,cache:i,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:t},request:n,event:e}))}const{updatedURLs:t,notUpdatedURLs:a}=s;return{updatedURLs:t,notUpdatedURLs:a}}))}activate(e){return x(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),s=await e.keys(),t=new Set(this.O.values()),a=[];for(const i of s)t.has(i.url)||(await e.delete(i),a.push(i.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this.O}getCachedURLs(){return[...this.O.keys()]}getCacheKeyForURL(e){const s=new URL(e,location.href);return this.O.get(s.href)}getIntegrityForCacheKey(e){return this.P.get(e)}async matchPrecache(e){const s=e instanceof Request?e.url:e,t=this.getCacheKeyForURL(s);if(t){return(await self.caches.open(this.strategy.cacheName)).match(t)}}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new s("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}const O=()=>(U||(U=new C),U);class N extends a{constructor(e,s){super((({request:t})=>{const a=e.getURLsToCacheKeys();for(const i of function*(e,{ignoreURLParametersMatching:s=[/^utm_/,/^fbclid$/],directoryIndex:t="index.html",cleanURLs:a=!0,urlManipulation:i}={}){const n=new URL(e,location.href);n.hash="",yield n.href;const r=function(e,s=[]){for(const t of[...e.searchParams.keys()])s.some((e=>e.test(t)))&&e.searchParams.delete(t);return e}(n,s);if(yield r.href,t&&r.pathname.endsWith("/")){const e=new URL(r.href);e.pathname+=t,yield e.href}if(a){const e=new URL(r.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:n});for(const s of e)yield s.href}}(t.url,s)){const s=a.get(i);if(s){return{cacheKey:s,integrity:e.getIntegrityForCacheKey(s)}}}}),e.strategy)}}var P;u({prefix:"EleventyPluginWorkbox"}),self.skipWaiting(),self.addEventListener("activate",(()=>self.clients.claim())),P={directoryIndex:"index.html"},function(e){O().precache(e)}([{url:"/404.html",revision:"3d653721f455ad79f21d8c42cd3723cf"},{url:"/index.html",revision:"5e3f9c38c30e208013afa2b01aa8a0d3"},{url:"/manifest.json",revision:"936b7680468b8387d9caa02bffa04856"},{url:"/privacy.html",revision:"f677d9e99039124ba64f835b0e76e070"},{url:"/2013/05/5-html5-features-you-need-to-know.html",revision:"d1fdf9e13532946edf8b4432b0336c2a"},{url:"/2013/05/5-sublimetext2-packages-to-enhance-your-frontend-development-workflow.html",revision:"da409484aa6bc739888a9fa136637db3"},{url:"/2013/05/hello-world.html",revision:"381ad846c0bd09251dd85f86abe34906"},{url:"/2013/06/5-css3-features-explained.html",revision:"08a651a1610378a780339e536deed60b"},{url:"/2013/06/5-html5-javascript-apis-to-keep-an-eye-on.html",revision:"c8a8dfc8e521356528838f7e28f55ffb"},{url:"/2013/06/gruntjs-takes-your-workflow-to-the-next-level.html",revision:"b3e8ff87f48c14e6f819853e39f05d73"},{url:"/2013/06/pocket-tv-turns-any-tv-into-an-android-smart-tv.html",revision:"101eeabce041fc5e5b3e0888d722ca62"},{url:"/2013/07/how-to-make-sticky-elements-using-position-sticky.html",revision:"556ccf4bc0d991456d7053b93bddce40"},{url:"/2013/07/testing-your-responsive-design-with-phantomjs.html",revision:"5cac8fc3e299d7299b5e7bfad664a09b"},{url:"/2013/07/understanding-css3-box-sizing-property.html",revision:"3cd8f4dd303c21647bc6575b2a8a0d74"},{url:"/2013/07/why-stylus-fit-better-my-needs.html",revision:"278a0cbcd77be42f58eb09b21c7c52f1"},{url:"/2013/08/thank-you-ubuntu.html",revision:"8454d797733680345b259d41a45ca547"},{url:"/2013/09/5-devtools-features-to-help-you-debug-your-webapp.html",revision:"0d8f321c2dba3cfb6e7680eba12aa524"},{url:"/2013/09/adding-persona-authentication-to-your-django-project.html",revision:"9d9b9e8859845ef5078738c3fee951b3"},{url:"/2013/09/automate-your-dev-environment-with-vagrant.html",revision:"edaf218f8ce3dc3e7f33e0edb704e01e"},{url:"/2013/09/introduction-to-web-components-next-generation-markup.html",revision:"d47fd1af786254b476ec4a4d2fcbaa51"},{url:"/2013/10/package-your-webapp-for-ubuntu-touch.html",revision:"c787fb6843eab22cbde1f7875b7e6d2b"},{url:"/2013/11/adding-usermetrics-to-your-app-on-ubuntu-touch.html",revision:"7f6340894806b4eeb8491b292b9c8162"},{url:"/2013/11/ubuntu-touch-user-agent.html",revision:"a5a1f94b5024943a3996a934392eab1b"},{url:"/2013/11/web-apps-remote-debugging-on-ubuntu-touch.html",revision:"ed6da6604e96363a3a24e9c0c630c5f2"},{url:"/2013/12/devtools-console-from-novice-to-ninja.html",revision:"5d8c79c59d2e13ce24dac8ec644ae983"},{url:"/2014/01/chrome-requestautocomplete-better-payment-web-mobile.html",revision:"b9117455f274b7003cd98e8299405d6f"},{url:"/2014/01/how-to-use-the-built-in-screen-recording-in-android-4.html",revision:"5e8d2cd4e617efb0216f8c0c2793b208"},{url:"/2014/02/on-using-the-html-media-capture-in-mobile-browsers.html",revision:"7103351b33fda8fb35378e5b8931407f"},{url:"/2014/03/update-on-the-ubuntu-html5-sdk-ui.html",revision:"59db5a248260718402692ce402c2a9b2"},{url:"/2014/04/4-css-tricks-for-vertical-alignment.html",revision:"0bfe8c9ffc51e930eaf7fede72b58643"},{url:"/2014/05/canonical-sprint-in-malta.html",revision:"487546149ff196b98871fdbb471997f0"},{url:"/2014/05/how-to-use-oxide-in-your-ubuntu-qml-application.html",revision:"dc44caf0dd22a993f524f4123120a8b5"},{url:"/2014/06/how-i-did-make-the-ubuntu-html5-range-slider.html",revision:"db6e476286a1a3a4ef8df4effe60a4ee"},{url:"/2014/07/ubuntu-touch-session-in-morocco.html",revision:"c3430521be8ec280ccb1c96fec6d5ed6"},{url:"/2014/08/everything-you-need-to-know-about-html5-video.html",revision:"fe78d4e08af2fff06e24f48f4cb372ae"},{url:"/2014/10/how-to-fix-perl-warning-setting-locale-failed-in-raspbian.html",revision:"59d85a1b16289e538f878a87a656bfc5"},{url:"/2014/12/fishing-as-a-hobby.html",revision:"cc6c819d50af57019bbd69ff07e45470"},{url:"/2015/01/fix-morocco-borders-on-google-maps.html",revision:"3cc0c4c88776ddffae8c7e2ee8b89591"},{url:"/2015/03/running-dekko-in-lxc.html",revision:"9d4312488d80843e1e4ee30019f73bcb"},{url:"/2015/09/migrating-emails-between-imap-servers-with-imapsync.html",revision:"7f954d9ed6f2a50f7c88d6a86ae24827"},{url:"/2016/01/how-to-integrate-slack-with-launchpad.html",revision:"7bef89dea26287ed6d671cd610f721a3"},{url:"/2016/08/flashing-lolin-v3-nodemcu-firmware.html",revision:"747511020c5b74ea27ab387c6bc69701"},{url:"/2017/08/fix-morocco-borders-on-google-maps-2017-version.html",revision:"9960c49825cd64eba1039a84900b85c6"},{url:"/2022/11/clearing-out-the-cobwebs.html",revision:"cf750d4da30e55587a26e585eb1267a7"},{url:"/archive/index.html",revision:"22e7914ed9ba9727c4908a34e7b48df6"},{url:"/assets/css/fonts/lora-v13-latin-700.woff2",revision:"ce18d17335e3ef2119d76f5dff177c66"},{url:"/assets/css/fonts/lora-v13-latin-regular.woff2",revision:"e4cdb14bf148f2846997a6be7ba648bd"},{url:"/assets/css/prism-base16-monokai.dark.css",revision:"64c4789161d23b28f482daea8f6b50f2"},{url:"/assets/css/prism-base16-monokai.light.css",revision:"368bbefe5e65c559f8ba7e42e9188a32"},{url:"/assets/css/styles.css",revision:"3b9aa143b91800c63be8b531b2e824c9"},{url:"/assets/img/404.png",revision:"4711846186a7b81b7737e76d40f5edb1"},{url:"/assets/img/avatar.webp",revision:"43d516f2062bd13043c792489c326aa1"},{url:"/assets/img/browsers.png",revision:"1897eeaf8570464858841699ad351bf0"},{url:"/assets/img/dark.svg",revision:"a3e0519ba769af88675f34e29a6871af"},{url:"/assets/img/favicon-144.jpg",revision:"e7b375b77be76e17682a41b59d5bdeea"},{url:"/assets/img/favicon-192.jpg",revision:"5517ba976aec623b2b919b8b157d41ac"},{url:"/assets/img/favicon-512.jpg",revision:"9ba971ebb467af0588a6554fc2aba0a9"},{url:"/assets/img/favicon.jpg",revision:"c456434cd0c75f748ed2d485f3653b02"},{url:"/assets/img/gh.svg",revision:"bc409a512c3e276c1997a15271ec9e4d"},{url:"/assets/img/light-auto.svg",revision:"48179c3a396d1fe65de704a5ed0c23f8"},{url:"/assets/img/light.svg",revision:"b0cb247b1efefe465f90f43655222b20"},{url:"/assets/img/linkedin.svg",revision:"472696b7fffb01fb64ef8ea1002db199"},{url:"/assets/img/mail.svg",revision:"2fd54d360d35e488d2e08237c2e9fda3"},{url:"/assets/img/next.svg",revision:"3259cf06caea97641157d7955bcd6a22"},{url:"/assets/img/prev.svg",revision:"facbbf1a38a541a07468c930e5a5a1b5"},{url:"/assets/img/tag.svg",revision:"93c66ef8f7c8de1bee8c64a7a1275806"},{url:"/assets/img/twitter.svg",revision:"e1551deb3a05186ebe89944c29ca75e6"},{url:"/assets/posts/android4.4/usb-debugging.png",revision:"428687cebd6945ec6817fe41fe24a69c"},{url:"/assets/posts/android4.4/usb-debugging2.png",revision:"b5317d5ecf42101834aefec64ed2a42b"},{url:"/assets/posts/box-model.png",revision:"f3f766a87820dd7b6038d6cdbda0c57e"},{url:"/assets/posts/css-sticky.png",revision:"9bb429c463f2e62c12dedfb0ddf79b31"},{url:"/assets/posts/dekko/dekko.jpg",revision:"72c76a7dff08a52389f80bda788e5941"},{url:"/assets/posts/dekko/lxc-logo.png",revision:"8d45c06f6795008e589d5af602c8bc66"},{url:"/assets/posts/deviceorientation.png",revision:"35577b36deaad75d1c92f9351c250e18"},{url:"/assets/posts/devtools/breakpoints.png",revision:"8e00b77e522b36e291207b6406ebe6ea"},{url:"/assets/posts/devtools/devtools.png",revision:"f656ec2bd0bef64fd3fa19134b8c304b"},{url:"/assets/posts/devtools/dom-breakpoints.png",revision:"f5c13616a901df88a8ae127097f7a2d7"},{url:"/assets/posts/devtools/monitorEvents.png",revision:"79e9aa725725fc4af6c99d9a15922975"},{url:"/assets/posts/devtools/pprint-after.png",revision:"2ae3b5f8a822ad43e6d61aa7fc784f9d"},{url:"/assets/posts/devtools/pprint-before.png",revision:"c22576bcd811dbcc7c29d4d062085a62"},{url:"/assets/posts/devtools/remote-debugging.png",revision:"72fe5ca8d39635bde106b95ae9243d86"},{url:"/assets/posts/fishing.jpg",revision:"0a3492be69d19c26a78f6ed35561331c"},{url:"/assets/posts/fishing2.jpg",revision:"6540896ab4b3d4aff91c6542b2e657cf"},{url:"/assets/posts/grunt-logo.png",revision:"44b12d9e0ea09a8f1566abd7934d9e70"},{url:"/assets/posts/html5-logo.png",revision:"6616c2c7c29150386c351e13c60b2376"},{url:"/assets/posts/html5-video/controls-chrome.png",revision:"667dee55a280114d4ac5b41914e391ee"},{url:"/assets/posts/html5-video/controls-ff.png",revision:"24d60b4fa49b91342cb306bc1fe8b63f"},{url:"/assets/posts/html5-video/controls-safari.png",revision:"a0e958b2aa169a7b92d4dedd3d2c629c"},{url:"/assets/posts/html5-video/cover.jpg",revision:"48d0bb0c088feccd50c76fbe582d7c35"},{url:"/assets/posts/imapsync.png",revision:"a876d73f1ce0f44775797f99c8acbb05"},{url:"/assets/posts/input-date-time.png",revision:"fe0eeb95facbe15c828e86b870ad7c48"},{url:"/assets/posts/jsconsole/console.png",revision:"ee48b306bc10ce7e8073041713f6d26e"},{url:"/assets/posts/jsconsole/dir.png",revision:"8289053adbad77e9048573c089fe9bbd"},{url:"/assets/posts/jsconsole/filters.png",revision:"8bbfdebd7fe85a31aa1e1dd61c1b3cd4"},{url:"/assets/posts/jsconsole/logging.png",revision:"26696f080eb6b7d164ac0f067268c983"},{url:"/assets/posts/jsconsole/nested.png",revision:"411b739e0b3b9af74bf184b5944f4e9c"},{url:"/assets/posts/jsconsole/table.png",revision:"a65d95c035e2507d5820a93a0f6814b0"},{url:"/assets/posts/jsconsole/trace.png",revision:"683bbaad82cfee9490c0c0bdd7efc222"},{url:"/assets/posts/lolin/board.jpg",revision:"e1a99cd069cdad15faddeb5f0693c55f"},{url:"/assets/posts/lolin/esplorer.jpg",revision:"0e344b326f490d55b59da6a9d837aff2"},{url:"/assets/posts/malta/photo-group.jpg",revision:"d03ba2bfdffd6f23a627ec73cb233078"},{url:"/assets/posts/media-capture/audio-chrome1.png",revision:"04227d7eca035dbadc0b16230abb3183"},{url:"/assets/posts/media-capture/audio-chrome2.png",revision:"b16b760e3bb4bcc71223c78c53aab0f0"},{url:"/assets/posts/media-capture/audio-firefox.png",revision:"59c8de47841ea07f4be43d6e3c048c6d"},{url:"/assets/posts/media-capture/image-chrome1.png",revision:"b67e6ee735a4200e251a4c23f94ec85c"},{url:"/assets/posts/media-capture/image-chrome2.png",revision:"723fa031a320a5d566e4364e1960f5ba"},{url:"/assets/posts/media-capture/image-firefox.png",revision:"6420ce50f573fbe6eeb991d0f1c12ba1"},{url:"/assets/posts/media-capture/video-chrome1.png",revision:"6ea971e9a6ffe22b78999dfe1057cb69"},{url:"/assets/posts/media-capture/video-chrome2.png",revision:"a3a98f11987efe6752234d3f2846e39a"},{url:"/assets/posts/media-capture/video-firefox.png",revision:"26ec9a764cc734b2c76c5e1bbdd07e58"},{url:"/assets/posts/morocco.png",revision:"d19acf2eb58c0a6b5bc50b6fcad0cc79"},{url:"/assets/posts/persona-mozilla.jpg",revision:"07d9917c5e95696b9d4965ac81d4aeb5"},{url:"/assets/posts/phantomjs-demo.png",revision:"bd69a89f7366d21cb4b5f9e6b07942da"},{url:"/assets/posts/phantomjs.png",revision:"1d0d9d521b4f0ffa845df355574f038c"},{url:"/assets/posts/ptv-air.jpg",revision:"6ea9fa2453f4acac97ba3cba9f036bc7"},{url:"/assets/posts/ptv-ir.jpg",revision:"94ba2f5abdd8e2acb422caaecc48a38a"},{url:"/assets/posts/ptv.jpg",revision:"fea7f512647dfaccfa2f0a441d64a7f9"},{url:"/assets/posts/requestAutocomplete/1.png",revision:"5d6bf446d6b3f3f46e56f79aff3bb54f"},{url:"/assets/posts/requestAutocomplete/2.png",revision:"d335f94f40582a3b8137622c4c7f9056"},{url:"/assets/posts/rpi-logo.png",revision:"bd81d04de5a48d1707c35f75073431f2"},{url:"/assets/posts/slack/bug.png",revision:"628736acbd8b8834c390c1d84e4e0712"},{url:"/assets/posts/slack/lp_slack.png",revision:"3e7074a2f59c5244448df688e2e96741"},{url:"/assets/posts/slack/mr.png",revision:"bde9a78307dc50bf20840f4d84ea91ec"},{url:"/assets/posts/stylus.png",revision:"a94b9725a4f120befee0ec547ef9536d"},{url:"/assets/posts/sublime-palette.png",revision:"5f105d0a78a38abaa29039cb2b616008"},{url:"/assets/posts/sublime.png",revision:"bed7088dd8d1e61ecb86841f8277e7a1"},{url:"/assets/posts/ubuntu-browser.png",revision:"f900b77052fb72f646c727806d94f1ea"},{url:"/assets/posts/ubuntu-html5.png",revision:"87fb887cd1b73c1287f0e27f4e50928e"},{url:"/assets/posts/ubuntu/1.jpg",revision:"348dc3ea06debd4e195963cdf2db1c1a"},{url:"/assets/posts/ubuntu/2.jpg",revision:"a224d7b80baf15ca1272e09a245293df"},{url:"/assets/posts/ubuntu/3.jpg",revision:"8f7f302cf5158050c89662032060b744"},{url:"/assets/posts/ubuntu/4.jpg",revision:"732535c666b6faf329dcbd12b804aa20"},{url:"/assets/posts/ubuntu/certificate.jpg",revision:"ab360aa20fdb9cf3ae71eca880d95cdd"},{url:"/assets/posts/ubuntu/ubuntu.png",revision:"f9de8c42c619f5f185ed9507ec3ae20a"},{url:"/assets/posts/ubuntu/usermetrics.jpg",revision:"810ce989fd784cf561a576e16a952101"},{url:"/assets/posts/utouch/1.png",revision:"33cf401298373917faf2312c8fcba164"},{url:"/assets/posts/utouch/2.png",revision:"3c289958cf496863755c95027ff09874"},{url:"/assets/posts/utouch/3.png",revision:"5e4a3773c9ba9721f91b5162cb522243"},{url:"/assets/posts/utouch/4.png",revision:"f3d5d656f7d4872a62a49bbaff6fe553"},{url:"/assets/posts/utouch/5.png",revision:"117a77cb9067b9fe0d2645a85ecbe071"},{url:"/assets/posts/vagrant/vagrant.jpg",revision:"e12d8997a7d48f30ea75ab8dedd81422"},{url:"/assets/posts/webcomponents.png",revision:"da2545f5b4d3c7a95e4bbb7a24b1a78a"},{url:"/assets/posts/xtype/xtype.png",revision:"fce5ab9bdea7a6bb65c4b448415e2801"},{url:"/tags/11ty/index.html",revision:"f667868aad2a05743c0113a77b27284a"},{url:"/tags/android/index.html",revision:"0f7a13f9b0c4063e46930161725757b3"},{url:"/tags/console/index.html",revision:"31bf343dfb10947581584e75b8b9f0e7"},{url:"/tags/css/index.html",revision:"52465b28b0233906ad62c77cefa0a254"},{url:"/tags/css3/index.html",revision:"c628183d537e0f60dd34c588943aba25"},{url:"/tags/devtools/index.html",revision:"85403bff3e141a90f70a8fb1d7343e5a"},{url:"/tags/django/index.html",revision:"76ed434c5f7b2ac6d333431fec99fc1a"},{url:"/tags/fishing/index.html",revision:"fea4814e2da94d0acc46751e84160e0c"},{url:"/tags/gmaps/index.html",revision:"f6f520233aa7d8e6448f49949f364e87"},{url:"/tags/grunt/index.html",revision:"064feab7fcf40aaa9f3e6a625836ccac"},{url:"/tags/html5/index.html",revision:"95f8426330ef3de612e57173b87d0486"},{url:"/tags/imapsync/index.html",revision:"ca31e1d74b03963574cbe7a12affcd4e"},{url:"/tags/iot/index.html",revision:"52166c2369041e9dbcdf34a6b450cb58"},{url:"/tags/javascript/index.html",revision:"c5d06b392b8bf2d8d198e25f555cd260"},{url:"/tags/launchpad/index.html",revision:"422cb08d8d1f68f310c62feacae20b86"},{url:"/tags/lxc/index.html",revision:"822cd45915dd92e2d5c00782734122db"},{url:"/tags/mozilla/index.html",revision:"af3036db6f794badf8cb0baf8aea6edc"},{url:"/tags/nodejs/index.html",revision:"68aeb5ccd0e0e73f0086f0f70cc35ef5"},{url:"/tags/oxide/index.html",revision:"e5fd1c4b995c0e3b1084a6b7b9956737"},{url:"/tags/persona/index.html",revision:"e9d8b38129e83cd98cd4cb7c95cd3b20"},{url:"/tags/phantomjs/index.html",revision:"38d559740e7c4d95fcff830f2828b784"},{url:"/tags/pockettv/index.html",revision:"dda19f4e610c17808dfbef6247002649"},{url:"/tags/python/index.html",revision:"899cae991b9469cdef5a288329902cd5"},{url:"/tags/raspberrypi/index.html",revision:"c0f2bcdc521e9f2809ee8d6a7e279710"},{url:"/tags/stylus/index.html",revision:"245a1c421300e922f91043002c2ecd41"},{url:"/tags/sublimetext/index.html",revision:"8d85a3cbc2894792d939ff3aca0d8680"},{url:"/tags/ubuntu/index.html",revision:"961fa4fc007867342d15cf7c7c8773fc"},{url:"/tags/ubuntuplanet/index.html",revision:"128f3dcabd422294c9676a1b02786cfa"},{url:"/tags/ubuntutouch/index.html",revision:"ce6ff4e726beb614fc505a63c0be90ed"},{url:"/tags/utouchdev/index.html",revision:"662177af0e51ff4fae9481f8b5cfd366"},{url:"/tags/vagrant/index.html",revision:"1e7d0ad08548587b7664876994265c87"},{url:"/tags/webcomponents/index.html",revision:"b4f640a31eb1d9c9675bfe06460d4f89"},{url:"/tags/webkit/index.html",revision:"e2feaf19e4f9a770c5336c5851be57d7"}]),function(e){const s=O();c(new N(s,e))}(P),self.addEventListener("activate",(e=>{const s=b();e.waitUntil((async(e,s="-precache-")=>{const t=(await self.caches.keys()).filter((t=>t.includes(s)&&t.includes(self.registration.scope)&&t!==e));return await Promise.all(t.map((e=>self.caches.delete(e)))),t})(s).then((e=>{})))})),c((({url:e})=>!new RegExp(`.+\\.(?:${["jpg","png","gif","ico","svg","jpeg","avif","webp","eot","ttf","otf","ttc","woff","woff2"].join("|")})`).test(e)),new class extends y{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(f),this.W=e.networkTimeoutSeconds||0}async k(e,t){const a=[],i=[];let n;if(this.W){const{id:s,promise:r}=this.K({request:e,logs:a,handler:t});n=s,i.push(r)}const r=this.I({timeoutId:n,request:e,logs:a,handler:t});i.push(r);const o=await t.waitUntil((async()=>await t.waitUntil(Promise.race(i))||await r)());if(!o)throw new s("no-response",{url:e.url});return o}K({request:e,logs:s,handler:t}){let a;return{promise:new Promise((s=>{a=setTimeout((async()=>{s(await t.cacheMatch(e))}),1e3*this.W)})),id:a}}async I({timeoutId:e,request:s,logs:t,handler:a}){let i,n;try{n=await a.fetchAndCachePut(s)}catch(e){e instanceof Error&&(i=e)}return e&&clearTimeout(e),!i&&n||(n=await a.cacheMatch(s)),n}},"GET"),c(/.+\.(?:eot|ttf|otf|ttc|woff|woff2|jpg|png|gif|ico|svg|jpeg|avif|webp)$/,new class extends y{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(f)}async k(e,t){const a=t.fetchAndCachePut(e).catch((()=>{}));t.waitUntil(a);let i,n=await t.cacheMatch(e);if(n);else try{n=await a}catch(e){e instanceof Error&&(i=e)}if(!n)throw new s("no-response",{url:e.url,error:i});return n}},"GET");
