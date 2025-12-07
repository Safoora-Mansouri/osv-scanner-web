<script setup lang="ts">
/*
 * ResultsSection.vue
 *
 * This component renders:
 * - A summary of the scan (total scanned, total vulnerable)
 * - Filter controls (all vs vulnerable only)
 * - A color-coded table of scan results
 *
 * The filtering logic itself is delegated to useVulnerabilityFilter
 * so that this component stays focused on presentation.
 */

import { toRef } from 'vue'
import type { PackageJson } from '../types/packageJson'
import type { PackageVulnerabilityResult } from '../services/osvClient'
import { useVulnerabilityFilter } from '../composables/useVulnerabilityFilter'

/**
 * Props:
 * - packageJson: full parsed package.json (may be null before upload)
 * - results: array of scan results for each dependency
 */
const props = defineProps<{
  packageJson: PackageJson | null
  results: PackageVulnerabilityResult[]
}>()

// Expose results as a Ref so it can be consumed by the composable
const resultsRef = toRef(props, 'results')

/**
 * useVulnerabilityFilter:
 * - filter: 'all' | 'vulnerable'
 * - filteredResults: computed list according to filter
 * - totalVulnerable: count of vulnerable packages
 */
const {
  filter,
  filteredResults,
  totalVulnerable
} = useVulnerabilityFilter(resultsRef)
</script>

<template>
  <!-- If scan results exist, display the results table -->
  <section v-if="results.length" class="bg-stone-100 rounded-lg shadow p-6 mt-4">

    <!-- Header section with title + summary + filter controls -->
    <div class="flex items-center justify-between mb-4">

      <!-- Scan summary -->
      <div>
        <h2 class="text-lg font-semibold">Scan Results</h2>
        <p class="text-sm text-gray-600">
          {{ results.length }} packages scanned.
          {{ totalVulnerable }} with known vulnerabilities.
        </p>
      </div>

      <!-- Radio buttons to switch between "All" and "Vulnerable only" -->
      <div class="flex items-center gap-2 text-sm">
        <label>
          <input
            type="radio"
            value="all"
            v-model="filter"
            class="h-4 w-4 accent-emerald-700"
          />
          All
        </label>

        <label>
          <input
            type="radio"
            value="vulnerable"
            v-model="filter"
            class="h-4 w-4 accent-emerald-700"
          />
          Vulnerable
        </label>
      </div>
    </div>

    <!-- Results Table -->
    <table class="w-full text-sm border-collapse">
      <thead>
        <tr class="border-b">
          <th class="text-left py-2">Package</th>
          <th class="text-left py-2">Version</th>
          <th class="text-left py-2">Vulnerabilities</th>
        </tr>
      </thead>

      <tbody>
        <!-- Loop through filtered results -->
        <tr
          v-for="result in filteredResults"
          :key="result.packageName"
          :class="[
            'border-b',
            // Red background if vulnerable, green if clean
            result.vulnerabilities.length ? 'bg-red-50' : 'bg-green-50'
          ]"
        >
          <!-- Package name -->
          <td class="py-2 px-1 font-mono">
            {{ result.packageName }}
          </td>

          <!-- Installed version -->
          <td class="py-2 px-1 font-mono">
            {{ result.version }}
          </td>

          <!-- Vulnerability count -->
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

  <!-- If NO results exist yet (e.g., before file upload) -->
  <section v-else class="text-sm text-gray-500 mt-4 flex flex-col items-center">
    No scan results yet. Upload a package.json file to start.
  </section>
</template>
