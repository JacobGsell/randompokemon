<script>
	import Chip, { Set, Text } from '@smui/chips';
	import { getColorByType } from '../util/util.svelte';

	export let title;
	export let chipsInfo;
</script>

<div class="w-full  h-fit bg-stone-800 flex flex-col justify-between">
	<h2 class="text-center text-white">{title}</h2>

	<div id="content" class="grow mt-2">
		<div class="divide-y divide-solid divide-stone-700">
			<Set
				class="flex justify-center"
				chips={Array.isArray(chipsInfo[0]) ? chipsInfo[0] : chipsInfo}
				let:chip
				nonInteractive
			>
				<Chip style="background-color: {getColorByType(chip)}" class="type-chip" {chip}>
					<Text>{chip}</Text>
				</Chip>
			</Set>
		</div>
	</div>
</div>
