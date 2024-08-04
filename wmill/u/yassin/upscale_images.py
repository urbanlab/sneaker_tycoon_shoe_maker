import os
import wmill
from pocketbase import PocketBase  # Client also works the same
from pocketbase.client import FileUpload
from typing import TypedDict
import json
import requests
import base64

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
    url = 'http://192.168.1.98:8090'
    client = PocketBase(url)
    client.admins.auth_with_password(pocketbase['login'], pocketbase['password'])
    result = client.collection("jobs").get_full_list()
    
    
    jobs: c_job = result
    # reverse the list
    i = 0
    for job in jobs:
        image = f'{url}/api/files/yc6m300o97t4q5r/{job.id}/{job.image}'

        headers = {
            'Content-Type': 'application/json',
        }
        payload = {
            "input": {
                "input": image,
                "steps": 10,
                "upscaling_model_type": "general_scenes",
                "super_resolution_factor": 1
            }
        }
        response = requests.post('http://192.168.1.45:5000/predictions', headers=headers, json=payload)
        upscaled_image = response.json()["output"][0]

        # Save the base64 encoded image to a file
        with open('upscaled_image.png', 'wb') as f:
            # Remove the "data:image/png;base64," prefix and decode the string
            image_data = upscaled_image.replace("data:image/png;base64,", "").encode('utf-8')
            f.write(base64.b64decode(image_data))

        updated_job = {
            "image": FileUpload(("upscaled_image.png", open("upscaled_image.png", "rb"))),
        }
        client.collection("jobs").update(job.id, updated_job)

        # Delete the file
        os.remove('upscaled_image.png')
        i = i+1
        print(i)