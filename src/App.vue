<script setup lang="ts">
/**
 * App.vue
 *
 * Root component that wires together:
 * - File upload section
 * - Scan results section
 * - Header and footer
 *
 * All scanning logic is delegated to useOsvScanner so that this
 * component remains focused on composition and layout.
 */

import FileUploadSection from './components/FileUploadSection.vue'
import ResultsSection from './components/ResultsSection.vue'
import Footer from './components/Footer.vue'
import { useOsvScanner } from './composables/useOsvScanner.ts'

// Destructure scanning state and handler from the composable
const {
  packageJson,
  results,
  loading,
  errorMessage,
  handlePackageJsonLoaded
} = useOsvScanner()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-stone-100 text-gray-900">
    <header class="py-6 px-6 bg-stone-100 flex flex-col items-center ">
      <div class="flex items-center">
        <img src="/osv_logo.svg" alt="OSV" class="w-14 h-14 p-1" />
      </div>
    </header>

    <main class="p-6 max-w-4xl mx-auto">
      <FileUploadSection @package-json-loaded="handlePackageJsonLoaded" />

      <div v-if="loading" class="mt-4 text-sm text-gray-600">
        Checking dependencies against OSV...
      </div>

      <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </p>

      <ResultsSection
        :package-json="packageJson"
        :results="results"
      />
    </main>

  
     <Footer />
    </div>
 
</template>
