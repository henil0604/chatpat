<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { Icons } from '$lib/const';

	const paths = [
		{
			href: '/app',
			name: 'Chats',
			icon: Icons.MessageCircle
		},
		{
			href: '/app/friends',
			name: 'Friends',
			icon: Icons.Friends
		}
	];
</script>

<div class="sticky bottom-0 left-0 min-w-full bg-black py-3 text-white">
	<div class="[&>a]:flex-center flex w-full justify-between [&>a]:flex-grow">
		{#each paths as path}
			{@const isActive = $page.url.pathname === path.href}
			<a href={path.href} class="relative {isActive ? '[&>svg]:fill-white' : ''}">
				<div
					class="absolute left-1/2 top-full h-10 w-10 -translate-x-1/2 rounded-full bg-white blur-lg"
					class:hidden={!isActive}
				></div>

				<Icon icon={path.icon} />
			</a>
		{/each}
	</div>
</div>
