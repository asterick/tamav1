import { render } from 'inferno';

import Tamagotchi from './ui';
import System from './system';

const runtime = new System();
const UI = <Tamagotchi runtime={ runtime } debugger={true} />;

render(UI, document.querySelector("#app"));
