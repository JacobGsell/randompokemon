<script context="module">
	const MAX_POKEMON_ID = 906;
	const MIN_POKEMON_ID = 1;

	export function getColorByType(type) {
		switch (type) {
			case 'fire':
				return '#ff8e8e';
			case 'normal':
				return '#e0e0e0';
			case 'fighting':
				return '#ffa48e';
			case 'flying':
				return '#8ec2ff';
			case 'poison':
				return '#ce8eff';
			case 'ground':
				return '#ba8773';
			case 'rock':
				return '#929292';
			case 'bug':
				return '#e0e99f';
			case 'ghost':
				return '#d9c6dc';
			case 'steel':
				return '#a8b8cf';
			case 'water':
				return '#8e96ff';
			case 'grass':
				return '#a6f4a5';
			case 'electric':
				return '#fdffa0';
			case 'psychic':
				return '#e58bff';
			case 'ice':
				return '#e074e9';
			case 'dragon':
				return '#fd6b6b';
			case 'dark':
				return '#b9b6dc';
			case 'fairy':
				return '#ffd2f0';
		}
	}
	export async function getRandomPokemonId() {
		const randomNumber = Math.floor(Math.random() * MAX_POKEMON_ID) + MIN_POKEMON_ID;
		const res = await getDataFor(randomNumber);

		return res;
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
	async function getDataFor(id) {
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
</script>
