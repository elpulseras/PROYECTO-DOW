<script setup lang="ts">
import type { Inscrito } from '~/types/inscritos'

const email = ref('')
const buscando = ref(false)
const errorBusqueda = ref('')
const inscripciones = ref<Inscrito[]>([])
const buscado = ref(false)

async function buscarInscripciones() {
    if (!email.value.trim()) {
        errorBusqueda.value = 'Debes ingresar un email.'
        return
    }
    buscando.value = true
    errorBusqueda.value = ''
    buscado.value = false
    try {
        const resultado = await $fetch<Inscrito[]>(`/api/Inscrito/byEmail/${email.value.trim()}`)
        inscripciones.value = resultado
        buscado.value = true
    } catch (err: any) {
        errorBusqueda.value = getApiErrorMessage(err, 'No se pudo realizar la búsqueda.')
    } finally {
        buscando.value = false
    }
}
</script>

<template>
    <div class="bg-brand-bg min-h-screen text-brand-text">

        <nav class="bg-brand-surface border-b border-brand-border sticky top-0 z-50">
            <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <NuxtLink to="/" class="flex items-center gap-2 font-medium text-lg text-brand-text">
                    <span class="w-2.5 h-2.5 rounded-full bg-brand-red inline-block"></span>
                    Smart Events
                </NuxtLink>
                <div class="flex items-center gap-4">
                    <NuxtLink to="/inscritos" class="text-sm text-brand-muted hover:text-brand-text transition-colors font-medium">
                        Mis inscripciones
                    </NuxtLink>
                    <NuxtLink to="/login" class="text-sm bg-brand-red text-white px-4 py-1.5 rounded-lg font-medium hover:bg-brand-red/80 transition-colors">
                        Acceso Staff
                    </NuxtLink>
                </div>
            </div>
        </nav>

        <div class="max-w-3xl mx-auto px-6 py-12 space-y-8">
            <div>
                <h1 class="text-3xl font-bold text-brand-text">Mis inscripciones</h1>
                <p class="text-brand-muted mt-2">Ingresa tu email para ver los eventos en que estás inscrito.</p>
            </div>

            <div class="flex gap-3">
                <UInput v-model="email" placeholder="tucorreo@email.com" type="email" class="flex-1" @keyup.enter="buscarInscripciones"/>
                <UButton :loading="buscando" class="bg-brand-red text-white hover:bg-brand-red/80" @click="buscarInscripciones">
                    Buscar
                </UButton>
            </div>

            <UAlert v-if="errorBusqueda" color="error" variant="soft" :title="errorBusqueda" />

            <div v-if="buscado">
                <div v-if="inscripciones.length === 0" class="text-brand-muted text-sm">
                    No se encontraron inscripciones para ese email.
                </div>
                <div v-else class="grid gap-4">
                    <div v-for="inscripcion in inscripciones" :key="inscripcion.id" class="bg-brand-surface border border-brand-border rounded-2xl p-5">
                        <p class="font-semibold text-brand-text text-lg">{{ inscripcion.evento.titulo }}</p>
                        <p class="text-sm text-brand-muted mt-1">{{ inscripcion.evento.lugar }}</p>
                        <p class="text-sm text-brand-muted">{{ formatFechaCorta(inscripcion.evento.fecha) }} {{ formatHora(inscripcion.evento.fecha) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>