/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A HotbarButton setting that can be randomly chosen when rolled. */
export type RollbarOption = {
    /** When HotbarButton is clicked, or hotkey is pressed, these are called. */
    onPress: (() => void)[];
    /** Called before onPress. If any return false, onPress isn't called. */
    conditions?: (() => boolean)[];
    /** Applied to HotbarButton DOM Element. */
    styleCssText?: string;
    /** Applied to HotbarButton DOM Element. */
    innerHTML?: string;
    /** Description text to show when cursor hovers over HotbarButton. */
    tooltip?: string;
    /** Flavor text to show somewhere. Will do more with this later. */
    flavor?: string;
};
