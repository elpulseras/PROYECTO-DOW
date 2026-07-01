<script setup lang="ts">
import type { Evento } from '~/types/evento';

const props = defineProps<{
    evento: Evento
}>()

const fechaFormateada = computed(() => formatFechaCorta(props.evento.fecha))
const horaformateada = computed(() => formatHora(props.evento.fecha))

const mostrarFormulario = ref(false)
const inscribiendo = ref(false)
const errorFormulario = ref('')
const inscritoExitoso = ref(false)

const formularioInscrito = reactive({
    email: '',
    nombre: '',
    apellido: ''
})

function reseteoFormulario() {
    formularioInscrito.email = ''
    formularioInscrito.nombre = ''
    formularioInscrito.apellido = ''
    errorFormulario.value = ''
    inscritoExitoso.value = false
}

function cerrarFormulario() {
    mostrarFormulario.value = false
    reseteoFormulario()
}

async function inscribirse() {
    inscribiendo.value = true
    errorFormulario.value = ''
    try {
        await $fetch('/api/Inscrito', {
            method: 'POST',
            body: {
                email: formularioInscrito.email,
                nombre: formularioInscrito.nombre,
                apellido: formularioInscrito.apellido,
                eventoId: props.evento.id
            }
        })
        inscritoExitoso.value = true
    } catch (err: any) {
        errorFormulario.value = getApiErrorMessage(err, 'No se pudo completar la inscripción.')
    } finally {
        inscribiendo.value = false
    }
}
</script>

<template>
  <div class="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden hover:border-brand-red transition-colors group">
    
    <img :src="`/uploads/${evento.imagen}`" :alt="evento.titulo" class="w-full h-40 object-cover"/>
    <div class="p-5">
      <h3 class="text-brand-text font-bold text-lg mb-4 group-hover:text-brand-red transition-colors">
        {{ evento.titulo }}
      </h3>

      <div class="flex flex-col gap-2 text-sm">
        <div class="flex items-center justify-between text-brand-muted">
          <span class="font-medium text-brand-text/70">Fecha</span>
          <span>{{ fechaFormateada }} {{ horaformateada }}</span>
        </div>
        <div class="flex items-center justify-between text-brand-muted">
          <span class="font-medium text-brand-text/70">Lugar</span>
          <span>{{ evento.lugar }}</span>
        </div>
        <div class="flex items-center justify-between text-brand-muted">
          <span class="font-medium text-brand-text/70">Valor</span>
          <span>{{ evento.valor }}</span>
        </div>
        <div class="flex items-center justify-between border-t border-brand-border pt-2 mt-1">
          <span class="font-medium text-brand-text/70 text-sm">Inscritos</span>
          <span class="text-brand-red-soft font-semibold">{{ evento._count.inscritos ?? 0 }}</span>
        </div>
      </div>

      <button 
        @click="mostrarFormulario = true"
        class="mt-4 w-full bg-brand-red text-white py-2 rounded-xl font-semibold hover:bg-brand-red/80 transition-colors text-sm">
        Inscribirse
      </button>
    </div>
  </div>

  <UModal v-model:open="mostrarFormulario">
    <template #content>
      <div class="p-6 bg-brand-surface">

        <div v-if="inscritoExitoso" class="text-center space-y-4">
          <p class="text-2xl">✅</p>
          <h2 class="text-lg font-medium text-brand-text">¡Inscripción exitosa!</h2>
          <p class="text-sm text-brand-muted">Te has inscrito correctamente en <strong>{{ evento.titulo }}</strong>.</p>
          <UButton class="bg-brand-red text-white hover:bg-brand-red/80" @click="cerrarFormulario">
            Cerrar
          </UButton>
        </div>

        <div v-else>
          <h2 class="text-lg font-medium text-brand-text mb-1">Inscribirse en {{ evento.titulo }}</h2>
          <p class="text-sm text-brand-muted mb-4">Ingresa tus datos para reservar tu lugar.</p>

          <form class="space-y-4" @submit.prevent="inscribirse">
            <UFormField label="Email" name="email">
              <UInput v-model="formularioInscrito.email" class="w-full" placeholder="tucorreo@email.com" type="email" />
            </UFormField>

            <UFormField label="Nombre" name="nombre">
              <UInput v-model="formularioInscrito.nombre" class="w-full" placeholder="Ej: Carlos" />
            </UFormField>

            <UFormField label="Apellido" name="apellido">
              <UInput v-model="formularioInscrito.apellido" class="w-full" placeholder="Ej: González" />
            </UFormField>

            <UAlert v-if="errorFormulario" color="error" variant="soft" :title="errorFormulario" />

            <div class="flex justify-end gap-3 pt-2">
              <UButton type="button" color="neutral" variant="subtle" @click="cerrarFormulario">
                Cancelar
              </UButton>
              <UButton type="submit" :loading="inscribiendo" class="bg-brand-red text-white hover:bg-brand-red/80">
                Confirmar inscripción
              </UButton>
            </div>
          </form>
        </div>

      </div>
    </template>
  </UModal>
</template>