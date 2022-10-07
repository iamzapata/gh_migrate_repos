export async function cloneRepos() {
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
}

export async function changeCommitsAuthor() {
  try {
    const dir = await $`pwd`

    console.log(dir.stdout)

    cd("repos")

    let repos = await $`ls`

    repos = repos.stdout.split("\n").filter(Boolean)

    for (let repo of repos) {
      try {
        cd(repo)
        await $`FILTER_BRANCH_SQUELCH_WARNING=1 ../../change_commit_author.sh`
      } catch (e) {
        console.log(e)
      } finally {
        const dir = process.cwd()
        if (dir.includes(repo)) {
          cd("..")
        }
      }
    }
  } catch (p) {
    console.error(p)
  } finally {
    const dir = process.cwd()

    if (dir.includes("repos")) {
      cd("..")
    }
  }
}

export async function pushRepos() {
  //await $`gh auth refresh -h github.com -s delete_repo`

  try {
    cd("repos")

    let repos = await $`ls`

    repos = repos.stdout.split("\n").filter(Boolean)

    for (let repo of repos) {
      try {
        console.log(repo)

        //await $`gh repo delete ${repo} --confirm`
        await $`gh repo create --source ${repo}/ --push --private --remote=${repo}`
      } catch (e) {
        console.log(e)
      }
    }
  } catch (p) {
    console.error(p)
  } finally {
    const dir = process.cwd()

    if (dir.includes("repos")) {
      cd("..")
    }
  }
}
