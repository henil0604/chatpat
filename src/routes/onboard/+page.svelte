<script lang="ts">
	import { page } from '$app/stores';
	import { Dices, Info } from 'lucide-svelte';
	import { createAvatar } from '@dicebear/core';
	import { adventurerNeutral } from '@dicebear/collection';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { debounce } from 'lodash-es';

	let data = $page.data;
	let user = data.session!.user!;

	$: profileData = {
		username: user.email?.split('@')[0],
		imageSeed: user.name!
	};

	function generateAvatar(seed: string) {
		return createAvatar(adventurerNeutral, {
			seed
		});
	}

	function checkUsernameAvailability() {
		debouncedCheckUsernameAvailability.cancel();

		if (profileData.username?.trim() === '') {
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
		class="relative flex min-w-[400px] flex-col rounded-lg border px-8 py-4 shadow transition hover:shadow-md max-md:min-h-screen max-md:w-full max-md:min-w-[none]"
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
				<Input
					type="text"
					id="username"
					bind:value={profileData.username}
					placeholder="bob_the_builder"
					on:input={debouncedCheckUsernameAvailability}
				/>
			</div>
		</div>
	</div>
</div>
