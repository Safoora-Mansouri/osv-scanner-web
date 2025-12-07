// Represents a single vulnerability entry returned by the OSV API.
export interface OsvVulnerability {
  id: string
  summary?: string
  details?: string
  severity?: { type: string; score: string }[]
  references?: { type: string; url: string }[]
}

// Represents the result returned to the UI for each scanned package.
export interface PackageVulnerabilityResult {
  packageName: string
  version: string
  vulnerabilities: OsvVulnerability[]
}

// OSV API endpoint used to request vulnerability data.
const OSV_API_URL = 'https://api.osv.dev/v1/query'

// Converts a semver range into a clean version string that OSV accepts.
// Example: "^1.2.3" → "1.2.3", ">=2.0.0" → "2.0.0"
function parseVersion(versionString: string): string {
  // Remove semver operators such as ^, ~, >, >=, <=
  const cleaned = versionString.replace(/^[\^~>=<\s]*/, '')

  // Split on whitespace or commas to extract the first valid version
  const parts = cleaned.split(/[\s,]/)

  // Return the cleaned version or fallback to the original input
  return (parts[0] || versionString).trim()
}

// Queries the OSV API to retrieve vulnerability data for an npm package.
// Always returns a safe, structured response even if the API fails.
export async function fetchVulnerabilitiesForPackage(
  name: string,
  version: string
): Promise<PackageVulnerabilityResult> {

  // Normalize the version so it matches OSV API requirements
  const parsedVersion = parseVersion(version)

  // Build the request body for OSV API
  const body = {
    package: {
      name,
      ecosystem: 'npm'
    },
    version: parsedVersion
  }

  try {
    console.log('[OSV] Request body:', body)

    // Send POST request
    const response = await fetch(OSV_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    console.log('[OSV] Response status:', response.status)

    // OSV returned an error
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[OSV] HTTP error:', response.status, errorText)

      // Return safe empty result
      return {
        packageName: name,
        version: parsedVersion,
        vulnerabilities: []
      }
    }

    // Parse successful response
    const data = await response.json()
    console.log('[OSV] Raw response:', data)

    return {
      packageName: name,
      version: parsedVersion,
      vulnerabilities: data.vulns ?? []
    }

  } catch (error) {
    // Network failure or unexpected issue
    console.error('[OSV] Fetch failed:', error)

    return {
      packageName: name,
      version: parsedVersion,
      vulnerabilities: []
    }
  }
}
