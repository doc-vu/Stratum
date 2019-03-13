# Erudite Development Platform
## Installation
First, install the ML following:
- [NodeJS](https://nodejs.org/en/) (v4.x.x recommended)
- [MongoDB](https://www.mongodb.com/)

Second, start mongodb locally by running the `mongod` executable in your mongodb installation (you may need to create a `data` directory or set `--dbpath`).

Then, run `webgme start` from the project root to start . Finally, navigate to `http://localhost:7777` to start using ML!

### Sample ML Model Development using Erudite Platform

![alt text](https://github.com/doc-vu/Stratum/blob/master/png/Erudite_Platform.png)

The Erudite Rapid Model Development framework leverages the strength of Model Driven Engineering(MDE) to provide a visual development environment for machine learning pipelines. The ML model developer has to drag and drop the required blocks in the design pane and must connect the blocks to define the ML pipeline.


![alt text](https://github.com/doc-vu/Stratum/blob/master/png/overview.PNG)

The Erudite model transformer can distribute different jobs with different ML techniques over a cluster of connected machines and aids the developer to select the best model or ensemble of models based on the user's choice of evaluation methods.  

![alt text](https://github.com/doc-vu/Stratum/blob/master/png/MLAlgos.png)


![alt text](https://github.com/doc-vu/Stratum/blob/master/png/pipeline.PNG)


![alt text](https://github.com/doc-vu/Stratum/blob/master/png/StreamLineML.png)
