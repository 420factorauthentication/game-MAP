import os

#########################################
# Builds all .less files in src to _out #
#########################################

inDir = "src"
outDir = "_out"

for subdir, dirs, files in os.walk(inDir):
    for filename in files:
        if filename.endswith(".less"):
            inPath = subdir + os.sep + filename
            childDir = subdir.split(os.sep, 1)[1]
            newfilename = filename.split(".less")[0] + ".css"
            outPath = outDir + os.sep + childDir + os.sep + newfilename
            os.system("lessc " + inPath + " " + outPath)
