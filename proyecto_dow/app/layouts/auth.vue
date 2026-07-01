<script setup lang="ts">
const route = useRoute()
const isActive = (to: String) => route.path === to
const { user } = useUserSession()
const navegationLinks = [
    { label: 'Eventos', to: '/eventos'},
    { label: 'Usuarios', to: '/usuarios'}
]
async function logout() {
    await $fetch('/api/auth/logout', {method: 'POST'})
    await navigateTo('/')
}

const userMenuItems= [[
    {
        label: 'Cerrar sesion',
        onSelect: logout
    }
]]
</script>
<template>
    <div class="font-sans bg-brand-bg min-h-screen bg-[radial-gradient(circle_at_top,rgba(230,57,70,0.12),transparent_28%),radial-gradient(circle_at_right_20%,rgba(255,45,85,0.08),transparent_24%),var(--color-brand-bg)] text-brand-text flex flex-col">
         <div class="min-h-screen bg-brand-bg text-brand-text">
        <header class="border-b border-brand-border bg-brand-surface/90 backdrop-blur-sm">
            <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-red-soft">
                            Panel de Administración
                        </p>
                        <p class="text-sm font-bold text-brand-red">
                            <span class="text-brand-text">Smart</span> Events
                        </p>
                    </div>
                </div>
 
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <nav class="flex flex-wrap items-center gap-2">
                        <NuxtLink v-for="link in navegationLinks" :key="link.to" :to="link.to" class="px-2 py-1 rounded-lg text-sm hover:bg-brand-bg" :class="isActive(link.to) ? 'text-brand-red font-semibold' : 'text-brand-muted'">
                            {{ link.label }}
                        </NuxtLink>
                    </nav>
 
                    <div class="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-border bg-brand-bg px-4 py-2">
                        <div class="hidden text-right sm:block">
                            <p class="text-sm font-semibold text-brand-text">
                                {{ user?.nombre }} {{ user?.apellido }}
                            </p>
                        </div>
 
                        <UDropdownMenu :items="userMenuItems" :content="{ align: 'end', sideOffset: 12 }":ui="{ content: 'min-w-48', item: 'cursor-pointer', itemLeadingIcon: 'text-brand-red', itemLabel: 'font-semibold text-brand-text' }">
                            <div class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white transition-transform hover:scale-105" role="button" tabindex="0"aria-label="Abrir menú de usuario">
                                Menu
                            </div>
                        </UDropdownMenu>
                    </div>
                </div>
            </div>
        </header>
        <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <slot />
        </main>
    </div>
      <!-- Footer -->
      <footer class="mt-auto border-t border-brand-border py-8 px-6">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span class="font-bold text-lg">
            <span class="text-brand-red">Smart</span> Events
          </span>
          <p class="text-brand-muted text-sm">© 2026 Smart Events. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
</template> 