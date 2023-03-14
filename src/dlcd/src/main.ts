/** @format */

import MovLogosScene from "./scene/movLogos.js";
import TitleScene from "./scene/title.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

MovLogosScene.activate();

// Play logo video, then transition to title screen
if (document.readyState == "complete") {
    MovLogosScene.vid0.play();
} else {
    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            MovLogosScene.vid0.play().then(() => {
                setTimeout(() => {
                    // Pause video at 4.5 seconds to keep it on light gray bg
                    MovLogosScene.vid0.pause();

                    // Disable clicking other elements and fade out screen
                    let overlay: HTMLDivElement =
                        document.querySelector("#sceneFadeOverlay");
                    overlay.style.pointerEvents = "auto";
                    overlay.style.opacity = "1";

                    setTimeout(() => {
                        // Prep bg color for smooth title screen transition
                        document.body.style.backgroundColor = "black";
                        // Switch scene
                        MovLogosScene.deactivate();
                        TitleScene.activate();
                    }, 1000);
                }, 4500);
            });
        }
    };
}
