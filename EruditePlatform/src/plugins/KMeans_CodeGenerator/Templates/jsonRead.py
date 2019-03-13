# Importing the JSON parser
import json

# Reading the JSON file
try:
    with open('ML_kmeans.json') as json_file:
        _json = json.load(json_file)

except:
    _json = None

# print _json

name = _json['MLModel']['name']
DataPath = _json['MLModel']['dataPath']
algorithm = _json['MLModel']['MLFramework']['algorithm']
clusterSize = _json['MLModel']['MLFramework']['clusterSize']
trainingSize = _json['MLModel']['MLFramework']['trainingSize']
