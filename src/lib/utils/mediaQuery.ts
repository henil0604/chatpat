import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export default function mediaQueryObserver(maxWidth: number) {
	const store = writable<boolean | undefined>(undefined);

	if (browser) {
		const x = window.matchMedia(`(max-width: ${maxWidth}px)`);
		store.set(x.matches);

		x.addEventListener('change', (event) => {
			store.set(event.matches);
		});
	}

	return store;
}
