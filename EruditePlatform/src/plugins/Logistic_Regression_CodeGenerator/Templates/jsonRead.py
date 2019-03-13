# Importing the JSON parser
import json

# Reading the JSON file
try:
    with open('ML_logistic.json') as json_file:
        _json = json.load(json_file)

except:
    _json = None

# print _json

Name = _json['MLModel']['name']
DataPath = _json['MLModel']['dataPath']
X_parameters = _json['MLModel']['DataAcquisition']['X_parameters']
Y_parameter = _json['MLModel']['DataAcquisition']['Y_parameter']
featureSize = _json['MLModel']['MLFramework']['featureSize']
algorithm = _json['MLModel']['MLFramework']['algorithm']
stepSize = _json['MLModel']['MLFramework']['stepSize']