<script>
	import Switch from '@smui/switch';

	export let typeRelationsChecked;
</script>

<header class="w-full h-auto, flex justify-center flex-wrap">
	<h1 class="animate-bounce text-xl text-white mt-2">Random Pokemon {@html ':)'}</h1>
	<div class="w-full flex justify-center">
		<div class="inline-block align-text-bottom">
			<Switch bind:checked={typeRelationsChecked} />
			<span class=" h-fit text-white">Display type relations</span>
		</div>
	</div>
</header>
