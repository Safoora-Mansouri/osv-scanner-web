/**
 * Composable: useOsvScanner
 *
 * This composable owns the core scanning logic:
 * - Stores the uploaded package.json
 * - Merges dependencies and devDependencies
 * - Calls the OSV API for each dependency
 * - Manages loading and error states
 *
 * By moving this logic out of App.vue, the root component stays
 * focused on layout and composition instead of business logic.
 */

import { ref } from 'vue'
import type { PackageJson } from '../types/packageJson'
import type { PackageVulnerabilityResult } from '../services/osvClient'
import { fetchVulnerabilitiesForPackage } from '../services/osvClient'

export function useOsvScanner() {
  // Holds the parsed package.json uploaded by the user
  const packageJson = ref<PackageJson | null>(null)

  // Holds the vulnerability results returned from OSV
  const results = ref<PackageVulnerabilityResult[]>([])

  // True while OSV API calls are in flight
  const loading = ref(false)

  // User-friendly error message to display in the UI
  const errorMessage = ref<string | null>(null)

  /**
   * handlePackageJsonLoaded
   *
   * Called when a valid package.json has been parsed.
   * Responsibilities:
   * 1. Store the uploaded JSON.
   * 2. Reset previous results and errors.
   * 3. Merge dependencies and devDependencies.
   * 4. For each dependency, call OSV using fetchVulnerabilitiesForPackage.
   * 5. Aggregate all results into a single array.
   */
  async function handlePackageJsonLoaded(data: PackageJson) {
    packageJson.value = data
    results.value = []
    errorMessage.value = null

    // Merge both dependencies and devDependencies into one object
    const allDeps = {
      ...(data.dependencies ?? {}),
      ...(data.devDependencies ?? {})
    }

    const entries = Object.entries(allDeps)
    if (entries.length === 0) return

    loading.value = true

    try {
      // Send all OSV queries in parallel for better performance
      const promises = entries.map(([name, version]) =>
        fetchVulnerabilitiesForPackage(name, version)
      )
      results.value = await Promise.all(promises)
    } catch (e) {
      errorMessage.value = 'Failed to fetch vulnerabilities from OSV.'
    } finally {
      loading.value = false
    }
  }

  return {
    packageJson,
    results,
    loading,
    errorMessage,
    handlePackageJsonLoaded
  }
}
