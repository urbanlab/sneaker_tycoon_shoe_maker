<script lang="ts">
	import { currentUser } from "$lib/store";
    import { login, logout } from "$lib/utils/auth";

    let email = "";
    let password = "";

</script>
<section>
        <h1>Logged in as {$currentUser.name}</h1>
        <button on:click={logout}>Logout</button>

</section>