<script>
</script>

<!-- outer wrapper -->
<div class="flex-center flex max-h-screen min-h-screen min-w-full max-w-full">
	<!-- mobile screen wrapper -->
	<div
		class="relative z-[1] h-[90dvh] w-[430px] overflow-hidden rounded border border-gray-400 shadow max-md:min-h-screen max-md:min-w-full max-md:rounded-none max-md:border-none"
	>
		<!-- inside wrapper -->
		<div class="relative h-full min-w-full">
			<!-- page content -->
			<slot />
		</div>
	</div>
</div>
