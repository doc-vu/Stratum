from kafka import KafkaConsumer
import json

#CONSTANTS
TOPIC_NAME='DEBS'
KAFKA_SERVER='localhost:9092'

if __name__=="__main__":
  consumer=KafkaConsumer(TOPIC_NAME,bootstrap_servers=KAFKA_SERVER,auto_offset_reset='smallest')
  for msg in consumer:
    print('Received msg on topic:%s at offset:%d:\nmsg=%s\n'%\
      (msg.topic,msg.offset,json.loads(msg.value)))
