<script>
	import Card, { Content, Media, MediaContent } from '@smui/card';
	import Chip, { Set, Text } from '@smui/chips';
	import CircularProgress from '@smui/circular-progress';

	export let name = '';
	export let id = 0;
	export let flavor_text = '';
	export let url = 'ul';
	export let types = [''];

	let hansi = 31;

	function getColorByType(type) {
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
				return '#99ff88';
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
</script>

<div class="card-container md:h-full md:w-96">
	<Card>
		<div class="bg-stone-800" Style="padding: 1rem;">
			<h2 class="mdc-typography--headline6 uppercase  text-white" style="margin: 0;">
				{name}
			</h2>
			<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
				{id}
			</h3>
		</div>
		<Media class="card-media-16x9" aspectRatio="16x9">
			<MediaContent class=" flex justify-center bg-gradient-to-r from-fuchsia-900 to-stone-400">
				{#if url === ''}
					<CircularProgress class="w-20" indeterminate />
				{:else}
					<img src={url} alt="pokemon" />
				{/if}
			</MediaContent>
		</Media>
		<Content class="bg-stone-800">
			<Set class="p-0" chips={types} let:chip nonInteractive>
				<Chip style="background-color: {getColorByType(chip)}" class="type-chip" {chip}>
					<Text>{chip}</Text>
				</Chip>
			</Set>
			<h4 class="text-white">
				{flavor_text}
			</h4>
		</Content>
	</Card>
</div>
