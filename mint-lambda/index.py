import json

def lambda_handler(event, context):
    
    print("calling lambda function for first batch of jobs")
    print(event)
    # return {
    #     'statusCode': 200,
    #     'body': json.dumps('Hello from Lambda!')
    # }