<script lang="ts">
	import { page } from '$app/stores';
	import { Dices, Info, Triangle, AlertTriangle, AtSign, BadgeCheck } from 'lucide-svelte';
	import { createAvatar } from '@dicebear/core';
	import { adventurerNeutral } from '@dicebear/collection';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { debounce } from 'lodash-es';

	let data = $page.data;
	let user = data.session!.user!;

	$: profileData = {
		username: user.email?.split('@')[0],
		imageSeed: user.name!
	};

	let usernameStatus: {
		checking: boolean;
		available: boolean | null;
		error: null | string;
	} = {
		checking: false,
		available: true,
		error: null
	};

	function generateAvatar(seed: string) {
		return createAvatar(adventurerNeutral, {
			seed
		});
	}

	function checkUsernameAvailability() {
		debouncedCheckUsernameAvailability.cancel();

		if (profileData.username?.trim() === '') {
			usernameStatus.checking = false;
			usernameStatus.available = false;
			usernameStatus.error = 'Username must not be empty';
			return;
		}
	}

	const debouncedCheckUsernameAvailability = debounce(checkUsernameAvailability, 500);

	$: console.log(profileData);
</script>

<!-- body wrap -->
<div class="flex-center min-h-screen min-w-full max-md:items-start">
	<!-- card wrap -->
	<div
		class="relative flex min-w-[400px] flex-col rounded-lg border border-gray-300 px-8 py-4 shadow transition hover:shadow-md max-md:min-h-screen max-md:w-full max-md:min-w-[none]"
	>
		<!-- header -->
		<h1 class="flex gap-2 text-lg font-bold">
			<Info />
			Complete your profile
		</h1>

		<div class="my-3"></div>

		<!-- image wrap -->
		<div class="flex-center w-full">
			<div class="relative h-28 w-28">
				<img
					class="rounded-full border-2 border-black"
					src={generateAvatar(profileData.imageSeed).toDataUriSync()}
					alt=""
				/>
				<Button
					on:click={() => {
						profileData.imageSeed = Math.random().toString();
					}}
					variant="secondary"
					class="absolute bottom-0 right-0 h-fit p-1"
				>
					<Dices size={20} />
				</Button>
			</div>
		</div>

		<div class="my-3"></div>

		<div class="">
			<div class="grid w-full items-center gap-1">
				<Label for="username">Username</Label>
				<div
					class="flex rounded border px-3"
					class:border-red-600={usernameStatus.available === false && !usernameStatus.checking}
					class:border-green-600={usernameStatus.available === true && !usernameStatus.checking}
				>
					<div class="flex-center">
						<AtSign class="text-muted-foreground" size={17} />
					</div>
					<input
						type="text"
						id="username"
						class="px-3 py-2 focus-visible:outline-none"
						bind:value={profileData.username}
						placeholder="bob_the_builder"
						on:input={debouncedCheckUsernameAvailability}
					/>
				</div>
				{#if usernameStatus.checking}
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<Triangle class="animate-spin" size={15} />
						<p>Checking availability</p>
					</div>
				{:else if usernameStatus.available === false}
					<div class="flex items-center gap-2 text-sm text-red-700">
						<AlertTriangle size={15} />
						{#if usernameStatus.error !== null}
							<p>{usernameStatus.error}</p>
						{:else}
							<p>Username is not available</p>
						{/if}
					</div>
				{:else if usernameStatus.available === true}
					<div class="flex items-center gap-2 text-sm text-green-700">
						<BadgeCheck size={15} />
						<p>Username is available</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
