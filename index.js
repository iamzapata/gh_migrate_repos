#!/usr/bin/env zx

import "zx/globals"

await $`git st`

try {
  $.verbose = false

  let repos = await $`gh repo list --json name --limit 1000`

  for (let repo of repos) {
    console.log(repo.name)
  }
} catch (p) {
  console.log(`Exit code: ${p.exitCode}`)
  console.log(`Error: ${p.stderr}`)
}
