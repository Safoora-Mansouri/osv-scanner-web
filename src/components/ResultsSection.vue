<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PackageJson } from '../types/packageJson'
import type { PackageVulnerabilityResult } from '../services/osvClient'

const props = defineProps<{
  packageJson: PackageJson | null
  results: PackageVulnerabilityResult[]
}>()

const filter = ref<'all' | 'vulnerable'>('all')

const filteredResults = computed(() => {
  if (filter.value === 'vulnerable') {
    return props.results.filter(r => r.vulnerabilities.length > 0)
  }
  return props.results
})

const totalVulnerable = computed(
  () => props.results.filter(r => r.vulnerabilities.length > 0).length
)
</script>

<template>
  <section v-if="results.length" class="bg-white rounded-lg shadow p-6 mt-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold">Scan Results</h2>
        <p class="text-sm text-gray-600">
          {{ results.length }} packages scanned.
          {{ totalVulnerable }} with known vulnerabilities.
        </p>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <label>
          <input
            type="radio"
            value="all"
            v-model="filter"
          />
          All
        </label>
        <label>
          <input
            type="radio"
            value="vulnerable"
            v-model="filter"
          />
          Vulnerable only
        </label>
      </div>
    </div>

    <table class="w-full text-sm border-collapse">
      <thead>
        <tr class="border-b">
          <th class="text-left py-2">Package</th>
          <th class="text-left py-2">Version</th>
          <th class="text-left py-2">Vulnerabilities</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="result in filteredResults"
          :key="result.packageName"
          :class="[
            'border-b',
            result.vulnerabilities.length
              ? 'bg-red-50'
              : 'bg-green-50'
          ]"
        >
          <td class="py-2 px-1 font-mono">
            {{ result.packageName }}
          </td>
          <td class="py-2 px-1 font-mono">
            {{ result.version }}
          </td>
          <td class="py-2 px-1">
            <span v-if="result.vulnerabilities.length === 0">
              No known vulnerabilities
            </span>
            <span v-else>
              {{ result.vulnerabilities.length }} issue(s)
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <section v-else class="text-sm text-gray-500 mt-4">
    No scan results yet. Upload a package.json file to start.
  </section>
</template>


