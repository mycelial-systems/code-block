# Line Length Enforcement Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Keep project-owned source, test, and example lines below 80 columns
and prevent new overlong lines from entering the repository.

**Architecture:** Add a small Node checker with an explicit list of
project-owned roots and an exclusion for vendored Prism output. The checker
will report each offending file and line, and will run through an npm script
so local and CI quality checks use the same command. Existing source, test,
and example lines will be wrapped without changing behavior.

**Tech Stack:** Node.js, npm scripts, TypeScript, JavaScript, HTML, and CSS.

---

### Task 1: Add the line-length checker

**Files:**
- Create: `test/line-length.cjs`
- Modify: `package.json`

**Steps:**

1. Write a checker test fixture that fails when a project-owned file has an
   overlong line and ignores `example/prism.*`.
2. Run the targeted checker test and confirm it fails because the checker is
   not present.
3. Implement the checker with a 79-column maximum and stable file ordering.
4. Run the targeted checker test and confirm it passes.

### Task 2: Wrap project-owned lines

**Files:**
- Modify: project-owned source, tests, and example files reported by the
  checker

**Steps:**

1. Run the checker to capture the current violations.
2. Wrap only project-owned lines, preserving behavior and excluding vendored
   Prism output.
3. Run the targeted checker and `npm run lint`.
4. Commit the implementation and formatting changes.

### Task 3: Run the final task gate

**Files:**
- Modify: `progress.log`
- Modify: `specs/prd.json`

**Steps:**

1. Run `npm test`, `npm run lint`, `npm run typecheck`, and the line-length
   checker.
2. Record the result and reusable patterns in `progress.log`.
3. Set US-009 `passes` to `true`.
4. Commit the task completion metadata.
