#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sample on creating Amazon cloud services using the Python SDK.
@author: anirban-mac
"""

#Amazon Web Services (AWS) SDK for Python
import boto3
import time
import os
from os import listdir
from os.path import isfile, join

class amazon_aws:
    
    def __init__(self, service):
        self.service = service
    
    """
    Amazon Simple Queue Service (SQS) is a fully managed message queuing service 
    that enables to decouple and scale microservices, distributed systems, and
    serverless applications.
    """
    def sqsService(self):
        
        service = service.name
        # service = "sqs"
        # create a boto3 client
        sqsclient = boto3.client(service)
        
        # Get the queue. This returns an SQS.Queue instance
        queueName = "twitterSQS"
        # get a list of queues, we get back a dict with 'QueueUrls' as a key 
        # with a list of queue URLs
        queues = sqsclient.list_queues(QueueNamePrefix=queueName) 
        # we filter to narrow down the list
        test_queue_url = queues['QueueUrls'][0]
        
        
    """
    Amazon DynamoDB is a nonrelational database that delivers reliable performance
    at any scale. It's a fully managed, multi-region, multi-master database that 
    provides consistent single-digit millisecond latency, and offers built-in 
    security, backup and restore, and in-memory caching.
    """    
    def dynamoDBService(self):
        
        service = service.name
        service = 'dynamodb'
        region_name = 'us-west-2'
        table_name = 'table_dyno_data'
        # dynamodb resources
        dynamodb = boto3.resource(service, region_name=region_name)
        dynamotable = dynamodb.Table(table_name)
        
    
    def sqsSend(test_queue_url):
        try:
            # for FIFO queues, a 'MessageGroupId' is required, 
            #which is a 128 char alphanumeric string
            enqueue_response = client.send_message(
                QueueUrl=test_queue_url, 
                MessageBody=json.dumps(data),
                MessageGroupId=str(datetime.now())[11:],
                MessageDeduplicationId=str(datetime.now())[11:])
        
        except Exception as e:
            print("Failed SQS Send Record {}".format(str(e))  )
    

    def sqsReceiveToFile(test_queue_url):
        # next, we dequeue these messages - 10 messages at a time 
        # (SQS max limit) till the queue is exhausted.
        # in production/real setup, I suggest using long polling as 
        # you get billed for each request, regardless of an empty response
        
        counter = 0
        filepath = ''
        while True:
            # adjust MaxNumberOfMessages if needed
            messages = client.receive_message(QueueUrl=test_queue_url,
                                              MaxNumberOfMessages=10) 
            # when the queue is exhausted, 
            # the response dict contains no 'Messages' key
            if 'Messages' in messages: 
                # 'Messages' is a list
                for message in messages['Messages']: # 'Messages' is a list
                    # process the messages
                    if counter!=0 and counter <= 50000:
#                       print(message['Body'])
                        file = open(filepath,'a')
                        # Save message to a file
                        file.write(message['Body'])
                        file.write('\n')
                        # Delete Message after read
                        client.delete_message(QueueUrl=test_queue_url,
                                              ReceiptHandle=message['ReceiptHandle'])
                
                    # next, we delete the message from the queue so 
                    # no one else will process it again
                    elif counter == 0:
                        filepath = createfile()
                        print(filepath)
                        file = open(filepath,'w') 
                    else:
                        filepath = createfile()
                        print(filepath)
                        counter = 1
                        file = open(filepath,'w') 
                    file.close() 
                    counter = counter + 1
            else:
                print('Queue is now empty' + str(datetime.now()))
                time.sleep(10) 
                continue
            
    def sqsReceiveToDynamoDB(test_queue_url):
        # next, we dequeue these messages - 10 messages at a time 
        # (SQS max limit) till the queue is exhausted.
        # in production/real setup, I suggest using long polling as 
        # you get billed for each request, regardless of an empty response
        
        counter = 0
        filepath = ''
        while True:
            # adjust MaxNumberOfMessages if needed
            messages = client.receive_message(QueueUrl=test_queue_url,
                                              MaxNumberOfMessages=10) 
            # when the queue is exhausted, 
            # the response dict contains no 'Messages' key
            if 'Messages' in messages: 
                # 'Messages' is a list
                for message in messages['Messages']: 
                    try:
                        # process the messages
                        if 'id' in json.loads(message['Body']):
                            response = dynamotable.put_item(
                                    Item = json.loads(message['Body'])
                                    )
            
                        #print(message['Body'])
                        sqsclient.delete_message(QueueUrl=test_queue_url,
                                                 ReceiptHandle=message['ReceiptHandle'])
                        pass
        
                    except Exception as e:
                        print("Failed SQS Send Record {}".format(str(e))  ) 
                
            else:
                print('Queue is now empty' + str(datetime.now()))
                time.sleep(10) 
                continue
            
            
    def s3Bucket(self):
        # Create an S3 client
        s3 = boto3.client('s3')
        bucket_name = "YOUR-BUCKET-NAME"
        directory_name = "DIRECTORY/TO/CREATE" #it's name of your folders
        s3.put_object(Bucket=bucket_name, Key=(directory_name+'/'))
        # Call S3 to list current buckets
        buckets = s3.list_buckets() 
        resource = boto3.resource('s3') #object oriented API
        #subsitute this for your s3 bucket where you keep your data.
        mybucket =resource.Bucket(bucket_name) 
        
    def s3Upload(bucket_name):
        myfilepath = "DIRECTORY/TO/MY/FILES"
        allfiles = [files for files in sorted(listdir(myfilepath)) 
                    if isfile(join(myfilepath, files))]
        # upload all expect the working one
        for i in range(len(allfiles)-1): 
            print(myfilepath + "/" + allfiles[i])
            fullpath = myfilepath + "/" + allfiles[i]
            mybucket.upload_file(fullpath, allfiles[i])
            # delete from local storage
            os.unlink(fullpath)
            
        # To view all the files in S3
        filelist=[]
        for object in mybucket.objects.all():
            #print(object.key)
            filefullpath = "s3://" + bucket_name + '/' +object.key
            filelist.append(filefullpath)
        print(filelist)
        
    def S3toRedshift(self):
        table = 'sample_table'
        file_path = 's3://xxxxxxxxxxxxx'
        aws_access_key_id = 'xxxxxxxxxxx'
        aws_secret_access_key = 'xxxxxxxxxxxxx'

        dbname = 'dataanalytics'
        port = '5439'
        user = 'admin'
        password = 'password'
        host_url = 'redshift-test.xxxxx.us-xxxx-2.redshift.amazonaws.com'
        import psycopg2
        #Amazon Redshift connect string 
        conn_string = "dbname='{}' port='{}' user='{}' password='{}' host='{}'"\
            .format(dbname,port,user,password,host_url)  
            
        try:
            con = psycopg2.connect(conn_string)
            print("Connection Successful!")
        except:
            print("Unable to connect to Redshift")

        cur = con.cursor()
        for file_path in filelist:
            sql="""copy {} \
                from '{}'\
                credentials \
                'aws_access_key_id={};aws_secret_access_key={}' \
                format as json 'auto'\
                maxerror 10;\
                commit;"""\
                .format(table, file_path, aws_access_key_id,
                        aws_secret_access_key)
                try:
                    cur.execute(sql)
                    print("Copy Command executed successfully")
                except:
                    print("Failed to execute copy command")
        con.close() 
        
        try:
            con = psycopg2.connect(conn_string)
            print("Connection Successful!")
        except:
            print("Unable to connect to Redshift")
    
        #sql = "select count(*) from twitter_stream_data;"
        sql = "select xxxxx group by lang order by count(*) desc;"
        cur = con.cursor()

        try:
            result = cur.execute(sql)
            #print("Output", cur.fetchall())
            for res in cur.fetchall():
                print(res)
        except:
            print("Failed to execute command")
        con.close() 
        
    """
    Kinesis Streams is a service for collecting, storing and processing real-time 
    continuous data streams. Data streams are data that are generated continuously 
    by thousands of data sources, which typically send in the data records 
    simultaneously, and in small sizes (order of Kilobytes). Kinesis requires 
    deploying producer and consumer libraries alongside the application.
    """
    def kinesisFirehose(self):
        my_firehose_name = 'test-firehose'
        firehose_client = boto3.client('firehose', region_name='us-west-2')

        stream_status = firehose_client.describe_delivery_stream(DeliveryStreamName=my_firehose_name)
        if stream_status['DeliveryStreamDescription']['DeliveryStreamStatus'] == 'ACTIVE':
            print("\n ==== KINESES ONLINE ====")
            
    def kinesisFirehose(my_firehose_name):
        try:
                firehose_client.put_record(
                    DeliveryStreamName = my_firehose_name,
                    Record={
                        'Data': json.dumps(twitter_data) + '\n'
                    }
                )
            
                pass
        
        except Exception as e:
            print("Failed Kinesis Put Record {}".format(str(e))  ) 
