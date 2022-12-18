<script>
	import BottomAppBar, { Section } from '@smui-extra/bottom-app-bar';
	import { onMount } from 'svelte';
	import PokeCard from '../pokemon/card/pokeCard.svelte';
	import InfoPanel from '../pokemon/info/InfoPanel.svelte';
	import Switch from '@smui/switch';

	let checked = true;
	let bottomAppBar;

	const MAX_POKEMON_ID = 906;
	const MIN_POKEMON_ID = 1;

	onMount(async () => {
		window.addEventListener('keydown', function (e) {
			if (e.key == ' ' || e.code == 'Space' || (e.keyCode == 32 && e.target == document.body)) {
				e.preventDefault();
				handleClick();
			}
		});
	});

	async function getRandomPokemon() {
		const randomNumber = Math.floor(Math.random() * MAX_POKEMON_ID) + MIN_POKEMON_ID;
		const res = await getDataFor(randomNumber);

		return res;
	}

	async function getDataFor(id) {
		// id = 338;
		const randomNumber = Math.floor(Math.random() * MAX_POKEMON_ID) + MIN_POKEMON_ID;

		// Flavor Text
		const res_flavor_text = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
		const text_flavor_text = await res_flavor_text.text();
		const json_flavor_text = JSON.parse(text_flavor_text);
		const flavor_text = json_flavor_text.flavor_text_entries.filter(
			(entry) => entry.language.name === 'en'
		)[0].flavor_text;

		// Pokemon
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
		const text = await res.text();
		let json = JSON.parse(text);
		json.flavor_text = flavor_text.replace(/\\[a-z]/i, '');
		json._types = json.types;
		json.types = json.types.map((entry) => entry.type.name);

		json.url = json.sprites.other['official-artwork'].front_default;

		json.damage_relations = await getAdvantageRelations(json);

		// Type disadvantage
		if (res.ok) {
			return json;
		} else {
			throw new Error(text);
		}
	}

	async function getAdvantageRelations(json) {
		let damage_relations = {
			all: {
				high_damage_from: [],
				high_damage_to: [],
				low_damage_from: [],
				low_damage_to: [],
				no_damage_from: []
			},
			by_type: []
		};

		for (const type of json.types) {
			// Type advantage
			const res_advantage = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
			const text_advantage = await res_advantage.text();
			const json_advantage = JSON.parse(text_advantage);

			let high_damage_from = json_advantage.damage_relations.double_damage_from.map((d) => d.name);
			let high_damage_to = json_advantage.damage_relations.double_damage_to.map((d) => d.name);
			let low_damage_from = json_advantage.damage_relations.half_damage_from.map((d) => d.name);
			let low_damage_to = json_advantage.damage_relations.half_damage_to.map((d) => d.name);
			let no_damage_from = json_advantage.damage_relations.no_damage_from.map((d) => d.name);

			const damage_relation = {
				high_damage_from: high_damage_from,
				high_damage_to: high_damage_to,
				low_damage_from: low_damage_from,
				low_damage_to: low_damage_to,
				now_damage_from: no_damage_from
			};
			damage_relations.all.high_damage_from.push(high_damage_from);
			damage_relations.all.high_damage_to.push(high_damage_to);
			damage_relations.all.low_damage_from.push(low_damage_from);
			damage_relations.all.low_damage_to.push(low_damage_to);
			damage_relations.all.no_damage_from.push(no_damage_from);

			damage_relations.by_type[type] = damage_relation;
		}

		damage_relations.all.high_damage_from = mergeArrays(damage_relations.all.high_damage_from);
		damage_relations.all.high_damage_to = mergeArrays(damage_relations.all.high_damage_to);
		damage_relations.all.low_damage_from = mergeArrays(damage_relations.all.low_damage_from);
		damage_relations.all.low_damage_to = mergeArrays(damage_relations.all.low_damage_to);
		damage_relations.all.no_damage_from = mergeArrays(damage_relations.all.no_damage_from);

		let evil_list_from = damage_relations.all.high_damage_from.filter(
			(type) => damage_relations.all.low_damage_from.indexOf(type) !== -1
		);
		damage_relations.all.high_damage_from = damage_relations.all.high_damage_from.filter(
			(type) => evil_list_from.indexOf(type) === -1
		);
		damage_relations.all.low_damage_from = damage_relations.all.low_damage_from.filter(
			(type) => evil_list_from.indexOf(type) === -1
		);

		return damage_relations;
	}

	function mergeArrays(parentArray) {
		if (parentArray.length <= 1) return parentArray;
		let array1 = parentArray[0];
		let array2 = parentArray[1];

		let array3 = array1.concat(array2);
		array3 = array3.filter((item, index) => {
			return array3.indexOf(item) === index;
		});
		return array3;
	}

	let promise = getRandomPokemon();

	function handleClick() {
		promise = getRandomPokemon();
	}
</script>

<div class="h-screen  w-full bg-stone-900 flex flex-col justify-between">
	<header class="w-full h-auto, flex justify-center flex-wrap">
		<h1 class="animate-bounce text-xl text-white mt-2">Random Pokemon {@html ':)'}</h1>
		<div class="w-full flex justify-center">
			<div class="inline-block align-text-bottom">
				<Switch bind:checked />
				<span class=" h-fit text-white">Display type relations</span>
			</div>
		</div>
	</header>

	<main class="md:w-full h-auto flex mb-10 min-w-fit flex-col md:flex-row justify-center gap-4">
		{#await promise}
			<PokeCard name={'...'} id={0} flavor_text={'...'} url={''} types={['normal']} />
		{:then pokemon}
			<PokeCard {...pokemon} />
		{/await}

		{#if checked}
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
</div>
