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

export { default as Session } from './Session';
export * from './Session';
export { default as ScriptLoader } from './ScriptLoader';
export { default as DataManagers } from './managers/DataManagers';
export { default as LogManager } from './managers/LogManager';
