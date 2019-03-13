import numpy as np
import matplotlib.pyplot as plt
from sklearn import cluster
from sklearn.utils import shuffle
from time import time
from PIL import Image
import jsonRead as jr

n_colors = int(jr.clusterSize)

# Load the Summer Palace photo
image = Image.open(jr.DataPath)

# Convert to floats instead of the default 8 bits integer coding. Dividing by
# 255 is important so that plt.imshow behaves works well on float data (need to
# be in the range [0-1])
image = np.array(image, dtype=np.float64) / 255
colorSize = image.shape[0] * image.shape[1] * image.shape[2]
print 'Original image (' + str(image.shape[0] * image.shape[1] * image.shape[2]) + ' colors)'
# Load Image and transform to a 2D numpy array.
w, h, d = original_shape = tuple(image.shape)
assert d == 3
image_array = np.reshape(image, (w * h, d))

print("Fitting model on a small sub-sample of the data")
t0 = time()
image_array_sample = shuffle(image_array, random_state=0)[:int(jr.trainingSize)]
alg = jr.algorithm
kmeansFunc = getattr(cluster,alg)
kmeans = kmeansFunc(n_clusters=n_colors, random_state=0)
kmeans = kmeans.fit(image_array_sample)
#kmeans = cluster.KMeans(n_clusters=n_colors, random_state=0).fit(image_array_sample)
print("done in %0.3fs." % (time() - t0))

# Get labels for all points
print("Predicting color indices on the full image (k-means)")
t0 = time()
labels = kmeans.predict(image_array)
print("done in %0.3fs." % (time() - t0))

def recreate_image(codebook, labels, w, h):
    """Recreate the (compressed) image from the code book & labels"""
    d = codebook.shape[1]
    image = np.zeros((w, h, d))
    label_idx = 0
    for i in range(w):
        for j in range(h):
            image[i][j] = codebook[labels[label_idx]]
            label_idx += 1
    return image

# Display all results, alongside original image
plt.figure(1)
plt.clf()
ax = plt.axes([0, 0, 1, 1])
plt.axis('off')
titleOrg = 'Original image (' + str(colorSize) + ' colors)'
plt.title(titleOrg)
plt.imshow(image)

plt.figure(2)
plt.clf()
ax = plt.axes([0, 0, 1, 1])
plt.axis('off')
titleKmeans = 'Quantized image (' + str(n_colors) + 'colors, K-Means)'
plt.title(titleKmeans)
plt.imshow(recreate_image(kmeans.cluster_centers_, labels, w, h))

plt.show()