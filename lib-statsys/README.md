<!-- @format -->

# Stat System Library

An engine that creates Stats instances. Each instance contains:

-   A Base object. All of base's accessible properties serve as starting numbers. <br>
    Example: An object containing the starting hp, damage, etc. of an enemy.

-   A list of StatMods: Timed (or sometimes permanent) effects that adjust numbers.
    Example: Spell effects that temporarily buff or debuff the player's damage.

-   A list of all cumulative Changes:
    Permanent number adjustments that aren't associated with a StatMod.
    Useful when you want to permanently change numbers with no extra overhead. <br>
    Example: Gold pickups that have no use in being tracked as a spell effect.

-   A method for getting the current number of a Base property, which is equal to:
    Base Numbers + StatMods + Changes.

All number adjustments are tracked separately, without mutating the Base object.

Asynchronous cleanup of StatMods is managed,
so if a StatMod is manually removed before it ends,
the system doesn't remove it a second time later,
and it doesn't revert number adjustments twice.

<br>

## Useful Cases

-   An RPG system that needs to:
    -   Add timed spell effects that adjust stats
    -   End a spell effect prematurely and revert it's stat adjustments,
        but only if the player is currently affected by that spell effect
    -   Check how much a player's stats are buffed or debuffed at any time
    -   Revert to a default state at any time
