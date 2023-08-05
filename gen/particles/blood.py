import random

################################################################################
# Generates an SVG animation of blood particles exploding from a central point #
################################################################################


# Overwrite file if exists
f = open("src/dlcd/assets/art/hitfx-blood.svg", "w")

# Header
f.write(
    '<svg viewBox="0 0 128 128" preserveAspectRatio="none" '
    'xmlns="http://www.w3.org/2000/svg" '
    'xmlns:xlink="http://www.w3.org/1999/xlink"> \n'
)
