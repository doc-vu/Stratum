from kafka import KafkaConsumer
import numpy as np
import json

#CONSTANTS
TOPIC_NAME='CIFAR'
KAFKA_SERVER='localhost:9092'

if __name__=="__main__":
  consumer=KafkaConsumer(TOPIC_NAME,bootstrap_servers=KAFKA_SERVER,auto_offset_reset='smallest')
  for msg in consumer:
    sample=json.loads(msg.value)
    label=sample['label']
    img=np.asarray(sample['img'])
    
    print('Received training image on topic:%s at offset:%d:\nlabel:%d img_shape:%s\n'%\
      (msg.topic,msg.offset,label,img.shape))
