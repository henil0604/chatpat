<script lang="ts">
	import { cn } from '$lib/utils';
	import { generateAvatar, resolveURL } from '$lib/utils/avatar';

	export let src: string | null | undefined;
	let className = '';
	export { className as class };
	export let alt = '';
</script>

<img class={cn('', className)} {alt} src={resolveURL(src || '')} />
