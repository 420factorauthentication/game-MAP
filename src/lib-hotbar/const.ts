/** @format */

import type {Rollbar} from "./rollbar";
import type {Loopbar} from "./loopbar";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function isRollbar(object): object is Rollbar {
    if (!object) return false;
    return "rollOptions" in object;
}

export function isLoopbar(object): object is Loopbar {
    if (!object) return false;
    return "loopPeriod" in object;
}
