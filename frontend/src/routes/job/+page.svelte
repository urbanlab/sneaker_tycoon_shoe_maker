<script lang="ts">
	import { onMount } from 'svelte';
	import type { Color, Form, Material, Settings, Job } from '../../lib/models';
	import { currentJobs, pb } from '../../lib/store';
	import { get } from 'svelte/store';
    import JSZip from 'jszip';
    import { saveAs } from 'file-saver';

	// color type is array of colors
	let color: Array<Color> = [];
	let form: Array<Form> = [];
	let material: Array<Material> = [];
	let settings: Settings = {};

	let progress = 0;

	let jobs: Array<Job> = [];
            
    let stats = {
        totalJobs: 0,
        finishedJobs: 0,
        remainingJobs: 0,
        hours: 0,
        minutes: 0,
        percent: "10"
    };


	onMount(async () => {
		color = await pb.collection('color').getFullList();
		form = await pb.collection('form').getFullList();
		material = await pb.collection('material').getFullList();
		settings = await pb.collection('settings').getFullList();
		settings = settings[0];
        // set timeout to get jobs
        setTimeout(async () => {
            stats = await getStats()
            console.log(stats)
        }, 5000);
	});

    $: console.log($currentJobs)
 

    async function getStats() {
        const totalJobs = jobs.length;
        const finishedJobs = $currentJobs.filter((j) => j.status === 'finished').length;
        const remainingJobs = $currentJobs.filter((j) => j.status === 'pending').length;
        const minutes = (remainingJobs * 18) / 60;
        const hours = Math.floor(minutes / 60);
        

        console.log(totalJobs, finishedJobs, remainingJobs, hours, minutes);

        return {
            totalJobs: totalJobs,
            finishedJobs: finishedJobs,
            remainingJobs: remainingJobs,
            hours: hours,
            minutes: minutes,
            percent: "0"
        };
    }

	function generatePrompts() {
		// Loop through each color, material, form, and
		for (const c of color) {
			for (const m of material) {
				for (const f of form) {
					// Create a prompt for each combination
					const prompt = ` ${settings.init_prompt} ${f.name} shoe  ${c.name}, ${m.name}, ${settings.ending_prompt}`;
					const init = `${c.name}_${m.name}_${f.name}`;
					let job: Job = {
						prompt: prompt,
						form: f.id,
						init_text: init,
						status: 'pending',
						rank: 3,
                        json: {
                            //random id based on time 
                            id:  String(Math.floor(Math.random() * Date.now())),
                            fileName: `${f.machine_name}_${c.machine_name}_${m.machine_name}.png`,
                            color: c.machine_name,
                            material: m.machine_name,
                            form: f.machine_name,
                            score: 3,
                            prompt: prompt,
                        }
					};
                    // add 7 times to jobs
                    for (let i = 0; i < 7; i++) {
                        jobs = [...jobs, job];
                    }
				}
			}
		}
	}

	async function addJobs() {
		// reduce job to 3 items
		//jobs = jobs.slice(0, 3)

		// set progress to 0
		progress = 0;

		// Get the number of jobs
		const numJobs = jobs.length;

		// Add jobs to the database
		for (const j of jobs) {
			console.log(j);
			await pb.collection('jobs').create(j);
			// set progress based on number of jobs
			progress = progress + 100 / numJobs;
		}
	}

	async function updateJobRank(jobId: string, rank: number) {
        const currentJob = get(currentJobs).find((j) => j.id === jobId);
        let json = currentJob.json;
        json.score = rank;
		const job = {
			id: jobId,
			rank: rank,
            json: json
		};
		await pb.collection('jobs').update(jobId, job);
	}

	async function deleteJob(jobId: string) {
		await pb.collection('jobs').delete(jobId);
	}

    async function downloadAsZip() {
        // get finised jobs images and download as zip + shoes.json
        const finishedJobs = get(currentJobs).filter((j) => j.status === 'finished');
        const json = finishedJobs.map((j) => j.json);
        console.log(json);

        const zip = new JSZip();
        const folder = zip.folder('images');
        const jsonFile = zip.file('shoes.json', JSON.stringify(json));

        for (const j of finishedJobs) {
            const image = await fetch(pb.files.getUrl(j, j.image));
            const blob = await image.blob();
            folder.file(j.json.fileName, blob);
        }

        zip.generateAsync({ type: 'blob' }).then(function (content) {
            // see FileSaver.js
            saveAs(content, 'shoes.zip');
        });




    }
</script>

<section>
	<div>
		<div>Number of {jobs.length}</div>
		<div>Estimated duration {(stats?.hours)} hours {(stats?.minutes)} minutes</div>
		<progress class="progress w-56" value={stats?.percent} max="100"></progress>
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
	</div>

	<button class="btn btn-primary" on:click={generatePrompts}>Generate Prompts</button>

	<button class="btn btn-primary" on:click={addJobs}>Add Jobs</button>

    <button class="btn btn-primary" on:click={downloadAsZip}>Download as Zip</button>
	<div>
		<div class="collapse bg-base-200">
			<input type="checkbox" />
			<div class="collapse-title text-xl font-medium">Preview of Prompts</div>
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
			<div class="collapse-title text-xl font-medium">Generation status</div>
			<div class="collapse-content">
				<div class="flex flex-wrap">
					{#each $currentJobs as j}
						<div class="w-1/3 flex flex-col">
							{#if j.status === 'started'}
								<span class="loading loading-spinner loading-xs"></span>
							{/if}
							{#if j.status === 'finished'}
								<a href={pb.files.getUrl(j, j.image)} target="_blank">
									<img class="rounded-md" loading="lazy" src={pb.files.getUrl(j, j.image)} />
								</a>
								<p>{j.init_text}</p>
								<div>
									<button
										class="btn {j.rank == 1 ? 'btn-secondary' : ' btn-primary'}"
										on:click={() => updateJobRank(j.id, 1)}>1</button
									>
									<button
										class="btn {j.rank == 2 ? 'btn-secondary' : ' btn-primary'}"
										on:click={() => updateJobRank(j.id, 2)}>2</button
									>
									<button
										class="btn {j.rank == 3 ? 'btn-secondary' : ' btn-primary'}"
										on:click={() => updateJobRank(j.id, 3)}>3</button
									>
									<button
										class="btn {j.rank == 4 ? 'btn-secondary' : ' btn-primary'}"
										on:click={() => updateJobRank(j.id, 4)}>4</button
									>
									<button
										class="btn {j.rank == 5 ? 'btn-secondary' : ' btn-primary'}"
										on:click={() => updateJobRank(j.id, 5)}>5</button
									>
									<button class="btn bg-red-500" on:click={() => deleteJob(j.id)}>
										<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
											><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
												d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
											/></svg
										>
									</button>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
