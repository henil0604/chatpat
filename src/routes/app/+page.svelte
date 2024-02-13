<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { PageData } from './$types';
	import { Plus } from 'lucide-svelte';
	import Header from './Header.svelte';
	import FindFriendsDrawer from '$lib/components/FindFriendsDrawer.svelte';
	import { isFindFriendsDrawerOpen } from '$lib/store/app';
	import { Drawer } from 'vaul-svelte';

	export let data: PageData;
</script>

<!-- <FindFriendsDrawer bind:open={$isFindFriendsDrawerOpen} /> -->

<Drawer.Root bind:open={$isFindFriendsDrawerOpen}>
	<Drawer.Portal class="z-[1000]">
		<Drawer.Overlay class="fixed inset-0 bg-black/40" />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 flex max-h-[50%] flex-col rounded-t-[10px] bg-white"
		>
			<div class="mx-auto flex w-full max-w-md flex-col overflow-auto rounded-t-[10px] p-4">
				<input class="my-8 border border-gray-400" placeholder="Input" />
				<p>
					But I must explain to you how all this mistaken idea of denouncing pleasure and praising
					pain was born and I will give you a complete account of the system, and expound the actual
					teachings of the great explorer of the truth, the master-builder of human happiness. No
					one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because
					those who do not know how to pursue pleasure rationally encounter consequences that are
					extremely painful. Nor again is there anyone who loves or pursues or desires to obtain
					pain of itself, because it is pain, but because occasionally circumstances occur in which
					toil and pain can procure him some great pleasure. To take a trivial example, which of us
					ever undertakes laborious physical exercise, except to obtain some advantage from it? But
					who has any right to find fault with a man who chooses to enjoy a pleasure that has no
					annoying consequences, or one who avoids a pain that produces no resultant pleasure?
				</p>
				<input class="my-8 border border-gray-400" placeholder="Input" />
				<p>
					On the other hand, we denounce with righteous indignation and dislike men who are so
					beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire,
					that they cannot foresee the pain and trouble that are bound to ensue; and equal blame
					belongs to those who fail in their duty through weakness of will, which is the same as
					saying through shrinking from toil and pain. These cases are perfectly simple and easy to
					distinguish. In a free hour, when our power of choice is untrammelled and when nothing
					prevents our being able to do what we like best, every pleasure is to be welcomed and
					every pain avoided. But in certain circumstances and owing to the claims of duty or the
					obligations of business it will frequently occur that pleasures have to be repudiated and
					annoyances accepted. The wise man therefore always holds in these matters to this
					principle of selection: he rejects pleasures to secure other greater pleasures, or else he
					endures pains to avoid worse pains.
				</p>
				<input class="my-8 border border-gray-400" placeholder="Input" />
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

<div class="relative flex h-full min-w-full flex-col">
	<!-- top bar -->
	<Header />
	<div class="fancy-scrollbar min-w-full flex-grow overflow-y-auto">
		{#if data.friends.length === 0}
			<div class="flex-center h-full w-full flex-col gap-2 py-5">
				<div class="text-muted-foreground">You have no Pats</div>
				<div>
					<Button size="sm" class="gap-1" on:click={() => ($isFindFriendsDrawerOpen = true)}
						><Plus /> Add</Button
					>
				</div>
			</div>
		{:else}
			{#each Array(20) as _, i}
				<div class="flex flex-row gap-3 border-t px-5 py-4">
					<div>
						<Skeleton class="h-10 w-10 rounded-full bg-gray-300" />
					</div>
					<div class="flex w-full flex-col gap-1">
						<div>
							<Skeleton class="h-[20px] w-[100px] bg-gray-300" />
						</div>
						<div class="w-full">
							<Skeleton class="h-[16px] w-[90%] bg-gray-300" />
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
