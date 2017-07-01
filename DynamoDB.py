__author__ = 'zihaozhu'
import boto3
import json
import decimal

dynamoDB = boto3.resource('dynamodb', region_name='us-west-1')
table = dynamoDB.Table('Spanish')
dynamoDB

print(dynamoDB)