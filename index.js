#!/usr/bin/env zx
import "zx/globals"

try {
  cd("repos/")

  $.verbose = false
  let repos = await $`gh repo list --json name --limit 1000 --source`

  $.verbose = true
  repos = JSON.parse(repos)

  for (let repo of repos) {
    chalk.blue(`Cloning ${repo.name}`)
    try {
      await $`gh repo clone ${repo.name}`
      chalk.blue(`${repo.name} Cloned`)
    } catch (e) {
      chalk.red(`Error cloning ${repo.name}`, e)
      continue
    }
  }
} catch (p) {
  console.log(`Exit code: ${p.exitCode}`)
  console.log(`Error: ${p.stderr}`)
}
