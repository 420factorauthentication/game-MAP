/** @format */

import {ms} from "../lib-meth/types";

import Hotbar from "./hotbar";

//////////////////////////////////////////////////
// A hotbar that rolls new buttons periodically //
//////////////////////////////////////////////////

class Rollbar extends Hotbar {
    start(intervalTime: ms) {
        this.#isOn = true;
        this.loop(intervalTime);
    }

    stop() {
        this.#isOn = false;
    }

    #isOn: boolean = false;
    get isOn() {
        return this.#isOn;
    }

    private loop(intervalTime: ms) {
        new Promise((resolve) => {
            setTimeout(resolve, intervalTime);
        }).then(() => {
            if (!this.isOn) return;
            this.generateChoices();
            this.loop(intervalTime);
        });
    }

    private generateChoices() {}
}

////////////////////////////////////////////////////////////////////////////////

export default Rollbar;
