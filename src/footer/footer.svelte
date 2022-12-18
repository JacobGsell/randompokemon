<script>
	import BottomAppBar, { Section } from '@smui-extra/bottom-app-bar';

	let bottomAppBar;
    export let handleClick = () => {}
</script>

<footer>
	<BottomAppBar
		class="cursor-pointer flex justify-center"
		bind:this={bottomAppBar}
		on:click={handleClick}
	>
		<Section style="display:flex; justify-content:center;">
			<h3 class="hidden md:flex text-lg capitalize">[Spacebar] Reload</h3>
			<h3 class="md:hidden text-lg capitalize">Reload</h3>
		</Section>
	</BottomAppBar>
</footer>
