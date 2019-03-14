from kafka import KafkaProducer
import numpy as np
import matplotlib.pyplot as plt
import  pickle,json,time

#constants
# downloaded the cifar-10 dataset from here: https://www.cs.toronto.edu/~kriz/cifar.html
KAFKA_SERVER='localhost:9092'
TOPIC_NAME='CIFAR'
INPUT_DATA_FILES=['./data/cifar-10-batches-py/data_batch_1',\
'./data/cifar-10-batches-py/data_batch_2',\
'./data/cifar-10-batches-py/data_batch_3',\
'./data/cifar-10-batches-py/data_batch_4',\
'./data/cifar-10-batches-py/data_batch_5']


class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
            np.int16, np.int32, np.int64, np.uint8,
            np.uint16, np.uint32, np.uint64)):
            return int(obj)
        elif isinstance(obj, (np.float_, np.float16, np.float32, 
            np.float64)):
            return float(obj)
        elif isinstance(obj,(np.ndarray,)): 
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def unpickle(file_name):
  with open(file_name,'rb') as fo:
    datadict=pickle.load(fo,encoding='bytes')
  return datadict 

if __name__=="__main__":
  #create kafka producer
  producer=KafkaProducer(bootstrap_servers=KAFKA_SERVER)

  for input_file in INPUT_DATA_FILES:
    # load the dataset
    datadict = unpickle(input_file)
    X= datadict[b'data']
    Y= np.array(datadict[b'labels'])

    
    for i in range(10000):
      img=np.array(X[i])
      img = img.reshape(3, 1024).T
      img = img.reshape(32, 32, 3)
      label=Y[i]
      msg=json.dumps({'label':label,\
        'img':img.tolist()},cls=NumpyEncoder)
      future=producer.send(TOPIC_NAME,msg.encode('utf-8'))
      result=future.get(timeout=60)
      print('Sent msg on topic:%s at offset:%d'%(result.topic,result.offset))
      time.sleep(5)
