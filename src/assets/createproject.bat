echo 'Installing  Nestjs'
echo Sure?
CHOICE /C YN 
IF %ERRORLEVEL% EQU 1 goto INSTALLNESTJS
IF %ERRORLEVEL% EQU 2 goto CREATEPROJECT
:INSTALLNESTJS
call npm i -g @nestjs/cli
:CREATEPROJECT
call nest new %1
call cd %1
call npm i --save @nestjs/jwt
call npm install bcrypt
call npm install --save nest-winston winston
call npm install @nestjs/platform-express --save
call npm install @types/express -D
call npm install --save @nestjs/typeorm typeorm mysql2