<template>
    <div class="font-sans bg-brand-bg min-h-screen bg-[radial-gradient(circle_at_top,rgba(230,57,70,0.12),transparent_28%),radial-gradient(circle_at_right_20%,rgba(255,45,85,0.08),transparent_24%),var(--color-brand-bg)] text-brand-text flex flex-col">
      <main>
        <slot/>
      </main>

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