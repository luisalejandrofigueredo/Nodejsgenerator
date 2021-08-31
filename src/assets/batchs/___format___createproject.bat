echo create project
cd %1
echo package %3 
nest new  %2 --package-manager %3
echo install libraries
if %3=="npm" {
call npm i --save @nestjs/jwt
call npm install bcrypt
call npm install --save nest-winston winston
call npm install @nestjs/platform-express --save
call npm install @types/express -D
call npm install --save @nestjs/typeorm typeorm mysql2
}