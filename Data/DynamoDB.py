__author__ = 'zihaozhu, nareddyt'
import boto3
import json
import sys
import decimal


def insertItems(argv, table):
    with table.batch_writer() as batch:
        # Have argv be a list of tuples where first value is english and second is spanish for now
        for count, item in enumerate(argv):
            table.put_item(
                Item = {
                    'id' : count,
                    'English' : item[0],
                    'French' : item[1]
                }
            )
            print("Added word " + str(count))


def main(argv):
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table('French')
    insertItems(argv, table)

if __name__ == '__main__':
    main(sys.argv[1:])
