Under developent  if you like view proyects under construction read the package.json for compile in your machine. 
This is a electron project no use ng server beacouse this software nead access to the operative system for generate the files use by Nestjs.
use npm run the script you nead for run or compile a executable only tested in windows .
    
    "start:electron": "ng build --base-href ./ && electron . ",
    "dist": "electron-builder"

# Generador

This project was generated with [Angular CLI](https://github.com/angular/angular-cli)version 9.1.1.

## Build
     
     npm run start:electron 
     npm run dist

## Further help

