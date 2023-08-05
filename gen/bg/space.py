import random

#####################################################
# Generates a space-themed Main Menu SVG Background #
# with randomly placed stars drifting across screen #
#####################################################


# Overwrite file if exists
f = open("src/dlcd/assets/art/mm-bg-space.svg", "w")

# Header
f.write(
    '<svg viewBox="0 0 1920 1080" preserveAspectRatio="none" '
    'xmlns="http://www.w3.org/2000/svg" '
    'xmlns:xlink="http://www.w3.org/1999/xlink"> \n'
    '\n'

    '    <defs>\n'
    '        <circle id="star" r="2" fill="#ccc"/>\n'
    '    </defs>\n'
    '\n'

    '    <rect id="bg" width="1920" height="1080" fill="black"/>\n'
    '\n'
)

# Generate stars with randomized parameters
for i in range(100):
    xStart = random.randrange(4, 1915)
    yStart = random.randrange(4, 1075)
    animDur = random.randrange(600, 1800)
    f.write(
        '    <use href="#star">\n'
        '        <animateMotion\n'
        '            path='
                        + '"M ' + str(xStart) + ' ' + str(yStart)
                        + ' H 1924'
                        + ' M -4 ' + str(yStart)
                        + ' H ' + str(xStart)
                        + '"\n'
        '            dur="' + str(animDur) + 's"\n'
        '            repeatCount="indefinite"\n'
        '        />\n'
        '    </use>\n'
    )

# Footer
f.write('</svg>\n')
f.close()
