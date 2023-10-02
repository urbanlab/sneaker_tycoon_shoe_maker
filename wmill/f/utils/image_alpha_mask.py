import os
import wmill
import urllib.request
from PIL import Image, ImageFilter
import base64
from io import BytesIO
# You can import any PyPi package. 
# See here for more info: https://www.windmill.dev/docs/advanced/imports#python

# you can use typed resources by doing a type alias to dict
#postgresql = dict

def main(
    image: str = "http://192.168.1.98:8090/api/files/yc6m300o97t4q5r/ue0pyj7okn7gy2e/image_1V9TIbSwuu.png",
    mask: str = "http://192.168.1.98:8090/api/files/2fa6vj7ga0bm8lc/7su16y7fqwp7xic/running_mask_JWz1Xd6JB9.jpg"
):

    # save the image and mask to the local filesystem
    urllib.request.urlretrieve(image, "image.png")
    urllib.request.urlretrieve(mask, "mask.png")

    # open the image and mask with PIL
    image = Image.open("image.png")
    mask = Image.open("mask.png")
    
    # convert the mask to a binary mask
    mask = mask.convert("L")

    # invert mask
    mask = Image.eval(mask, lambda a: 255 - a)


    # apply the mask to the image but invert the mask first
    image.putalpha(mask)
    # convert to base64
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue())

    # add a header to the image
    img_str = "data:image/png;base64," + img_str.decode("utf-8")

    print(img_str)

    # clean up
    os.remove("image.png")
    os.remove("mask.png")


    # return the base64 encoded image
    return img_str