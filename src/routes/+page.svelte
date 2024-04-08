<script>
	import { Button } from "flowbite-svelte";
	import { ArrowRightOutline } from "flowbite-svelte-icons";
	import HeroHeader from "$lib/components/hero/HeroHeader.svelte";
	import Section from "$lib/components/Section.svelte";
	import heroImage from "$lib/assets/lion_search.png";
</script>

<section
	class="grid max-w-screen-xl px-10 sm:px-4 py-8 mx-auto md:px-12 lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
>
	<div class="mr-auto place-self-center lg:col-span-7">
		<HeroHeader
			h1Class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"
			pClass="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
		>
			<svelte:fragment slot="h1"
				>Gain insights on Singapore's Government</svelte:fragment
			>
			<svelte:fragment slot="paragraph"
				>From insights on the annual Budget to Parliamentary discourse,
				GahmenExplorer can help enable civic discourse towards a more
				engaged citizenry.</svelte:fragment
			>
			<a href="/"
				><Button
					size="xl"
					color="red"
					class="inline-flex items-center justify-center mr-3"
					href="/budget/overview"
					>Get started<ArrowRightOutline
						size="md"
						class="ml-2 -mr-1"
					/></Button
				>
			</a>
			<a href="/"
				><Button
					color="light"
					size="xl"
					class="inline-flex items-center justify-center mt-3"
					href="/about">About GahmenExplorer</Button
				>
			</a>
		</HeroHeader>
	</div>
	<div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
		<img src={heroImage} alt="mockup" />
	</div>
</section>
