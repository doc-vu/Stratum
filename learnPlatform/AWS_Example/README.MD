![alt text](https://github.com/doc-vu/Stratum/blob/master/png/DataAnalytics_on_AWS.png)

To create AWS Data Analytics Platform, the deployer need to install the components as below.
Components of the AWS Data Analytics Platform are:
1. AWS Compute nodes, which are responsible for running the computation, producing and publishing
the result as streaming data.
2. A Data Ingestion Tool, (e.g., Amazon Simple Queue Service (SQS), Amazon Kinesis) which is
responsible for sending, storing, and receiving messages between software components or services
at any volume, without losing messages or requiring other services to be available.
3. Amazon DynamoDB, which is a NoSQL database optimized for servicing applications that need low
latency responses at potentially massive scale.
4. Amazon S3, which is object storage and it allows to store and retrieve structured and unstructured
data at a massive scale.
5. Amazon EMR, which is a Hosted Hadoop Framework and it simplifies big data processing across
dynamically scalable Amazon EC2 instances. Other popular distributed frameworks such as Apache
Spark, Presto, and HBase is also integrated with Amazon EMR. AWS data stores such as Amazon S3
and Amazon DynamoDB is also integrated with EMR.
6. Amazon QuickSight, which is a business analytics service to build visualizations, perform ad-hoc
analysis, and quickly get business insights from data.

A sample infrastructure code to deploy these components on AWS stack is in the aws_services.py python file.
