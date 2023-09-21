<script lang="ts">
    import { onMount } from "svelte";
	import type { Color, Form, Material, Settings, Texture, Job } from "../../lib/models";
	import { pb } from "../../lib/store";

    // color type is array of colors
    let color : Array<Color> = []
    let form : Array<Form> = []
    let material : Array<Material> = []
    let texture : Array<Texture> = []
    let settings: Settings = {}

    let progress = 0

    let jobs: Array<Job> = []

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
                        const prompt = ` ${settings.init_prompt} ${c.name}, ${m.name}, ${f.name}, and ${t.name}, ${settings.ending_prompt}`;
                        const init = `${c.name}_${m.name}_${f.name}_${t.name}`;
                        let job : Job = {
                            prompt: prompt,
                            form: f.id,
                            init_text: init,
                            status: 'pending',
                        }
                        jobs = [...jobs, job]
                    }
                }
            }
        }
    }

    async function addJobs() {

        // reduce job to 3 items
        jobs = jobs.slice(0, 3)

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


    $: console.log(jobs)

</script>
<section>
    <div>
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
        
</section>