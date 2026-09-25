import { CSPDirectives, DATA, UNSAFE_EVAL, UNSAFE_INLINE, getCSP, SELF } from 'csp-header';
import { clientEnv } from './env/server';
import { isLocalhost } from './urls';

const navNo = '*.nav.no';
const cdnNavNo = 'cdn.nav.no';

const uxsignals = 'widget.uxsignals.com';
const uxsignalsApi = 'api.uxsignals.com';
const puzzelScreenSharing = '*.puzzel.com';
const puzzelWebSocket = 'wss://*.puzzel.com'; // Need explicit websocket entry for puzzel
const boostChatbot = '*.boost.ai';
const boostScript = `${clientEnv.BOOST_ENV}.boost.ai`;
const vimeoPlayer = 'player.vimeo.com'; // used for inline videos in the chat client
const qbrick = 'video.qbrick.com'; // used for inline videos in the chat client
const qbrickNotification = 'wss://notification.qbrick.com'; // websocket used by qbrick player
const qbrickMediaCdn = '*.dna.contentdelivery.net'; // qbrick media delivery network
const vimeoCdn = '*.vimeocdn.com'; // used for video preview images
const skyra = '*.skyra.no';
const googleFonts = '*.googleapis.com';
const googleFontsStatic = '*.gstatic.com';

const styleSrc = [
	navNo,
	UNSAFE_INLINE, // various components with style-attributes,
	googleFonts,
	googleFontsStatic,
];

const scriptSrc = [
	navNo,
	uxsignals,
	puzzelScreenSharing,
	skyra,
	boostScript,
	// localhost testing
	UNSAFE_INLINE, // Puzzel
];

const workerSrc = [navNo];

const directives: Partial<CSPDirectives> = {
	'default-src': [navNo],
	'script-src': [...scriptSrc, UNSAFE_EVAL],
	'script-src-elem': scriptSrc,
	'worker-src': workerSrc,
	'child-src': workerSrc, // for browsers lacking support for worker-src
	'style-src': styleSrc,
	'style-src-elem': styleSrc,
	'font-src': [
		skyra,
		cdnNavNo,
		googleFonts,
		googleFontsStatic,
		DATA, // ds-css
	],
	'img-src': [navNo, uxsignals, vimeoCdn, skyra],
	'frame-src': [vimeoPlayer, qbrick, navNo],
	'frame-ancestors': [SELF],
	'connect-src': [
		navNo,
		uxsignalsApi,
		qbrick,
		qbrickNotification,
		boostChatbot,
		puzzelScreenSharing,
		puzzelWebSocket,
		skyra,
	],
	'media-src': [navNo, qbrick, qbrickMediaCdn],
};

const localDirectives = Object.entries(directives).reduce(
	(acc, [key, value]) => ({
		...acc,
		[key]: Array.isArray(value) ? [...value, 'localhost:* ws:'] : value,
	}),
	{}
);

export const cspDirectives = isLocalhost() ? localDirectives : directives;

export const csp = getCSP({ presets: [cspDirectives] });
