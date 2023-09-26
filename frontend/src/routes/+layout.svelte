<script>
    import "../app.css";
    import { onMount } from "svelte";
	import { watchJobsChange, watchUserChange } from "../lib/store";

    onMount(() => {
       watchUserChange();
       watchJobsChange();
    });
  </script>
  
  <slot />