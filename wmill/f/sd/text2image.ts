// Ctrl/CMD+. to cache dependencies on imports hover.

// Deno uses "npm:" prefix to import from npm (https://deno.land/manual@v1.36.3/node/npm_specifiers)
// import * as wmill from "npm:windmill-client@1"

// fill the type, or use the +Resource type to get a type-safe reference to a resource
// type Postgresql = object

type CSdImg2img = {
  seed: number,
  steps: number,
  width: number,
  height: number,
  n_iter: number,
  prompt: string,
  cfg_scale: number,
  save_images: boolean,
  send_images: boolean,
  negative_prompt: string,
  alwayson_scripts: {
    controlnet: {
      args: [
        {
          enabled: boolean,
          module: string,
          model: string,
          weight: number,
          image: string
        }
      ]
    }
  }
}

type CJob = {
  id: string,
  form: string[],
  image: string,
  prompt: string,
  status: string,
  init_text: string
  
}

export async function main(
  job: CJob,
  sdUrl: string = "http://192.168.1.98:7860"

) {

  const form = job.form

  // fetch the image and convert to base64
  const requestImage = await fetch(form);
  const buffer = await requestImage.arrayBuffer();
  let form64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  // add base64 header
  form64  = "data:image/png;base64," + form64

  //console.log(form64)

  let sdConfig : CSdImg2img = {
    seed: -1,
    steps: 30,
    width: 1344,
    height: 768,
    n_iter: 1,
    prompt: job.prompt,
    cfg_scale: 7,
    save_images: false,
    send_images: true,
    negative_prompt: "text, logo",
    alwayson_scripts: {
      controlnet: {
        args: [
            {
                enabled: true,
                module: "depth_midas",
                model: "diffusers_xl_depth_full [2f51180b]",
                weight: 0.8,
                image: form64,
                controlnet_processor_res: 1024
            }
        ]
      }
    }
  }

  // fetch the image
  const request = await fetch(sdUrl + "/sdapi/v1/txt2img", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sdConfig),
  });

  // get the response
  const response = await request.json();

  // add base64 header
  const image  = "data:image/png;base64," + response.images[0]
  
  return image
}
