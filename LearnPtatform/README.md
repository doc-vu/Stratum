# LearnPlatform
## Installation
First, install the learnPlatform following:
- [NodeJS](https://nodejs.org/en/) (v4.x.x recommended)
- [MongoDB](https://www.mongodb.com/)

Second, start mongodb locally by running the `mongod` executable in your mongodb installation (you may need to create a `data` directory or set `--dbpath`).

Then, run `webgme start` from the project root to start . Finally, navigate to `http://localhost:8888` to start using learnPlatform!

### Sample Data Analytics model on Cloud and Edge

![alt text](https://github.com/doc-vu/Stratum/blob/master/png/DataAnalyticsModel.png)

### Metamodel of Data Analytics Application Components

Below figure(a) illustrates the meta-model for data ingestion tools (e.g., RabbitMQ, Kafka), which receive the data from the edge devices, who serve as the publisher. Here we capture the specifications for the Data Ingestion tools and a specific Data Ingestion tool such as Kafka is contained within the parent dataIngestionTool class.  The live or in-depth analytics frameworks such as Hadoop, Spark, Flink, Samza, and more need to be deployed on the target distributed systems. Henceforth, those frameworks' specifications need to be contained in the Data Analytics parent class. Moreover, as shown in Figure(b), the trained ML model needs to be integrated with the stream and batch analytics frameworks.  So to deploy the production-ready machine-learning pipeline we need to capture the specifications for the ML libraries and frameworks such as Tensorflow, sci-kit learn, PyTorch, CNTK and more as shown in below Figure(b). 

![alt text](https://github.com/doc-vu/Stratum/blob/master/png/DataAnalytics.png)

(a) Metamodel of Data Ingetion tools (b) Metamodel of Data Analytics frameworks

Similarly, below figure shows metamodel for Data Storage services and metamodel for Database services.
![alt text](https://github.com/doc-vu/Stratum/blob/master/png/DataStorage.png)

(a) Metamodel of Data Storage services (b) Metamodel of Database services
