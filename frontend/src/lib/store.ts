import { get, writable } from 'svelte/store';
export const modal = writable(false);
export const loginModal = writable(false);
import PocketBase from 'pocketbase';
import {PUBLIC_POCKETBASE_URL} from '$env/static/public'

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export const currentUser = writable(pb.authStore.model);
export const currentJobs = writable([]);

pb.authStore.onChange(() => {
    currentUser.set(pb.authStore.model);
    watchJobsChange();
});


export async function watchUserChange() {
    const getUser = await pb.collection("users").getOne(get(currentUser).id, {});
    currentUser.set(getUser);
    // subscribe to the user data
    pb.collection("users").subscribe('*', async ({action,  record}) => {
        if (action === "update") {
            currentUser.set(record);
        }
    });
}

export async function watchJobsChange() {
    const getJobs = await pb.collection("jobs").getFullList({}, {});
    currentJobs.set(getJobs);
    // subscribe to the user data
    pb.collection("jobs").subscribe('*', async ({action,  record}) => {
        if (action === "update") {
            currentJobs.set(record);
        }
    });
}
