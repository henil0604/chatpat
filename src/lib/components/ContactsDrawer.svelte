<!-- TODO: Responsive Dialog -->

<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { AtSign } from 'lucide-svelte';

	export let open = true;
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="min-h-[50%]">
		<!-- wrapper -->
		<div class="flex-center w-full">
			<div class="min-w-6xl flex flex-col py-3 max-md:min-w-full max-md:max-w-none">
				<!-- search bar -->
				<div class="relative flex px-3">
					<div class="grid w-full items-center gap-1">
						<div class="flex rounded border px-3">
							<div class="flex-center">
								<AtSign class="text-muted-foreground" size={17} />
							</div>
							<input
								type="text"
								id="username"
								class="px-3 py-2 focus-visible:outline-none"
								placeholder="bob_the_builder"
								autocomplete="off"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
