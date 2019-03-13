# Erudite Development Platform
## Installation
First, install the ML following:
- [NodeJS](https://nodejs.org/en/) (v4.x.x recommended)
- [MongoDB](https://www.mongodb.com/)

Second, start mongodb locally by running the `mongod` executable in your mongodb installation (you may need to create a `data` directory or set `--dbpath`).

Then, run `webgme start` from the project root to start . Finally, navigate to `http://localhost:7777` to start using ML!


### Main metamodel of Erudite Platform

![alt text](https://github.com/doc-vu/Stratum/blob/master/png/StreamLineML.png)

### Sample ML Model Development using Erudite Platform

![alt text](https://github.com/doc-vu/Stratum/blob/master/png/Erudite_Platform.png)

The Erudite Rapid Model Development framework leverages the strength of Model Driven Engineering(MDE) to provide a visual development environment for machine learning pipelines. The ML model developer has to drag and drop the required blocks in the design pane and must connect the blocks to define the ML pipeline.


![alt text](https://github.com/doc-vu/Stratum/blob/master/png/overview.PNG)

As shown in the above figure,  the ML developer can build their machine learning pipeline using the visual interface of Erudite. In the left-hand pane (box1), all the building blocks are defined using the metamodel. The ML model developer has to drag and drop the required blocks in the design pane (box 2) and must connect the blocks to define the ML pipeline as shown in the above figure. All the attributes of the selected ML algorithms such as max_depth, criteria need to be specified by the user (or can take default values) from the right pane (box 3). 

The Erudite model transformer can distribute different jobs with different ML techniques over a cluster of connected machines and aids the developer to select the best model or ensemble of models based on the user's choice of evaluation methods. In Box 4, sample ROC evalution curve is shown. 

![alt text](https://github.com/doc-vu/Stratum/blob/master/png/MLAlgos.png)
The metamodel for the supported ML algorithms is shown in the above figure. We captured the specifications for a diverse set of ML algorithms including classification (e.g., logistic regression, naive Bayes), regression, decision trees, random forests, and gradient-boosted trees, recommendation (ALS), clustering (K-means, GMMs), and many others. 

Using this metamodel, the data-scientist needs to drag relevant machine learning blocks and needs to define all the parameters such as fit_intercept, normalize, n_jobs for scikit-learn linear regression block or have to specify
the type of layers such as dense, CNN, RNN for deep learning.  

![alt text](https://github.com/doc-vu/Stratum/blob/master/png/pipeline.PNG)
Above figure shows how Stratum model is converted (Template-based Transformation) into python code in ipython notebook.  

