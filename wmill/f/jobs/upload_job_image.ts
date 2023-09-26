import {default as Pocket} from "npm:pocketbase@0.17.3";


type CPocketbase = {
  url: string,
  login: string,
  password: string

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
  pocketbase: CPocketbase,
  image: string,
  job: CJob
) {


  const pb = new Pocket(pocketbase.url)

  try {
    await pb.admins.authWithPassword(pocketbase.login, pocketbase.password);
  } catch (e) {
    console.log(e);
    throw e;
  }

  try {

    let formData = new FormData();

    //convert image to blob
    const response = await fetch(image);
    const blob = await response.blob();


    formData.append('image', blob, 'image.png');
    
    const record = await pb.collection('jobs').update(job.id, formData);

    return record;
  } catch (e) {
    console.log(e);
    throw e;
  }

}
