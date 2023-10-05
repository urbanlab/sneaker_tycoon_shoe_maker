<script lang="ts">
    import { onMount } from "svelte";
	import type { Color, Form, Material, Settings, Texture, Job } from "../../lib/models";
	import { currentJobs, pb } from "../../lib/store";
	import { get } from "svelte/store";

    // color type is array of colors
    let color : Array<Color> = []
    let form : Array<Form> = []
    let material : Array<Material> = []
    let texture : Array<Texture> = []
    let settings: Settings = {}

    let progress = 0

    let jobs: Array<Job> = []

    $: console.log($currentJobs)

    onMount(async () => {
        color = await pb.collection('color').getFullList()
        form = await pb.collection('form').getFullList()
        material = await pb.collection('material').getFullList()
        texture = await pb.collection('texture').getFullList()
        settings = await pb.collection('settings').getFullList()
        settings = settings[0]
    })

    function generatePrompts() {

        // Loop through each color, material, form, and texture
        for (const c of color) {
            for (const m of material) {
                for (const f of form) {
                    for (const t of texture) {
                        // Create a prompt for each combination
                        const prompt = ` ${settings.init_prompt} ${c.name}, ${m.name}, and ${t.name}, ${settings.ending_prompt}`;
                        const init = `${c.name}_${m.name}_${f.name}_${t.name}`;
                        let job : Job = {
                            prompt: prompt,
                            form: f.id,
                            init_text: init,
                            status: 'pending',
                            rank: 3,
                        }
                        jobs = [...jobs, job]
                    }
                }
            }
        }
    }

    async function addJobs() {

        // reduce job to 3 items
        //jobs = jobs.slice(0, 3)

        // set progress to 0
        progress = 0

        // Get the number of jobs
        const numJobs = jobs.length

        // Add jobs to the database
        for (const j of jobs) {
            console.log(j)
            await pb.collection('jobs').create(j)
            // set progress based on number of jobs
            progress = progress + (100 / numJobs)
        }
    }

    async function updateJobRank(jobId: string, rank: number) {
        const job = {
            id: jobId,
            rank: rank
        }
        await pb.collection('jobs').update(jobId, job)
    }

    async function deleteJob(jobId: string) {
        await pb.collection('jobs').delete(jobId)
    }


</script>
<section>
    <div>
        <div>Number of {jobs.length}</div>
        <div>Estimated duration {(jobs.length * 4)/ 60 } minutes</div>
        <progress class="progress w-56" value={progress} max="100"></progress>
    </div>
    <div>
        <select class="select w-full max-w-xs">
            <option disabled selected>Color</option>
            {#each color as c}
                <option value={c.id}>{c.name}</option>
            {/each}
        </select>
        <select class="select w-full max-w-xs">
            <option disabled selected>Form</option>
            {#each form as f}
                <option value={f.id}>{f.name}</option>
            {/each}
        </select>
        <select class="select w-full max-w-xs">
            <option disabled selected>Material</option>
            {#each material as m}
                <option value={m.id}>{m.name}</option>
            {/each}
        </select>
        <select class="select w-full max-w-xs">
            <option disabled selected>Texture</option>
            {#each texture as t}
                <option value={t.id}>{t.name}</option>
            {/each}
        </select>
    </div>
   
    <button class="btn btn-primary" on:click={generatePrompts}>Generate Prompts</button>

    <button class="btn btn-primary" on:click={addJobs}>Add Jobs</button>
    <div>
    <div class="collapse bg-base-200">
        <input type="checkbox" /> 
        <div class="collapse-title text-xl font-medium">
            Preview of Prompts
        </div>
        <div class="collapse-content"> 
            {#each jobs as j}
            <div>
                <p>{j.prompt}</p>
                <p>{j.init_text}</p>
            </div>
            {/each}
        </div>
    </div>

    <div class="collapse collapse-open bg-base-200">
        <input type="checkbox" /> 
        <div class="collapse-title text-xl font-medium">
            Generation status
        </div>
        <div class="collapse-content"> 
            <div class="flex flex-wrap">
                {#each $currentJobs as j}
                <div class="w-1/4 flex flex-col ">
                    {#if j.status === 'started'}
                    LOOOOOl
                        <span class="loading loading-spinner loading-xs"></span>
                    {/if}
                    {#if j.status === 'finished'}
                        <img class="rounded-md" loading="lazy" src={pb.files.getUrl(j, j.image)} />
                        <p>{j.init_text}</p>
                        <div>
                            <button class="btn {j.rank == 1 ? "btn-secondary" : " btn-primary" }" on:click={() => updateJobRank(j.id, 1)}>1</button>
                            <button class="btn {j.rank == 2 ? "btn-secondary" : " btn-primary" }" on:click={() => updateJobRank(j.id, 2)}>2</button>
                            <button class="btn {j.rank == 3 ? "btn-secondary" : " btn-primary" }" on:click={() => updateJobRank(j.id, 3)}>3</button>
                            <button class="btn {j.rank == 4 ? "btn-secondary" : " btn-primary" }" on:click={() => updateJobRank(j.id, 4)}>4</button>
                            <button class="btn {j.rank == 5 ? "btn-secondary" : " btn-primary" }" on:click={() => updateJobRank(j.id, 5)}>5</button>
                            <button class="btn bg-red-500" on:click={() => deleteJob(j.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </button>
                        </div>
                    {/if}

                </div>
                {/each}
            </div>
        </div>
    </div>
        
</section>