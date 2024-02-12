import { $ } from "bun"
import { intro, outro, text, select, spinner } from "@clack/prompts"
import { rm } from "node:fs/promises"

intro("Welcome to @rdev/cli! Let's create a new project.")

const PROJECT_NAME_INPUT = await text({
  message: "Project name",
  placeholder: "deep-web-crawler",
  validate(value) {
    if (!value) return "Project name is required"
    if (/^\d/.test(value)) return "Project name can't start with a number"
    if (/^[^a-z]/.test(value)) return "Project name can't start with a special character"
  },
})

const PROJECT_NAME = PROJECT_NAME_INPUT.toString()

type ProjectOptions = "astro" | "nextjs"

const PROJECT_OPTIONS_SELECT = await select({
  message: "Select a project template",
  options: [
    {
      value: "astro",
      label: "Astro",
      hint: "Tailwind, Prettier, TypeScript, and Eslint"
    }
    // {
    //   value: "nextjs",
    //   label: "Next.js",
    //   hint: "Tailwind, Shadcn, Prettier, T3 Env, and Eslint",
    // }
  ]
}) as ProjectOptions

const s = spinner()

s.start("Cloning project...")

await $`git clone --depth 1 https://github.com/soyricardodev/${PROJECT_OPTIONS_SELECT}-template-base.git ${PROJECT_NAME}`.quiet()

await rm(`${PROJECT_NAME}/.git`, { recursive: true, force: true })

s.stop("Project cloned successfully!")

outro(`Now you can run cd ${PROJECT_NAME} and install deps`)

process.exit(0)