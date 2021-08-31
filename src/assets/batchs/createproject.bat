echo create project
cd %1
echo package %3 
nest new  %2 --package-manager %3
echo install libraries
CMD /C "%ProgramFiles%\nodejs\npm" i --save @nestjs/jwt
CMD /C "%ProgramFiles%\nodejs\npm" install bcrypt
CMD /C "%ProgramFiles%\nodejs\npm" install --save nest-winston winston
CMD /C "%ProgramFiles%\nodejs\npm" install @nestjs/platform-express --save
CMD /C "%ProgramFiles%\nodejs\npm" install @types/express -D
CMD /C "%ProgramFiles%\nodejs\npm" install --save @nestjs/typeorm typeorm mysql2