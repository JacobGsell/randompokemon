export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","smui.css","smui-dark.css"]),
	mimeTypes: {".png":"image/png",".css":"text/css"},
	_: {
		entry: {"file":"_app/immutable/start-fcfcc02f.js","imports":["_app/immutable/start-fcfcc02f.js","_app/immutable/chunks/index-ab55fea0.js","_app/immutable/chunks/singletons-65e890c7.js","_app/immutable/chunks/index-a13afca4.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
