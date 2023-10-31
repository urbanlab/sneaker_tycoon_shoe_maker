import os
import wmill
from pocketbase import PocketBase  # Client also works the same
from typing import TypedDict
import json
import requests
import boto3
import time

# os install zip
os.system('apt-get install zip -y')

class c_pocketbase(TypedDict):
    url: str
    login: str
    password: str

class c_job(TypedDict):
    id: str
    form: list
    json: dict
    rank: float
    image: str
    prompt: str
    status: str
    init_text: str

class s3(TypedDict):
    port: float
    bucket: str
    region: str
    useSSL: bool
    endPoint: str
    accessKey: str
    pathStyle: bool
    secretKey: str


def main(
    pocketbase: c_pocketbase,
    s3: s3,
):

    try:
        # remove zip file
        os.remove('shoes.zip')

        # remove folder images recursively
        os.system('rm -rf images')

        #remove json file
        os.remove('shoes.json')
    except OSError as e:
        print("Error: %s - %s." % (e.filename, e.strerror))


    client = PocketBase('http://192.168.1.98:8090')
    client.admins.auth_with_password(pocketbase['login'], pocketbase['password'])
    result = client.collection("jobs").get_full_list()
    
    jsonFile = []


    # create folder images 
    os.makedirs('images')
    

    for job in result:
        # add image url to json list {url, job.id}
        url = client.get_file_url(job, job.image, {})
        print("Downloading: " + url )
        r = requests.get(url, allow_redirects=True)
        # rename image to job.id + .png
        open('images/' + job.id + '.png', 'wb').write(r.content)

        jsonFile.append(job.json)


    # create json file
    with open('shoes.json', 'w') as outfile:
        json.dump(jsonFile, outfile)
    
    # create zip file
    os.system('zip -r shoes.zip images shoes.json')

    # upload zip file to s3
    s3Client = boto3.client('s3', 
        endpoint_url=s3['endPoint'],
        aws_access_key_id=s3['accessKey'],
        aws_secret_access_key=s3['secretKey'],
        region_name=s3['region'],
        use_ssl=s3['useSSL'],
        verify=False
    )

    s3Client.upload_file('shoes.zip', s3['bucket'], time.strftime("%Y%m%d-%H%M%S") + '.zip')

    # get public url
    url = s3Client.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': s3['bucket'],
            'Key': time.strftime("%Y%m%d-%H%M%S") + '.zip'
        }
    )

    return url
