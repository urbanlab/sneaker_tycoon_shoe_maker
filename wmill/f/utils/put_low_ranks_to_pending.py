import os
import wmill
from pocketbase import PocketBase  # Client also works the same
from typing import TypedDict
import json

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

def main(
    pocketbase: c_pocketbase,
):
    client = PocketBase('http://192.168.1.98:8090')
    client.admins.auth_with_password(pocketbase['login'], pocketbase['password'])
    result = client.collection("jobs").get_full_list()
    
    jobs: c_job = result
    i = 0
    for job in jobs:
        if job.rank == 1:
            updatedJob = {'status': 'pending'}
            client.collection("jobs").update(job.id, updatedJob)
            i = i+1
    print(i) 
        # update job 
        #client.collection("jobs").update(job.id, updatedJob)

