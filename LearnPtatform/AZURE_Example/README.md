# Deployment Automation on Microsoft Azure Stack
![alt text](https://github.com/doc-vu/Stratum/blob/master/png/StratumAzure.png)

To create Azure Data Analytics Platform, the deployer need to install the components as below.
Components of the Azure Data Analytics Platform are:
1. Azure Comsumer nodes, which are responsible for running the computation, producing and publishing the result as streaming data.
2. Azure Event Hubs, which is a Big Data streaming platform, and event ingestion service, and is capable of receiving and processing millions of events per second.
3. Azure CosmosDB, which is a global distributed and horizontally scalable database with multi-API support and provides low latency responses at potentially massive scale.
4. Azure Data Lake Store, which is an enterprise-wide, hyper-scale, hierarchical file system repository for big data analytics workloads.
5. Azure Databricks, which is a fast, easy, and collaborative Apache Spark-based analytics platform.
6. Power BI, which is a suite of business analytics tools that deliver insights by connecting to 'big' data sources.

A sample infrastructure code to deploy these components on Azure stack is in the azure_services.py python file.
