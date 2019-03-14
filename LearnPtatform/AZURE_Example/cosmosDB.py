#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""


@author: anirban-mac
"""

import pydocumentdb
import pydocumentdb.document_client as document_client
import pydocumentdb.errors as errors

# Configure python-sdk for Cosmos DB
HOST = 'https://cosmosdb.documents.azure.com:443/'
MASTER_KEY = 'xxxxxxxxxxxxxxxxx=='
DATABASE_ID = 'xxxxxxxxxStreamDB'
#COLLECTION_ID = 'xxxxcollection'
COLLECTION_ID = 'testxxxxxxx'
config = { 
    'ENDPOINT': 'https://cosmosdb.documents.azure.com:443/',
    'MASTERKEY': 'xxxxxxxxxxxxxx==',
    'DOCUMENTDB_DATABASE': 'xxxxxxxxStreamDB',
    'DOCUMENTDB_COLLECTION': 'xxxxxxxxxcollection'
};

# Initialize the Python DocumentDB client
cosmos_client = document_client.DocumentClient(config['ENDPOINT'], 
                                               {'masterKey': config['MASTERKEY']})

class DatabaseManagement:
    @staticmethod
    def find_database(client, id):
        print('1. Query for Database')

        databases = list(client.QueryDatabases({
            "query": "SELECT * FROM r WHERE r.id=@id",
            "parameters": [
                { "name":"@id", "value": id }
            ]
        }))

        if len(databases) > 0:
            print('Database with id \'{0}\' was found'.format(id))
        else:
            print('No database with id \'{0}\' was found'. format(id))
        
    @staticmethod
    def create_database(client, id):
        print("\n2. Create Database")
        
        try:
            client.CreateDatabase({"id": id})
            print('Database with id \'{0}\' created'.format(id))

        except errors.DocumentDBError as e:
            if e.status_code == 409:
                print('A database with id \'{0}\' already exists'.format(id))
            else: 
                raise errors.HTTPFailure(e.status_code)               
    
    @staticmethod
    def read_database(client, id):
        print("\n3. Get a Database by id")

        try:
            # All DocumentDB resources are addressable via a link
            # This link is constructed from a combination of resource hierachy and 
            # the resource id. 
            # Eg. The link for database with an id of Foo would be dbs/Foo
            database_link = 'dbs/' + id

            database = client.ReadDatabase(database_link)
            print('Database with id \'{0}\' was found, it\'s _self is {1}'.format(id, database['_self']))

        except errors.DocumentDBError as e:
            if e.status_code == 404:
                print('A database with id \'{0}\' does not exist'.format(id))
            else: 
                raise errors.HTTPFailure(e.status_code)    

    @staticmethod
    def list_databases(client):
        print("\n4. List all Databases on an account")
        
        print('Databases:')
        
        databases = list(client.ReadDatabases())
        
        if not databases:
            return

        for database in databases:
            print(database['id'])          

    @staticmethod
    def delete_database(client, id):
        print("\n5. Delete Database")
        
        try:
            database_link = 'dbs/' + id
            client.DeleteDatabase(database_link)

            print('Database with id \'{0}\' was deleted'.format(id))

        except errors.DocumentDBError as e:
            if e.status_code == 404:
                print('A database with id \'{0}\' does not exist'.format(id))
            else: 
                raise errors.HTTPFailure(e.status_code)
                
class DocumentManagement:
    
    @staticmethod
    def CreateDocuments(client):
        print('Creating Documents')

        # Create a SalesOrder object. This object has nested properties and various types including numbers, DateTimes and strings.
        # This can be saved as JSON as is without converting into rows/columns.
        sales_order = DocumentManagement.GetSalesOrder("SalesOrder1")
        client.CreateDocument(collection_link, sales_order)


    @staticmethod
    def ReadDocument(client, doc_id):
        print('\n1.2 Reading Document by Id\n')

        # Note that Reads require a partition key to be spcified. This can be skipped if your collection is not
        # partitioned i.e. does not have a partition key definition during creation.
        doc_link = collection_link + '/docs/' + doc_id
        response = client.ReadDocument(doc_link)

        print('Document read by Id {0}'.format(doc_id))
        print('Account Number: {0}'.format(response.get('account_number')))

    @staticmethod
    def ReadDocuments(client):
        print('\n1.3 - Reading all documents in a collection\n')

        # NOTE: Use MaxItemCount on Options to control how many documents come back per trip to the server
        #       Important to handle throttles whenever you are doing operations such as this that might
        #       result in a 429 (throttled request)
        documentlist = list(client.ReadDocuments(collection_link, {'maxItemCount':10}))
        
        print('Found {0} documents'.format(documentlist.__len__()))
        
        for doc in documentlist:
            print('Document Id: {0}'.format(doc.get('id')))