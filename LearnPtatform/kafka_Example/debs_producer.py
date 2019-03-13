from kafka import KafkaProducer
import time,json

#constants
# debs taxi dataset from: http://www.debs2015.org/call-grand-challenge.html
KAFKA_SERVER='localhost:9092'
TOPIC_NAME='DEBS'
INPUT_DATA_FILE='data/sorted_data.csv'

if __name__=="__main__":
  producer=KafkaProducer(bootstrap_servers=KAFKA_SERVER)
  with open(INPUT_DATA_FILE,'r') as f:
    for line in f:
      medallion,hack_license,pickup_datetime,dropoff_datetime,\
      trip_time_in_secs,trip_distance,pickup_longitude,pickup_latitude,\
      dropoff_longitude,dropoff_latitude,payment_type,fare_amount,\
      surcharge,mta_tax,tip_amount,tolls_amount,total_amount= line.rstrip().split(',') 
      msg= json.dumps({'medallion': medallion,\
        'hack_license': hack_license,\
        'pickup_datetime': pickup_datetime,\
        'dropoff_datetime': dropoff_datetime,\
        'trip_time_in_secs': int(trip_time_in_secs),\
        'trip_distance': float(trip_distance),\
        'pickup_longitude': float(pickup_longitude),\
        'pickup_latitude': float(pickup_latitude),\
        'dropoff_longitude': float(dropoff_longitude),\
        'dropoff_latitude': float(dropoff_latitude),\
        'payment_type': payment_type,\
        'fare_amount': float(fare_amount),\
        'surcharge': float(surcharge),\
        'mta_tax': float(mta_tax),\
        'tip_amount': float(tip_amount),\
        'tolls_amount': float(tolls_amount),\
        'total_amount': float(total_amount),\
         })
      future=producer.send(TOPIC_NAME,msg.encode('utf-8'))
      result=future.get(timeout=60)
      print('Sent msg on topic:%s at offset:%d:\nmsg=%s\n'%(result.topic,result.offset,msg))
      time.sleep(5)
