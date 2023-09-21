import {default as Pocket} from "npm:pocketbase@0.17.3";


type CPocketbase = {
  url: string,
  login: string,
  password: string

}


export async function main(
  pocketbase: CPocketbase,
) {


  const pb = new Pocket(pocketbase.url)

  try {
    await pb.admins.authWithPassword(pocketbase.login, pocketbase.password);
  } catch (e) {
    console.log(e);
    throw e;
  }

  try {
    const record = await pb.collection('jobs').getFullList();

    return record;
  } catch (e) {
    console.log(e);
    throw e;
  }





}
