<script>
	import "../app.pcss";
	import { page } from "$app/stores";
	import { fade } from "svelte/transition";
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		DropdownDivider,
	} from "flowbite-svelte";
	import { ChevronDownOutline } from "flowbite-svelte-icons";
	import FluentBuildingGovernmentSearch32Regular from "~icons/fluent/building-government-search-32-regular";
	import { Footer } from "flowbite-svelte";
	$: activeUrl = $page.url.pathname;
	let activeClass =
		"text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent";
	let nonActiveClass =
		"text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
	import Banner from "$lib/components/layout/Banner.svelte";
	import { CloseButton } from "flowbite-svelte";
	export let data;
	export let visible = true;
</script>

<svelte:head>
	<title>GahmenExplorer</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Navbar let:NavContainer color="primary" class="dark:bg-gray-950">
		<NavContainer
			class="px-2 py-2 rounded-lg bg-white dark:bg-gray-950 "
			fluid={false}
		>
			<NavBrand href="/">
				<FluentBuildingGovernmentSearch32Regular class="w-8 h-8 me-3" />
				<span
					class="self-center whitespace-nowrap text-xl font-semibold"
					>GahmenExplorer</span
				>
			</NavBrand>
			<NavHamburger />
			<NavUl {activeUrl} {activeClass} {nonActiveClass}>
				<NavLi href="/">Home</NavLi>
				<NavLi href="/about">About</NavLi>
				<NavLi class="cursor-pointer">
					BudgetGoWhere<ChevronDownOutline
						class="w-3 h-3 ms-2 text-primary-800 dark:text-white inline"
					/>
				</NavLi>
				<Dropdown class="w-60 z-20">
					<DropdownItem href="/budget/overview">Overview</DropdownItem
					>
					<DropdownItem href="/budget/ministry"
						>By Agency</DropdownItem
					>
				</Dropdown>
				<NavLi href="/sgdi">GovDirectoryExplorer</NavLi>
				<NavLi href="/contact">Contact</NavLi>
			</NavUl>
		</NavContainer>
	</Navbar>
	{#if visible}
		<div class="mx-auto container pb-10">
			<Banner>
				<p class="text-sm font-light text-gray-500 dark:text-white">
					<!-- svelte-ignore a11y-missing-attribute -->
					GahmenExplorer is in
					<a
						class="font-medium underline text-primary-600 dark:text-primary-500"
						>active development</a
					> and may not be fully functional.
				</p>
				<CloseButton
					on:click={() => (visible = false)}
					class="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
				/>
			</Banner>
		</div>
	{/if}

	{#key data.pathname}
		<div
			in:fade={{ duration: 300, delay: 400 }}
			out:fade={{ duration: 300 }}
		>
			<slot />
		</div>
	{/key}

	<section class="px-10 sm:px-2 sticky top-[100vh] py-6 sm:py-10">
		<Footer>
			<span
				class="block text-sm text-gray-500 sm:text-center dark:text-gray-400"
			>
				built by bearylogical | {new Date().getFullYear()}
			</span>
		</Footer>
	</section>
</div>
