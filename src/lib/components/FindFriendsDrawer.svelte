<!-- TODO: Responsive Dialog -->

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, AtSign, MoveLeft } from 'lucide-svelte';
	import colors from 'tailwindcss/colors';
	import { trpc } from '$lib/trpc/client';
	import { debounce } from 'lodash-es';
	import { toast } from 'svelte-sonner';
	import Avatar from '$lib/components/Avatar.svelte';
	import { fly } from 'svelte/transition';

	export let open = true;

	let usersList: {
		id: string;
		username: string;
		name: string;
		image: string;
	}[] = [];
	$: loading = false;
	let inputUsername = '';

	async function searchFriends(username: string) {
		if (!username.trim()) {
			return false;
		}

		const searchResponse = await trpc().user.searchMany.query({
			filters: {
				username
			}
		});

		if (searchResponse.error === true) {
			toast.error(searchResponse.message || 'Something went wrong', {
				duration: 5000,
				description: `CODE: ${searchResponse.code}`
			});
			return false;
		}

		return searchResponse.data || [];
	}

	async function handleSearchInput() {
		if (inputUsername.trim() === '') {
			usersList = [];
			return;
		}

		loading = true;

		const response = await searchFriends(inputUsername);

		loading = false;
		if (response === false) {
			return;
		}

		usersList = response as typeof usersList;
	}

	const debouncedHandleSearchInput = debounce(handleSearchInput, 500);

	// listen for model close
	// NOTE for future (anyone),
	// i didn't use onClose Method on Root because it was getting called before actually closed,
	// which leads to lag of the drawer
	$: if (open === false) {
		inputUsername = '';
		usersList = [];
	}
</script>

{#if open}
	<div
		in:fly|global={{ y: '100%', duration: 400, opacity: 0.8 }}
		out:fly|global={{ y: '100%', duration: 400 }}
		class="absolute left-0 top-0 z-[50] flex h-full w-full flex-col bg-background text-foreground"
	>
		<!-- header -->
		<div class="flex items-center gap-1 bg-black px-3 py-3 text-white">
			<!-- back -->
			<Button on:click={() => (open = false)} class="h-fit w-fit rounded-full p-2" variant="ghost">
				<ArrowLeft size={20} />
			</Button>
			<div class="flex-grow text-xl">Find Pats</div>
		</div>

		<div class="relative flex px-3 py-3">
			<div class="grid w-full items-center gap-1">
				<div class="flex rounded border px-3">
					<div class="flex-center">
						<AtSign class="text-muted-foreground" size={17} />
					</div>
					<input
						bind:value={inputUsername}
						on:input={debouncedHandleSearchInput}
						type="text"
						id="username"
						class="focus-visible:ring-none h-full border-none px-2 py-2 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						placeholder="bob_the_builder"
						autocomplete="off"
						autocorrect="off"
						autosave="off"
					/>
				</div>
			</div>
		</div>

		{#if loading}
			<div class="flex-center w-full flex-col py-2">
				<l-ring size="30" stroke="2" bg-opacity="0" speed="1.5" color={colors.gray[700]}></l-ring>
			</div>
		{:else if usersList.length === 0}
			<div class="py-2 text-center text-muted-foreground">Nothing to see</div>
		{:else}
			<div class="flex w-full flex-col">
				{#each usersList as user}
					<div class="relative flex flex-row gap-3 px-5 py-4">
						<div class="h-fit w-fit">
							<Avatar class="h-12 w-12 rounded-full border border-gray-400" src={user.image} />
						</div>
						<div class="flex min-h-full w-fit flex-col justify-center gap-1">
							<div class="leading-3">
								{user.name}
							</div>
							<div class="w-full text-sm text-muted-foreground">
								@{user.username}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<!-- <Drawer.Root bind:open>
	<Drawer.Content class="h-[50%]">
		<div class="mx-auto flex w-full max-w-md flex-col overflow-auto rounded-t-[10px] pb-64">
			<div class="relative flex px-3">
				<div class="grid w-full items-center gap-1">
					<div class="flex rounded border px-3">
						<div class="flex-center">
							<AtSign class="text-muted-foreground" size={17} />
						</div>
						<input
							bind:value={inputUsername}
							on:input={debouncedHandleSearchInput}
							type="text"
							id="username"
							class="focus-visible:ring-none h-full border-none px-2 py-2 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
							placeholder="bob_the_builder"
							autocomplete="off"
							autocorrect="off"
							autosave="off"
						/>
					</div>
				</div>
			</div>

		</div>
	</Drawer.Content>
</Drawer.Root> -->
