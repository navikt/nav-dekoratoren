import { render } from 'preact';
import { App } from './app.tsx';
import './index.css';

// injectDecoratorClientSide({
//     env: "localhost",
//     localUrl: "http://localhost:8089"
// })

render(<App />, document.getElementById('app')!);

import 'decorator-client/src/client';
