---
description: Code review všech staged změn
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git status:*)
---

## Git status

!`git status`

## Staged diff

!`git diff --cached`

## Staged soubory

!`git diff --cached --name-only`

Pokud je staged diff prázdný, uprozorni na to a skonči bez dalšího reviewu.

Jinak zkontroluj výše uvedené staged změny a udělej code review. Podle potřeby si pomocí Read/Grep/Glob dohledej okolní kontext (jak se měněný kód používá jinde v repu).

- logické chyby a edge cases
- bezpečnostní problémy
- výkon
- čitelnost / konvence

Výstup strukturovaně podle priority (critical / warning / nit).
