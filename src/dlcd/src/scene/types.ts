/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export interface Scene {
    /** Is this Scene currently displaying it's DOM Elements? */
    isActive?: boolean;

    /** Creates this Scene's DOM Elements. */
    activate(): void;

    /** Destroy this Scene's DOM Elements and cleanup all garbage. */
    deactivate(): void;
}
