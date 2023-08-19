import shutil

###################################
# Deletes generated TypeDoc pages #
###################################

try:
    shutil.rmtree("_doc")
except Exception as error:
    print("Error deleting _doc:", type(error).__name__, "–", error)
else:
    print("Success deleting _doc")
