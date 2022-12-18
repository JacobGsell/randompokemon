<script>
	import { onMount } from 'svelte';
	import PokeCard from '../pokemon/card/pokeCard.svelte';
	import InfoPanel from '../pokemon/info/InfoPanel.svelte';
	import { getRandomPokemonId } from '../pokemon/util/util.svelte';
	import Header from '../header/header.svelte';
	import Footer from '../footer/footer.svelte';

	let typeRelationsChecked = false;
	let promise = getRandomPokemonId();

	onMount(async () => {
		window.addEventListener('keydown', function (e) {
			if (e.key == ' ' || e.code == 'Space' || (e.keyCode == 32 && e.target == document.body)) {
				e.preventDefault();
				handleGetPokemon();
			}
		});
	});

	function handleGetPokemon() {
		promise = getRandomPokemonId();
	}
</script>

<div class="h-screen  w-full bg-stone-900 flex flex-col justify-between">
	<Header bind:typeRelationsChecked />

	<main class="md:w-full h-auto flex mb-10 min-w-fit flex-col md:flex-row justify-center gap-4">
		{#await promise}
			<PokeCard name={'...'} id={0} flavor_text={'...'} url={''} types={['normal']} />
		{:then pokemon}
			<PokeCard
				name={pokemon.name}
				id={pokemon.id}
				flavor_text={pokemon.flavor_text}
				url={pokemon.url}
				types={pokemon.types}
			/>
		{/await}

		{#if typeRelationsChecked}
			<div
				id="typesInfoContainer"
				class="flex flex-col md:row-span-2 md:flex-row bg-stone-900 justify-evenly align-middle gap-4 flex-wrap"
			>
				{#await promise}
					<InfoPanel title={'High damage from'} chipsInfo={[]} />
					<InfoPanel title={'Low damage from'} chipsInfo={[]} />
					<InfoPanel title={'High damage to'} chipsInfo={[]} />
					<InfoPanel title={'Low damage to'} chipsInfo={[]} />
					<InfoPanel title={'No damage from'} chipsInfo={[]} />
				{:then pokemon}
					<InfoPanel
						title={'High damage from'}
						chipsInfo={pokemon.damage_relations.all.high_damage_from}
					/>
					<InfoPanel
						title={'Low damage from'}
						chipsInfo={pokemon.damage_relations.all.low_damage_from}
					/>
					<InfoPanel
						title={'High damage to'}
						chipsInfo={pokemon.damage_relations.all.high_damage_to}
					/>
					<InfoPanel
						title={'Low damage to'}
						chipsInfo={pokemon.damage_relations.all.low_damage_to}
					/>
					<InfoPanel
						title={'No damage from'}
						chipsInfo={pokemon.damage_relations.all.no_damage_from}
					/>
				{/await}
			</div>
		{/if}
	</main>

	<Footer handleClick={handleGetPokemon} />
</div>
