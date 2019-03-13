import numpy as np
import pandas as pd
from sklearn import linear_model
import jsonRead as jr
# %pylab inline

import matplotlib.pyplot as plt

# load the data from csv
raw_data = pd.read_csv(jr.DataPath)
# raw_data = pd.read_csv("Advertising.csv")

raw_data.head(3)

# removes rows with NaN in them
filterFunc = getattr(np, jr.filterFunction)
filtered_data = raw_data[~filterFunc(raw_data[jr.filterparameter])]
filtered_data.head(3)

npMatrix = np.matrix(filtered_data)
X = npMatrix[:, int(jr.X_parameters)]
X_train = X[:int(jr.trainingSize)]
Y = npMatrix[:, int(jr.Y_parameters)]
Y_train = Y[:int(jr.trainingSize)]

algorithm = jr.algorithm
mlFunction = getattr(linear_model, algorithm)
# Create linear regression object
regr = mlFunction()

# Train the model using the training sets
mdl = regr.fit(X_train, Y_train)

# either this or the next line
# mdl = LinearRegression().fit(filtered_data[['x']],filtered_data.y)
m = regr.coef_
b = regr.intercept_
print "formula: y = {0}x + {1}".format(m[0], b)
print("Coefficients: {0}".format(m[0]))

# The mean squared error
mean = np.mean(regr.predict(X) - Y) ** 2
print("Mean squared error: {0:.2f}".format(mean))
# Explained variance score: 1 is perfect prediction
varScore = regr.score(X, Y)
print('Variance score: %.2f' % varScore)

# following slope intercept form
# Plot outputs
plt.scatter(X, Y, color='green')
plt.plot([0, 100], [b, m * 100 + b], 'r')
plt.title('Linear Regression Model', fontsize=20)
plt.xlabel('X', fontsize=15)
plt.ylabel('Y', fontsize=15)
plt.show()


