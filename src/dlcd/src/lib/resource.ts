/** @format */

import {ResourceNames} from "../const/resources.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type ResourceName = (typeof ResourceNames)[keyof typeof ResourceNames];

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export class ResourceManager {
    constructor(private _ui: {[key in ResourceName]: HTMLSpanElement}) {
        for (const key in ResourceNames) this.#resources[key] = 0;
        for (const key in _ui) _ui[key].innerText = "0";
    }

    #resources: {[key in ResourceName]?: number} = {};
    get(resource: ResourceName) {
        return this.#resources[resource];
    }
    set(resource: ResourceName, newAmount: number) {
        this.#resources[resource] = newAmount;
        this._ui[resource].innerText = newAmount.toString();
    }
}
