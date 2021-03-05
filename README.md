Under developent  if you like view proyects under construction read the package.json for compile in your machine. 
This is a electron project no use ng server beacouse this software nead access to the operative system for generate the files use by 
Nestjs.
use npm run the script you nead for run or compile a executable only tested in windows .
    
    "start:electron": "ng build --base-href ./ && electron . ",
    "start:electronserv": "ng build --base-href ./ && electron . --serve",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"

# Generador

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
