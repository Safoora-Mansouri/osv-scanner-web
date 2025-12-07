
#  NPM Vulnerability Scanner (Vue 3 + TypeScript + OSV.dev)

A lightweight web application that analyzes a project's **package.json** file and detects known vulnerabilities using the **OSV (Open Source Vulnerabilities)** API by Google/OpenSSF.

This tool is ideal for developers who want a quick way to check the security of their dependencies without needing a backend or CLI tool.

///////////////////////////////////////////////////////////

##  Features

- Upload a `package.json` file directly from your computer  
- Parse and extract both **dependencies** and **devDependencies**  
- Automatically send requests to the **OSV.dev API**  
- Display vulnerability results in a clean, color-coded table  
- Filter between **all packages** and **vulnerable packages only**  
- Type-safe code using **TypeScript**  
- Modular, clean Vue 3 architecture using **Composition API**

///////////////////////////////////////////////////////

##  Tech Stack

- **Vue 3** + Composition API  
- **TypeScript**  
- **Vite** (development server + bundler)  
- **TailwindCSS** (UI styling)  
- **OSV API v1** (security vulnerability database)  

/////////////////////////////////////////////////////

## Installation & Setup

Clone or download the repo, then:

```bash
npm install
npm run dev

/////////////////////////////////////////////////////////

Project Structure
src/
 ├── App.vue                 # Root layout (header, main, footer)
 │
 ├── components/
 │     ├── FileUploadSection.vue  # Upload + emits PackageJson
 │     └── ResultsSection.vue     # Shows scan results
 │
 ├── composables/
 │     └── useOsvScanner.ts       # Core scan logic and state
 │
 ├── services/
 │     └── osvClient.ts           # OSV API integration
 │
 ├── types/
 │     └── packageJson.ts         # Type definitions
 │
 └── main.ts    

///////////////////////////////////////////////////////////

How the Scanner Works

1-User uploads a package.json file

2-The app reads the file using FileReader

3-JSON is parsed and validated

4-Dependencies are extracted into a clean object

5-For each dependency, the app sends a POST request to: https://api.osv.dev/v1/query

6-OSV responds with a list of vulnerabilities (if any)

7-UI highlights:

🟥 Red rows → packages with vulnerabilities

🟩 Green rows → safe packages



//////////////////////////////////////////////////////////////
