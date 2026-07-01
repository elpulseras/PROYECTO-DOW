<script setup lang="ts">
import type { Evento } from '~/types/evento';
const {data: eventos, pending, error, refresh} = await useFetch<Evento[]>('/api/Evento')
</script>
<template>
  <!-- Navbar -->
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

  <!-- Hero -->
  <div class="max-w-5xl mx-auto px-6 py-16">
    <div class="inline-flex items-center gap-2 text-xs font-medium text-brand-red bg-brand-red/10 border border-brand-red/20 rounded-full px-3 py-1 mb-5">
      <i class="ti ti-calendar-event text-sm"></i>
      Plataforma de eventos
    </div>
    <h1 class="text-4xl md:text-5xl font-medium leading-tight text-brand-text mb-3">
      Tu próximo <span class="text-brand-red">evento</span><br />te está esperando
    </h1>
    <p class="text-brand-muted text-base max-w-lg leading-relaxed">
      Eventos estudiantiles y culturales en un solo lugar. Inscríbete en segundos.
    </p>
  </div>

  <hr class="border-brand-border mx-6" />

  <!-- Listado de eventos -->
  <div class="max-w-5xl mx-auto px-6 py-8">
    <div class="flex items-baseline justify-between mb-6">
      <div>
        <h2 class="text-lg font-medium text-brand-text">Eventos disponibles</h2>
        <p class="text-sm text-brand-muted">No te pierdas lo que viene</p>
      </div>
    </div>
 
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <EventoCard v-for="evento in eventos" :key="evento.id" :evento="evento" />
    </div>
  </div>
</template>