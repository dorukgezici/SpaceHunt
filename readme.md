# SpaceHunt

SpaceHunt is a project developed in TIE-21106 2017-01 Software Engineering Methodologies course at Tampere University of Technology.

Authors of the project are team members of Group 10 called _TheGroup_:
- Ali Doruk Gezici
- Anna Vankova
- Milos Svana
- Nejc Maček
- Wladimir Hofmann

## Requirements & Setup

Please see [setup.md](doc/setup.md).

## Project Structure

- `build/` includes production build of the project, once built
	- `assets/` assets imported from `code/assets/`
	- `static/` static resouces copied from `code/static/`
	- other files
- `code/` includes project source code and assets
	- `src/` includes application source code
	- `static/` includes static resources (this directory is copied to build project)
	- `types/` includes additional TypeScript Type Definitions
	- `app.ts` main application entry point
	- `favicon.png` project's favicon (display icon)
	- `index.html` html template and webapp entry point 
	- `polyfills.ts` polyfill includes entry point (should not contain any game logic, only polyfill inclusion) 
	- `style.scss` main application stylesheets (note that custom stylesheets may be included)
- `config/` includes configuration files for building and running the project
- `doc/` includes documentation, notes and Project Plan
	- `G10_project_plan.docx` Project Plan and Diary
	- other notes and documentation files
- `internal/` includes personal files, notes and whatnots, that are not pushed to git
- `node_modules/` npm packages are installed here
- `.gitignore` git ignore list
- `package.json` npm project information and package list
- `package-lock.json` used by npm
- `readme.md` this readme description file
- `tsconfig.json` typescript project configuration file
- `webpack.config.js` webpack configuration file
- `tslint.json` linting configuration file

## Useful Information

See [dependency-management.md](doc/dependency-management.md) for details on how to manage application resouces and dependencies.

See [setup.md](doc/setup.md) for details about available application management CLI commands.
