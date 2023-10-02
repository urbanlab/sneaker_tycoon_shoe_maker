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

    //get all forms
    let forms = await pb.collection('form').getFullList()

    //get image url for each form
    forms.map(async (item) => {
      let files =  pb.files.getUrl(item, item.image);
      item.image = files;
      let mask = pb.files.getUrl(item, item.mask);
      item.mask = mask
      return item;
    }
    );

    console.log(forms);
   

    let record = await pb.collection('jobs').getList(1, 500, {
      filter: 'status="pending"',
    });


    // for each item if item.form == form array name then get url for each file
    record.items.map(async (item) => {
      console.log(forms.find((form) => form.id == item.form)?.mask)
      item.form = forms.find((form) => form.id == item.form)?.image;
      item.mask = forms.find((form) => form.id == item.form)?.mask;
      return item;
    }
    );

    

    return record.items;
  } catch (e) {
    console.log(e);
    throw e;
  }





}
