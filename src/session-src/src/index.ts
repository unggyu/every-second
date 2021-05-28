import Session from './Session';
import ScriptLoader from './ScriptLoader';

declare global {
    interface Window {
        session: Session;
        scriptLoader: ScriptLoader;
    }
}

window.session = new Session();
window.scriptLoader = new ScriptLoader();
