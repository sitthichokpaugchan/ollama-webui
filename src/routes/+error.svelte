<script>
	import { page } from "$app/stores";
</script>

<div class=" bg-white min-h-screen">
	<div class=" flex h-full">
		<div class="m-auto my-10 text-gray-700 text-3xl font-semibold">
			{$page.status}: {$page.error.message}
		</div>
	</div>
</div>
