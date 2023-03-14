/** @format */

import {Scene} from "./types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** Intro cutscene. */
export interface _movLogos extends Scene {
    /** Video player element */
    vid0?: HTMLVideoElement;
    /** Video source element */
    src0?: HTMLSourceElement;
    /** Fallback logo image */
    img0?: HTMLImageElement;
}

////////////////////////////////////////////////////////////////////////////////

export const MovLogosScene: _movLogos = {
    activate() {
        // Don't allow multiple instances of the same Scene to be active at once
        if (MovLogosScene.isActive) return;
        MovLogosScene.isActive = true;

        // Create HTMLElements
        MovLogosScene.vid0 = document.createElement("video");
        MovLogosScene.src0 = document.createElement("source");
        MovLogosScene.img0 = document.createElement("img");

        document.body.appendChild(MovLogosScene.vid0);
        MovLogosScene.vid0.appendChild(MovLogosScene.src0);
        MovLogosScene.vid0.appendChild(MovLogosScene.img0);

        // Set asset paths
        MovLogosScene.src0.src = "assets/vid/logo-420factorauth.webm";
        MovLogosScene.img0.src = "assets/img/logo-420factorauth.svg";
    },

    deactivate() {
        // Do nothing if already inactive
        if (!MovLogosScene.isActive) return;
        MovLogosScene.isActive = false;

        // Pause video
        MovLogosScene.vid0.pause();

        // Destroy this Scene's DOM Elements
        MovLogosScene.vid0.remove();
        MovLogosScene.src0.remove();
        MovLogosScene.img0.remove();

        // Delete handles to trigger garbage collection
        delete MovLogosScene.vid0;
        delete MovLogosScene.src0;
        delete MovLogosScene.img0;
    },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default MovLogosScene;
