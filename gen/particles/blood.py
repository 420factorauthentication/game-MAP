import random
import typing

##################
# Util Functions #
##################


def randfloat(min: float, max: float):
    return min + random.random() * (max - min)


################################################################################
# Generates an SVG animation of blood particles exploding from a central point #
################################################################################

# Overwrite file if exists
f = open("src/lib-svg/anim/bloodhit0.svg", "w")

# Viewbox
viewWidth = 256
viewHeight = 256

# Dont change this; SVG particle paths already have hardcoded points from Adobe Illustrator
particleWidth = 32
particleHeight = 32

# Origin = top left of an object
particleCenterX = (viewWidth / 2) - (particleWidth / 2)
particleCenterY = (viewHeight / 2) - (particleHeight / 2)
particleEndX = viewWidth - particleWidth
particleEndY = viewHeight - particleHeight


# Header
f.write(
    '<?xml version="1.0" encoding="UTF-8"?>'
    '\n<svg preserveAspectRatio="none" '
    'xmlns="http://www.w3.org/2000/svg" '
    'xmlns:xlink="http://www.w3.org/1999/xlink" '
    'viewBox="0 0 ' + str(viewWidth) + " " + str(viewHeight) + '">'
    "\n  <defs>"
    "\n    <style>"
    "\n      .cls-1 {"
    "\n        fill: #ed1c24;"
    "\n        stroke: #c1272d;"
    "\n        stroke-miterlimit: 10;"
    "\n      }"
    "\n    </style>"
    '\n    <path id="particle0" class="cls-1" d="m22.03,17.07c-.84,1.22-5.52-1.86-7.38,0s1.22,6.54,0,7.38c-1.27.87-14.76-7.38,0-14.76,14.76-7.38,8.25,6.11,7.38,7.38Z"/>'
    '\n    <path id="particle1" class="cls-1" d="m8.61,23.51c-1.31.89-7.44-2.68-7.38-7.38.06-4.08,4.76-6.58,7.38-7.38,2.41-.74,3.88-.3,7.38,0,9.81.85,14.37-1.17,14.76,0,.51,1.56-6.76,7.7-14.76,7.38-3.43-.14-6.03-1.43-7.38,0-1.87,1.99,1.21,6.55,0,7.38Z"/>'
    '\n    <path id="particle2" class="cls-1" d="m27.07,16c-.36.76-5.53-2.02-7.38,0-1.75,1.9,1.39,5.97,0,7.38-2.41,2.45-15.34-6.15-14.76-7.38.36-.76,5.53,2.02,7.38,0,1.75-1.9-1.39-5.97,0-7.38,2.41-2.45,15.34,6.15,14.76,7.38Z"/>'
    '\n    <path id="particle3" class="cls-1" d="m26.96,12.35c2.08,7.81-6.11,15.36-7.38,14.76-.89-.42,1.99-4.99,0-7.38-3.01-3.62-13.54,2.18-14.76,0-.83-1.48,2.75-6.46,7.38-7.38,3.56-.7,5.98,1.34,7.38,0,1.86-1.78-1.16-6.62,0-7.38,1.14-.74,6.1,2.56,7.38,7.38Z"/>'
    '\n    <path id="particle4" class="cls-1" d="m23.36,15.74c.49,1.31,1.99,5.39,0,7.38-1.18,1.18-2.67,0-7.38,0s-6.14,1.11-7.38,0c-2.05-1.84-.22-6.77,0-7.38.33-.89,2.73-7.38,7.38-7.38s6.71,5.57,7.38,7.38Z"/>'
    '\n    <path id="particle5" class="cls-1" d="m19.31,20.07c-.67,1.81-9.19-6.71-7.38-7.38,1.31-.49,5.39-1.99,7.38,0s.49,6.06,0,7.38Z"/>'
    '\n    <path id="particle6" class="cls-1" d="m23.55,12.29c0,3.21-5.58,2.95-7.38,7.38-1.52,3.73.79,7.01,0,7.38-1.27.6-9.46-6.95-7.38-14.76.65-2.45,2.95-7.38,7.38-7.38,4.08,0,7.38,3.3,7.38,7.38Z"/>'
    '\n    <path id="particle7" class="cls-1" d="m23.45,15.93c0,5.1-6.11,8.25-7.38,7.38-1.22-.84,1.86-5.52,0-7.38s-6.54,1.22-7.38,0c-.87-1.27,2.28-7.38,7.38-7.38,4.08,0,7.38,3.3,7.38,7.38Z"/>'
    '\n    <path id="particle8" class="cls-1" d="m23.38,18.16c0,4.08-14.76,4.08-14.76,0s3.3-7.38,7.38-7.38,7.38,3.3,7.38,7.38Z"/>'
    '\n    <path id="particle9" class="cls-1" d="m22.01,22.01c-4.74,4.74-14.14,2.44-14.76,0-.34-1.35,2.16-2.16,7.38-7.38s6.03-7.72,7.38-7.38c2.44.62,4.74,10.02,0,14.76Z"/>'
    '\n    <path id="particle10" class="cls-1" d="m22.88,15.5c.49,1.31,1.99,5.39,0,7.38s-6.06.49-7.38,0c-1.81-.67-7.38-2.71-7.38-7.38,0-4.08,3.3-7.38,7.38-7.38,4.67,0,6.71,5.57,7.38,7.38Z"/>'
    '\n    <path id="particle11" class="cls-1" d="m24.17,18.38c.49.25-5.61.91-7.38,2.59-1.21,1.15,1.39,2,0,2.59-1.38.58-5.52.55-7.38,0-7.61-2.24,14.19-15.63,14.76-15.54.41.06-8.84,7.53-7.43,7.76.02,0,.03,0,.05,0,1.22.29-1.86,1.94,0,2.59s6.54-.43,7.38,0Z"/>'
    '\n    <path id="particle12" class="cls-1" d="m23.53,19.73c-.34.76-5.4-1.87-7.38,0-2.02,1.91.84,6.99,0,7.38-1.28.6-9.36-7.19-7.38-14.76,1.27-4.83,6.26-8.14,7.38-7.38,1,.69-1.26,3.68,0,7.38,1.62,4.74,7.74,6.57,7.38,7.38Z"/>'
    '\n    <path id="particle13" class="cls-1" d="m16.04,15.87c9.4-1.58,14.34-7.88,14.76-7.38.68.81-11.63,17.39-22.14,14.76-4.59-1.15-8.15-5.79-7.38-7.38.87-1.77,6.62,1.37,14.76,0Z"/>'
    "\n  </defs>"
    "\n"
)

# Generate blood particles with randomized parameters
for i in range(8):
    id = random.randrange(13)
    animDur = "%.4f" % randfloat(0.3, 0.6)
    endX = "%.4f" % randfloat(0, particleEndX)
    endY = "%.4f" % randfloat(0, particleEndY)
    endDeg = random.randrange(90, 360)

    f.write(
        '  <use href="#particle'
        + str(id)
        # + '" x="'
        # + str(particleCenterX)
        # + '" y="'
        # + str(particleCenterY)
        + '">'
    )

    f.write("\n")
    f.write('    <animate attributeName="x"')
    f.write(' values="' + str(particleCenterX) + ";" + str(endX) + '"')
    f.write(' dur="' + str(animDur) + 's"')
    f.write(' fill="freeze"')
    f.write(" />")

    f.write("\n")
    f.write('    <animate attributeName="y"')
    f.write(' values="' + str(particleCenterY) + ";" + str(endY) + '"')
    f.write(' dur="' + str(animDur) + 's"')
    f.write(' fill="freeze"')
    f.write(" />")

    f.write("\n")
    f.write('    <animate attributeName="opacity"')
    f.write(' values="1;0"')
    f.write(' dur="' + str(animDur) + 's"')
    f.write(' fill="freeze"')
    f.write(" />")

    f.write("\n")
    f.write('    <animateTransform attributeName="transform"')
    f.write(' type="rotate"')
    f.write(' from="0 ' + " ".join([str(particleCenterX), str(particleCenterY)]) + '"')
    f.write(' to="' + " ".join([str(endDeg), str(endX), str(endY)]) + '"')
    f.write(' dur="' + str(animDur) + 's"')
    f.write(' attributeType="XML" fill="freeze"')
    f.write(" />")

    f.write("\n")
    f.write("  </use>")

# Footer
f.write("\n")
f.write("</svg>")
f.close()
