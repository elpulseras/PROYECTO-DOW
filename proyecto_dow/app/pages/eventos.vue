<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})
import type { Evento } from '~/types/evento'
import type { Inscrito } from '~/types/inscritos'

const { data: eventos, refresh } = await useFetch<Evento[]>('/api/Evento')

const mostrarFormulario = ref(false)
const errorFormulario = ref('')
const guardandoEvento = ref(false)
const mostrarBorrar = ref(false)
const borrandoEvento = ref(false)
const deleteEvento = ref<Evento | null>(null)

const mostrarInscritos = ref(false)
const eventoSeleccionado = ref<Evento | null>(null)
const inscritos = ref<Inscrito[]>([])
const cargandoInscritos = ref(false)

const borrandoInscrito = ref(false)
const deleteInscrito = ref<Inscrito | null>(null)
const mostrarBorrarInscrito = ref(false)

const formularioEvento = reactive({
    titulo: '',
    fecha: '',
    hora: '',
    lugar: '',
    valor: 0,
})

const archivoImagen = ref<File | null>(null)

function reseteoFormulario() {
    formularioEvento.titulo = ''
    formularioEvento.fecha = ''
    formularioEvento.hora = ''
    formularioEvento.lugar = ''
    formularioEvento.valor = 0
    archivoImagen.value = null
    errorFormulario.value = ''
}

function cerrarFormulario() {
    mostrarFormulario.value = false
    reseteoFormulario()
}

async function guardarEventoNuevo() {
    guardandoEvento.value = true
    try {
        const formData = new FormData()
        formData.append('titulo', formularioEvento.titulo)
        formData.append('fecha', formularioEvento.fecha)
        formData.append('hora', formularioEvento.hora)
        formData.append('lugar', formularioEvento.lugar)
        formData.append('valor', String(formularioEvento.valor))
        if (archivoImagen.value) {
            formData.append('imagen', archivoImagen.value)
        }
        await $fetch('/api/Evento', {
            method: 'POST',
            body: formData
        })
        cerrarFormulario()
        await refresh()
    } catch (err: any) {
        errorFormulario.value = getApiErrorMessage(err, 'No se pudo guardar el evento')
    } finally {
        guardandoEvento.value = false
    }
}

function confirmarBorrar(evento: Evento) {
    deleteEvento.value = evento
    mostrarBorrar.value = true
}

function cerrarConfirFormulario() {
    mostrarBorrar.value = false
    deleteEvento.value = null
}

async function borrarEvento() {
    borrandoEvento.value = true
    try {
        await $fetch(`/api/Evento/${deleteEvento.value?.id}`, {
            method: 'DELETE'
        })
        cerrarConfirFormulario()
        await refresh()
    } catch (err: any) {
    } finally {
        borrandoEvento.value = false
    }
}

async function verInscritos(evento: Evento) {
    eventoSeleccionado.value = evento
    mostrarInscritos.value = true
    cargandoInscritos.value = true
    try {
        const resultado = await $fetch<any>(`/api/Evento/${evento.id}`)
        inscritos.value = resultado.inscritos
    } catch (err: any) {
    } finally {
        cargandoInscritos.value = false
    }
}

function confirmarBorrarInscrito(inscrito: Inscrito) {
    deleteInscrito.value = inscrito
    mostrarBorrarInscrito.value = true
}

async function borrarInscrito() {
    borrandoInscrito.value = true
    try {
        await $fetch(`/api/Inscrito/${deleteInscrito.value?.id}`, {
            method: 'DELETE'
        })
        mostrarBorrarInscrito.value = false
        deleteInscrito.value = null
        borrandoInscrito.value = false
        if (eventoSeleccionado.value) {
            const resultado = await $fetch<any>(`/api/Evento/${eventoSeleccionado.value.id}`)
            inscritos.value = resultado.inscritos
        }
        await refresh()
    } catch (err: any) {
        borrandoInscrito.value = false
    }
}
</script>
<template>
    <div class="space-y-8">
        <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-brand-red sm:text-4xl">
                    Eventos
                </h1>
                <p class="mt-3 max-w-2xl text-base leading-7 text-brand-muted">
                    Visualice y administre los eventos de la plataforma.
                </p>
            </div>
            <UButton @click="mostrarFormulario = true" class="bg-brand-red text-white hover:bg-brand-red/80">
                Agregar Evento
            </UButton>
        </section>

        <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="evento in eventos" :key="evento.id" :evento="evento"
                class="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
                <img :src="`/uploads/${evento.imagen}`" :alt="evento.titulo" class="w-full h-36 object-cover" />
                <div class="p-4">
                    <p class="font-medium text-brand-text">{{ evento.titulo }}</p>
                    <p class="text-sm text-brand-muted">{{ evento.lugar }}</p>
                    <p class="text-sm text-brand-muted">{{ formatFechaCorta(evento.fecha) }} {{ formatHora(evento.fecha) }}</p>
                    <p class="text-sm text-brand-muted">{{ evento.valor }} CLP</p>
                    <div class="flex justify-end gap-2 mt-3">
                        <UButton color="neutral" variant="subtle" @click="verInscritos(evento)">
                            Ver inscritos
                        </UButton>
                        <UButton color="neutral" variant="subtle" @click="confirmarBorrar(evento)">
                            Borrar
                        </UButton>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <UModal v-model:open="mostrarFormulario">
        <template #content>
            <div class="p-6 bg-brand-surface">
                <h2 class="text-lg font-medium text-brand-text mb-1">Agregar Evento</h2>
                <p class="text-sm text-brand-muted mb-4">Completa los datos para crear un nuevo evento.</p>
                <form class="space-y-4" @submit.prevent="guardarEventoNuevo">
                    <UFormField label="Título" name="titulo">
                        <UInput v-model="formularioEvento.titulo" class="w-full" placeholder="Ej: Concierto de Jazz" />
                    </UFormField>
                    <UFormField label="Fecha" name="fecha">
                        <UInput v-model="formularioEvento.fecha" class="w-full" type="date" />
                    </UFormField>
                    <UFormField label="Hora" name="hora">
                        <UInput v-model="formularioEvento.hora" class="w-full" type="time" />
                    </UFormField>
                    <UFormField label="Lugar" name="lugar">
                        <UInput v-model="formularioEvento.lugar" class="w-full" placeholder="Ej: Auditorio Principal" />
                    </UFormField>
                    <UFormField label="Valor" name="valor">
                        <UInput v-model="formularioEvento.valor" class="w-full" type="number" placeholder="0" />
                    </UFormField>
                    <UFormField label="Imagen" name="imagen">
                        <UFileUpload v-model="archivoImagen" class="w-96 min-h-48"/>
                    </UFormField>
                    <UAlert v-if="errorFormulario" color="error" variant="soft" :title="errorFormulario" />
                    <div class="flex justify-end gap-3 pt-2">
                        <UButton type="button" color="neutral" variant="subtle" @click="cerrarFormulario">
                            Cancelar
                        </UButton>
                        <UButton type="submit" :loading="guardandoEvento" class="bg-brand-red text-white hover:bg-brand-red/80">
                            Agregar Evento
                        </UButton>
                    </div>
                </form>
            </div>
        </template>
    </UModal>

    <UModal v-model:open="mostrarBorrar">
        <template #content>
            <div class="p-6 bg-brand-surface">
                <h2 class="text-lg font-medium text-brand-text mb-1">Borrar Evento</h2>
                <p class="text-sm text-brand-muted mb-4">
                    {{ deleteEvento ? `¿Estás seguro que deseas borrar "${deleteEvento.titulo}"?` : '' }}
                </p>
                <div class="flex justify-end gap-3 pt-2">
                    <UButton type="button" color="neutral" variant="subtle" @click="cerrarConfirFormulario">
                        Cancelar
                    </UButton>
                    <UButton type="button" :loading="borrandoEvento" class="bg-brand-red text-white hover:bg-brand-red/80" @click="borrarEvento">
                        Borrar Evento
                    </UButton>
                </div>
            </div>
        </template>
    </UModal>

    <UModal v-model:open="mostrarInscritos">
        <template #content>
            <div class="p-6 bg-brand-surface">
                <h2 class="text-lg font-medium text-brand-text mb-1">
                    Inscritos en {{ eventoSeleccionado?.titulo }}
                </h2>
                <div v-if="cargandoInscritos" class="text-brand-muted text-sm">Cargando...</div>
                <div v-else-if="inscritos.length === 0" class="text-brand-muted text-sm">
                    No hay personas inscritas en este evento.
                </div>
                <div v-else class="space-y-3 mt-4">
                    <div v-for="inscrito in inscritos" :key="inscrito.id"
                        class="flex items-center justify-between border border-brand-border rounded-xl p-3">
                        <div>
                            <p class="text-sm font-medium text-brand-text">{{ inscrito.nombre }} {{ inscrito.apellido }}</p>
                            <p class="text-xs text-brand-muted">{{ inscrito.email }}</p>
                        </div>
                        <UButton color="neutral" variant="subtle" size="sm" @click="confirmarBorrarInscrito(inscrito)">
                            Borrar
                        </UButton>
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <UButton color="neutral" variant="subtle" @click="mostrarInscritos = false">
                        Cerrar
                    </UButton>
                </div>
            </div>
        </template>
    </UModal>

    <UModal v-model:open="mostrarBorrarInscrito">
        <template #body>
            <div class="p-6 bg-brand-surface">
                <h2 class="text-lg font-medium text-brand-text mb-1">Borrar inscripción</h2>
                <p class="text-sm text-brand-muted mb-4">
                    {{ deleteInscrito ? `¿Estás seguro que deseas borrar la inscripción de ${deleteInscrito.nombre} ${deleteInscrito.apellido}?` : '' }}
                </p>
                <div class="flex justify-end gap-3 pt-2">
                    <UButton type="button" color="neutral" variant="subtle" @click="mostrarBorrarInscrito = false">
                        Cancelar
                    </UButton>
                    <UButton type="button" :loading="borrandoInscrito" class="bg-brand-red text-white hover:bg-brand-red/80" @click="borrarInscrito">
                        Borrar inscripción
                    </UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>