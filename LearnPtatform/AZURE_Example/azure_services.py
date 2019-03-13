#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sample on creating Azure cloud services using the Python SDK.
@author: anirban-mac
"""

#Azuren Web Services SDK for Python
import uuid
import datetime
import random
import json
from azure.servicebus import ServiceBusService, Message, Queue
from azure.eventhub import EventHubClient, Receiver, Offset
import time


class microsoft_azure:
    # This script expects that the following environment vars are set:
    # Tenant ID for your Azure Subscription
    TENANT_ID = 'xxxxxxxxxxxxxxx'  
    my_resource_group = 'xxxxx-xxxx-DataPlatform'            # the resource group for deployment

    # Your Service Principal App ID
    CLIENT = 'xxx-xxxx-xxxx-xxxx-xxxxxxxxx'

    # Your Service Principal Password
    KEY = 'xxxxxxxxxx/xxxxxxxxxxxxxx'
    subscription_id = "xxxxxx-xxxxx-xxxxx-xxxx-xxxxx"

    credentials = ServicePrincipalCredentials(
            client_id = CLIENT,
            secret = KEY,
            tenant = TENANT_ID
            )


    def __init__(self, service):
        self.service = service
    
    """
    Azure Event Hubs is a Big Data streaming platform and event ingestion 
    service, capable of receiving and processing millions of events per second. 
    Event Hubs can process and store events, data, or telemetry produced by 
    distributed software and devices. 

    """
    def eventhubService(self):
        
        sbs = ServiceBusService(service_namespace='xxxxxxxx', 
                        shared_access_key_name='RootManageSharedAccessKey', 
                        shared_access_key_value='xxxxxx+xxxxxx+xxxxxxxxx=')
        
        
    def eventhubSend(test_queue_url):
        try:
            sbs.send_event('samplequeue', json.dumps(data))
        
        except Exception as e:
            print("Failed SQS Send Record {}".format(str(e))  )
            
    
    def eventhubReceiveToFile(test_queue_url):
        # next, we dequeue these messages - 10 messages at a time 
        # (SQS max limit) till the queue is exhausted.
        # in production/real setup, I suggest using long polling as 
        # you get billed for each request, regardless of an empty response
        counter = 0
        filepath = ''

        CONSUMER_GROUP = "$Default"
        OFFSET = Offset("0")
        PARTITION = "0"

        client = EventHubClient('amqps://xxxxx.servicebus.windows.net/txxxxxqueue', 
                                debug=True, 
                                username='RootManageSharedAccessKey', 
                                password='xxxxxxxxxx=')
        receiver = client.add_receiver(CONSUMER_GROUP, 
                                       PARTITION, prefetch=300, offset=OFFSET)
        try:    
            client.run()
            while True:
                for event_data in receiver.receive(timeout=100):
                    rcv_msg = str(event_data.message)
                    #print((rcv_msg))
                    if len(rcv_msg)>=5:
                        if counter!=0 and counter <= 50000:
                            #print(message['Body'])
                            file = open(filepath,'a')
                            file.write(rcv_msg)
                            file.write('\n')
                            # next, we delete the message from the queue so no one else will process it again
                        elif counter == 0:
                            filepath = createfile()
                            # print(filepath)
                            file = open(filepath,'w') 
                        else:
                            filepath = createfile()
                            #print(filepath)
                            counter = 1
                            file = open(filepath,'w') 
                        file.close() 
                        counter = counter + 1
        except Exception as e:
            print("Failed Receiving Record {}".format(str(e)) ) 
        finally:
            client.stop()
    
    
            
    """
    Azure CosmosDB, which is a global distributed and horizontally scalable 
    database with multi-API support and provides low latency responses at 
    potentially massive scale.
    """    
    def cosmosDBServiceToCosmosDB(self):
        
        database_link = 'dbs/' + DATABASE_ID
        collection_link = database_link + '/colls/' + COLLECTION_ID

        counter = 0
        filepath = ''

        CONSUMER_GROUP = "$Default"
        OFFSET = Offset("0")
        PARTITION = "0"
        eh_client = EventHubClient('amqps://xxxxx.servicebus.windows.net/txxxxqueue', 
                                   debug=True, 
                                   username='RootManageSharedAccessKey', 
                                   password='xxxxxxx+xxxxx+xxxxxxx=')
        receiver = eh_client.add_receiver(CONSUMER_GROUP, PARTITION, 
                                          prefetch=300, offset=OFFSET)
        try:    
            eh_client.run()
            while True:
                for event_data in receiver.receive(timeout=100):
                    rcv_msg = str(event_data.message)
                    # Filter the Null messages
                    if len(rcv_msg)>5:
                        # Load the messages in CosmosDB
                        cosmos_client.CreateDocument(collection_link, 
                                                     json.loads(str(event_data.message)))
   
            eh_client.stop()
        except Exception as e:
            print("Failed Receiving Record {}".format(str(e)) ) 
        finally:
            eh_client.stop()
         
    
    def cosmosDBquery():
        from pydocumentdb import document_client

        uri = 'https://xxxxxxx.documents.azure.com:443/'
        key = 'xxxxxxxxxxxxxx=='

        client = document_client.DocumentClient(uri, {'masterKey': key})
        print(client)

        db_id = 'xxxxStreamDB'
        db_query = "select * from r where r.id = '{0}'".format(db_id)
        db = list(client.QueryDatabases(db_query))[0]
        db_link = db['_self']
        print(db_link)

        coll_id = 'testxxxx'
        coll_query = "select * from r where r.id = '{0}'".format(coll_id)
        coll = list(client.QueryCollections(db_link, coll_query))[0]
        coll_link = coll['_self']
        print(coll_link)

        options = {} 
        options['enableCrossPartitionQuery'] = True
        options['maxItemCount'] = -1
        options['MaxDegreeOfParallelism'] = -1, 

        #query = { 'query': 'SELECT value count(1) FROM  s' }   
        query = { 'query': 'select value count(1) from s'} 
        docs = client.QueryDocuments(coll_link, query, options)
        print(list(docs))
            
    ## Use this only for Azure AD service-to-service authentication
    from azure.common.credentials import ServicePrincipalCredentials

    ## Use this only for Azure AD end-user authentication
    from azure.common.credentials import UserPassCredentials

    ## Use this only for Azure AD multi-factor authentication
    from msrestazure.azure_active_directory import AADTokenCredentials

    ## Required for Azure Data Lake Store account management
    from azure.mgmt.datalake.store import DataLakeStoreAccountManagementClient
    from azure.mgmt.datalake.store.models import DataLakeStoreAccount

    ## Required for Azure Data Lake Store filesystem management
    from azure.datalake.store import core, lib, multithread

    import os
    from azure.common.credentials import ServicePrincipalCredentials
    from azure.mgmt.resource import ResourceManagementClient
    import azure.mgmt.compute.models


    # Common Azure imports
    from azure.mgmt.resource.resources import ResourceManagementClient
    from azure.mgmt.resource.resources.models import ResourceGroup

    ## Use these as needed for your application
    import logging, getpass, pprint, uuid, time

    import os
    from azure.common.credentials import ServicePrincipalCredentials
    from azure.mgmt.resource import ResourceManagementClient
    import azure.mgmt.compute.models

    # This script expects that the following environment vars are set:
    # Tenant ID for your Azure Subscription
    TENANT_ID = 'xxxxxxxxx'  
    my_resource_group = 'RG-xxxxxxxxx-DataPlatform'            # the resource group for deployment

    # Your Service Principal App ID
    CLIENT = 'xxxxxxxxx-xxxxxxxxx'

    # Your Service Principal Password
    KEY = 'xxxxxxxxx/xxxxxxxxx='
    subscription_id = "xxxxxxxxx-xxxxxxxxx"

    RESOURCE = 'https://datalake.azure.net/'

    credentials = ServicePrincipalCredentials(
            client_id = CLIENT,
            secret = KEY,
            tenant = TENANT_ID
            )

    def dataLake(self):
        adlCreds = lib.auth(tenant_id = TENANT_ID,
                client_secret = KEY,
                client_id = CLIENT,
                resource = RESOURCE)
        ## Declare variables
        subscriptionId = subscription_id
        adlsAccountName = 'datalakearm'

        ## Create a filesystem client object
        adlsFileSystemClient = core.AzureDLFileSystem(adlCreds, 
                                                      store_name=adlsAccountName)
        ## List the existing Data Lake Store accounts
    raiseesult_list_response = adlsFileSystemClient.listdir()
    result_list = list(result_list_response)
    for items in result_list:
        print(items)
        
    def dataLakeUpload(bucket_name):
        myfilepath = "DIRECTORY/TO/MY/FILES"
        allfiles = [files for files in sorted(listdir(myfilepath)) 
                    if isfile(join(myfilepath, files))]
        # upload all expect the working one
        for i in range(len(allfiles)-2): 
            #print(myfilepath + allfiles[i])
            fullpath =  myfilepath + allfiles[i]

            datalakepath = '/dataDump/' + allfiles[i]
            print(datalakepath)
            
            try: 
                multithread.ADLUploader(adlsFileSystemClient, 
                        lpath=fullpath, 
                        rpath=datalakepath, nthreads=64, 
                        overwrite=True, buffersize=4194304, blocksize=4194304)
                print("Uploaded: "+ allfiles[i])
                os.unlink(fullpath)
                pass
            except BaseException as e:
                print(e)
        
    def DataLaketoSQLDW(self):
        import pyodbc
        server = 'xxxx.database.windows.net'
        dbname = 'xxxxDW'
        user = 'xx'
        password = 'xxxxx@xxxxx'
        port = '1433'
        driver='{ODBC Driver 17 for SQL Server}'

        table = 'xxxx_stream_data'
        file_path = 'adl://xxxxx.azuredatalakestore.net//xxxxx/xxx-'
        cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';
                              PORT='+ port +';DATABASE='+dbname+';
                              UID='+user+';PWD='+ password)
        cursor = cnxn.cursor()
        sql = "select lang, count(*) from xxx_stream_data;"
        sql = "SELECT lang, COUNT(*) FROM xxxx_stream_data;"
        cursor.execute(sql)
    
        for res in cursor.fetchall():
            print(res)
        
   
    def dataFactory(self):
        ds_name = 'data_in'
        dsOut_name = 'data_out'
        # Create a copy activity
        act_name =  'copydata'
        data_source = AzureDataLakeStoreSource(recursive=True)
        data_sink = SqlDWSink(write_batch_size=1000, write_batch_timeout=None, 
                              sink_retry_count=1, sink_retry_wait=10, 
                              allow_poly_base=False)
        dsin_ref = DatasetReference(ds_name)
        dsOut_ref = DatasetReference(dsOut_name)
        copy_activity = CopyActivity(act_name,inputs=[dsin_ref], 
                                     outputs=[dsOut_ref], source=data_source, 
                                     sink=data_sink)
        #Create a pipeline with the copy activity
        p_name =  'copyPipeline'
        params_for_pipeline = {}
        p_obj = PipelineResource(activities=[copy_activity], parameters=params_for_pipeline)
        p = adf_client.pipelines.create_or_update(rg_name, df_name, p_name, p_obj)
        print_item(p)

        #Create a pipeline run.
        run_response = adf_client.pipelines.create_run(rg_name, df_name, p_name,{})
        pipeline_run = adf_client.pipeline_runs.get(rg_name, 
                                                   df_name, run_response.run_id)
        print("\n\tPipeline run status: {}".format(pipeline_run.status))
        activity_runs_paged = list(adf_client.activity_runs.list_by_pipeline_run(rg_name, 
                                    df_name, pipeline_run.run_id, 
                                    datetime.now() - timedelta(1),  
                                    datetime.now() + timedelta(1)))
        print_activity_run_details(activity_runs_paged[0])