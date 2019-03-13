# Importing the JSON parser
import json

# Reading the JSON file
try:
    with open('ML_linear.json') as json_file:
        _json = json.load(json_file)

except:
    _json = None

# print _json

name = _json['MLModel']['name']
DataPath = _json['MLModel']['dataPath']
X_parameters = _json['MLModel']['DataAcquisition']['X_parameters']
Y_parameters = _json['MLModel']['DataAcquisition']['Y_parameter']
filterFunction = _json['MLModel']['DataAcquisition']['filterFunction']
filterparameter = _json['MLModel']['DataAcquisition']['filterparameter']
trainingSize = _json['MLModel']['MLFramework']['trainingSize']
algorithm = _json['MLModel']['MLFramework']['algorithm']


