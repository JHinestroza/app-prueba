# app-prueba


## Base de datos 

Para la base de datos, se levanto con docker. Para ello vamos a la pagina oficinal donde hay que hay que hacer un pulll de la imagen. Para ellos se siguien los siguientes pasos;

```bash
docker pull mcr.microsoft.com/mssql/server:2022-latest


docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=prueba1234567!" -p 1433:1433 --name sql1 --hostname sql1 -d mcr.microsoft.com/mssql/server:2022-latest

```

![alt text](image.png)




### Pruebas 

```bash 
docker exec sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "prueba12345!" -C -Q "SELECT name FROM sys.databases; SELECT TABLE_NAME FROM PruebaTecnica.INFORMATION_SCHEMA.TABLES;"
```

## Fronted 

Se inicia el proyecto usando vite-reactjs 

```bash 
npm create vite@latest my-react-app -- --template react


```

## Implementacion de tailwind 




Sirve para ver las dependencias de compatibilidad
```bash 
npm info react-router-dom peerDependencies
```

## Librerias 

### Sonner 

###  react-hook-form

## React Router 

React Router DOM sirve para manejar la navegación dentro de una aplicación hecha con React. Es decir que permite cambiar de páginas sin recargar el navegador.

```bash 
npm install react-dom react-router-dom
```

## react-icons


# Docker-compose

Como ver las variables de entorno del docker

```bash 
docker exec <nombre_contenedor> env
```















# Backend 


Iniciar el banckend con NodeJS y express 

```bash 
npm init -y
npm install express
npm install --save-dev nodemon # viene siendo como el npm run dev

```