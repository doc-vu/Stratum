import numpy as np
import matplotlib.pyplot as plt
from sklearn import linear_model, datasets
import jsonRead as jr

# import some data to play with
loadFunc = getattr(datasets,jr.DataPath)
iris = loadFunc()
X = iris.data[:, :int(jr.featureSize)]  # we only take the first two features.
Y = iris.target

h = float(jr.stepSize)  # step size in the mesh

algorithm = jr.algorithm
mlFunction = getattr(linear_model, algorithm)
logreg = mlFunction(C=1e5)

# we create an instance of Neighbours Classifier and fit the data.
logreg.fit(X, Y)

# Plot the decision boundary. For that, we will assign a color to each
# point in the mesh [x_min, x_max]x[y_min, y_max].
x_min, x_max = X[:, int(jr.X_parameters)].min() - .5, X[:, int(jr.X_parameters)].max() + .5
y_min, y_max = X[:, int(jr.Y_parameter)].min() - .5, X[:, int(jr.Y_parameter)].max() + .5
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
Z = logreg.predict(np.c_[xx.ravel(), yy.ravel()])

# Put the result into a color plot
Z = Z.reshape(xx.shape)
plt.figure(1, figsize=(4, 3))
plt.pcolormesh(xx, yy, Z, cmap=plt.cm.Paired)

# Plot also the training points
plt.scatter(X[:, 0], X[:, 1], c=Y, edgecolors='k', cmap=plt.cm.Paired)
plt.xlabel('Sepal length')
plt.ylabel('Sepal width')

plt.xlim(xx.min(), xx.max())
plt.ylim(yy.min(), yy.max())
plt.xticks(())
plt.yticks(())

plt.show()