// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import { ReactInstance, Location, Surface } from "react-360-web";
import SimpleRaycaster from "simple-raycaster";

function init(bundle, parent, options = {}) {
	const r360 = new ReactInstance(bundle, parent, {
		// Add custom options here
		fullScreen: true,
		...options,
	});

	const main = new Surface(
		3400,
		/* width */ 660,
		/* height */ Surface.SurfaceShape.Cylinder /* shape */
	);
	main.setAngle(0, 0);

	const location = new Location(0, 0, 0);
	// Render your app content to the default cylinder surface
	r360.renderToSurface(
		r360.createRoot("App", {
			/* initial props */
		}),
		main
	);

	r360.renderToLocation(
		r360.createRoot("Deathstar"),
		// location,
		r360.getDefaultLocation()
	);

	// r360.renderToLocation(
	//   r360.createRoot('React3DView'),
	//   r360.getDefaultLocation(),
	// );

	// in client.js
	const player = r360.compositor.createVideoPlayer("winnerplayer");
	// Instantiate the video, but do not play it yet
	player.setSource("./static_assets/winning-video.mp4", "3DLR");
	player.setMuted(false);

	// Load the initial environment
	r360.compositor.setBackground(r360.getAssetURL("360Final.jpg"));
	r360.controls.clearRaycasters();
	r360.controls.addRaycaster(SimpleRaycaster);
}
window.React360 = { init };
