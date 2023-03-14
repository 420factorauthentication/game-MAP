/** @format */

import MovLogosScene from "./scene/movLogos.js";
import TitleScene from "./scene/title.js";
import GameScene from "./scene/game.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

MovLogosScene.activate();

// Play logo video
if (document.readyState == "complete") {
    MovLogosScene.vid0.play();
} else {
    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            MovLogosScene.vid0.play();
        }
    };
}
