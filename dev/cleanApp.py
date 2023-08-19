import shutil

###########################################
# Deletes app files generated from source #
###########################################

try:
    shutil.rmtree("_out")
except Exception as error:
    print("Error deleting _out:", type(error).__name__, "–", error)
else:
    print("Success deleting _out")

try:
    shutil.rmtree("_api")
except Exception as error:
    print("Error deleting _api:", type(error).__name__, "–", error)
else:
    print("Success deleting _api")
