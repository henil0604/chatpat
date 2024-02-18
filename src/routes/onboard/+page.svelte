<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { debounce } from 'lodash-es';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import AnimatedFloatingBlob from '$lib/components/AnimatedFloatingBlob.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Icons, Pages } from '$lib/const';
	import { fade } from 'svelte/transition';
	import { generateAvatar } from '$lib/utils/avatar';
	import Avatar from '$lib/components/Avatar.svelte';
	import DesktopOnly from '$lib/components/DesktopOnly.svelte';
	import { setGlobalLoading } from '$lib/utils/setGlobalLoading';
	import tippy from 'svelte-tippy';

	let data = $page.data;
	let user = data.session!.user!;

	$: profileData = {
		username: user.email?.split('@')[0] || '',
		imageSeed: user.name!
	};

	let usernameStatus: {
		checking: boolean;
		available: boolean | null;
		error: null | string;
	} = {
		checking: false,
		available: null,
		error: null
	};

	$: isSubmitting = false;

	$: isButtonDisabled =
		usernameStatus.available === false || usernameStatus.checking || isSubmitting;

	async function checkUsernameAvailability() {
		debouncedCheckUsernameAvailability.cancel();
		usernameStatus.checking = true;

		if (profileData.username.trim() === '') {
			usernameStatus.checking = false;
			usernameStatus.available = false;
			usernameStatus.error = 'Username must not be empty';
			return false;
		}

		const response = await trpc().user.isUsernameAvailable.query({
			username: profileData.username
		});

		if (response.error) {
			usernameStatus.available = false;
			usernameStatus.checking = false;
			usernameStatus.error = response.message || 'Something went wrong';
			return false;
		}

		if (response.code === 'DONE' && response.data) {
			usernameStatus.checking = false;
			usernameStatus.available = response.data.isAvailable;
			usernameStatus.error = null;
			return true;
		}
		return false;
	}

	const debouncedCheckUsernameAvailability = debounce(checkUsernameAvailability, 500);

	$: isSubmitting === true
		? setGlobalLoading(true, 'Just a second...', 'mobile')
		: setGlobalLoading(false);

	async function handleSubmit() {
		isSubmitting = true;

		if (!(await checkUsernameAvailability())) {
			return;
		}

		if (profileData.imageSeed.trim() === '') {
			profileData.imageSeed = Math.random().toString();
			return;
		}

		const response = await trpc().user.completeProfile.mutate({
			username: profileData.username,
			image: `dice:${profileData.imageSeed}`
		});

		if (response.error) {
			toast.error(response.message || 'Something went wrong', {
				duration: 5000,
				description: `CODE: ${response.code}`
			});
		}

		if (response.error === false && response.code === 'DONE') {
			goto($page.url.searchParams.get('redirectTo') || Pages.Application.path).then(() => {
				setGlobalLoading(false);
			});
		}

		isSubmitting = false;
	}

	onMount(async () => {
		if (profileData.username.trim() !== '') {
			await checkUsernameAvailability();
		}
	});
</script>

<svelte:head>
	<title>Complete your profile - ChatPat</title>
</svelte:head>

<!-- body wrap -->
<div class="flex-center min-h-screen min-w-full max-md:items-start">
	<!-- card wrap -->
	<div
		class="relative flex min-w-[400px] max-w-[600px] flex-col overflow-hidden rounded-lg border border-gray-300 px-6 py-4 shadow transition hover:shadow-md max-md:min-h-screen max-md:w-full max-md:min-w-[none] max-md:max-w-[none]"
	>
		<!-- top-right -->
		<DesktopOnly>
			<AnimatedFloatingBlob
				noiseStep={0.007}
				class="absolute bottom-[-50px] left-[-40px] z-[2] max-h-[none] min-h-[100px] min-w-[100px] transition-all duration-[700ms] {isSubmitting
					? 'scale-[10] duration-[700ms]'
					: ''}"
			/>
		</DesktopOnly>

		{#if isSubmitting}
			<DesktopOnly>
				<p
					in:fade
					out:fade
					class="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-white"
				>
					Just a second...
				</p>
			</DesktopOnly>
		{/if}

		<!-- bottom-left -->
		<DesktopOnly>
			<AnimatedFloatingBlob
				noiseStep={0.007}
				class="absolute right-[-40px] top-[-50px] z-[2] max-h-[none] min-h-[100px] min-w-[100px] max-w-[none] transition-all duration-[700ms] {isSubmitting
					? 'scale-[10] duration-[700ms]'
					: ''}"
			/>
		</DesktopOnly>

		<!-- header -->
		<h1 class="flex items-center gap-2 text-lg font-bold">
			<Icon width={22} icon={Icons.Info} />
			Complete your profile
		</h1>

		<div class="my-3"></div>

		<!-- image wrap -->
		<div class="flex-center w-full">
			<div class="relative h-28 w-28">
				<Avatar
					class="rounded-full border-2 border-black"
					src={generateAvatar(profileData.imageSeed).toDataUriSync()}
					alt=""
				/>
				<div
					use:tippy={{
						content: 'Randomize'
					}}
					class="absolute bottom-0 right-0 h-fit w-fit"
				>
					<Button
						on:click={() => {
							profileData.imageSeed = Math.random().toString();
						}}
						variant="outline"
						class="h-fit w-fit p-1"
					>
						<Icon width={20} icon={Icons.Dices} />
					</Button>
				</div>
			</div>
		</div>

		<div class="my-3"></div>

		<!-- username wrap -->
		<div class="">
			<div class="grid w-full items-center gap-1">
				<Label for="username">Username</Label>
				<div
					class="flex rounded border px-3"
					class:border-red-600={usernameStatus.available === false && !usernameStatus.checking}
					class:border-green-600={usernameStatus.available === true && !usernameStatus.checking}
				>
					<div class="flex-center">
						<Icon width={17} class="text-muted-foreground" icon={Icons.AtSign} />
					</div>
					<input
						type="text"
						id="username"
						class="px-3 py-2 focus-visible:outline-none"
						bind:value={profileData.username}
						placeholder="bob_the_builder"
						on:input={() => {
							profileData.username = profileData.username.trim();
							debouncedCheckUsernameAvailability();
						}}
						autocomplete="off"
					/>
				</div>
				{#if usernameStatus.checking}
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<Icon class="animate-spin" width={16} icon={Icons.Triangle} />
						<p>Checking availability</p>
					</div>
				{:else if usernameStatus.available === false}
					<div class="flex items-center gap-2 text-sm text-red-700">
						<Icon width={17} icon={Icons.TriangleError} />
						{#if usernameStatus.error !== null}
							<p>{usernameStatus.error}</p>
						{:else}
							<p>Username is not available</p>
						{/if}
					</div>
				{:else if usernameStatus.available === true}
					<div class="flex items-center gap-2 text-sm text-green-700">
						<Icon width={17} icon={Icons.BadgeCheck} />
						<p>Username is available</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="my-3"></div>

		<!-- submit wrap -->
		<div class="flex w-full justify-end">
			<Button bind:disabled={isButtonDisabled} on:click={handleSubmit}>Get Started</Button>
		</div>
	</div>
</div>
