FROM mcr.microsoft.com/mssql/server:2022-latest

# Variables de entorno
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=prueba12345!
ENV MSSQL_PID=Developer

# Copiar scripts SQL al contenedor
COPY init/*.sql /docker-initdb.d/

# Exponer puerto
EXPOSE 1433

# Comando de inicio con script inline
CMD /bin/bash -c " \
    /opt/mssql/bin/sqlservr & \
    echo 'Esperando a que SQL Server esté listo...' && \
    sleep 30 && \
    for f in /docker-initdb.d/*.sql; do \
        if [ -f \$f ]; then \
            echo \"Ejecutando script: \$f\" && \
            /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P prueba12345! -C -i \$f && \
            echo \"Script \$f ejecutado exitosamente\" || \
            echo \"Error al ejecutar script \$f\"; \
        fi; \
    done && \
    echo 'Inicialización completa. SQL Server está listo.' && \
    wait \
"
