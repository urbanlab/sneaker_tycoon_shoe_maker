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

    for job in jobs:
        json = {
            "color": job.json["color"],
            "filename": job.id + ".png",
            "form": job.json["form"],
            "id": job.id,
            "material": job.json["material"],
            "prompt": job.json["prompt"],
            "score": job.rank,
        }
        print(json)
        updatedJob = {
            "id": job.id,
            "json": json,
            "rank": job.rank,
            "image": job.image,
            "prompt": job.prompt,
            "status": job.status,
            "init_text": job.init_text,
        }
        client.collection("jobs").update(job.id, updatedJob)

