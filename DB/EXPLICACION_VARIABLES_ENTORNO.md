# Explicación: Variables de Entorno en Docker Compose


## Variables de Entorno en Docker

En Docker, las variables de entorno sirven para **configurar contenedores sin modificar el código** de la aplicación.

### Ejemplo Visual:

```yaml
services:
  sqlserver:
    environment:
      ACCEPT_EULA: "Y"           # ← Variable de entorno 1
      SA_PASSWORD: "prueba12345!" # ← Variable de entorno 2
      MSSQL_PID: "Developer"      # ← Variable de entorno 3
```

## Variables de Entorno vs Variables de Bash

###  IMPORTANTE: Son cosas DIFERENTES

| Aspecto | Variables de Entorno | Variables de Bash |
|---------|---------------------|-------------------|
| **Dónde se definen** | En `environment:` del docker-compose.yml | Dentro de scripts bash (`for f in...`) |
| **Quién las procesa** | Docker Compose | El shell bash |
| **Alcance** | Todo el contenedor | Solo el script actual |
| **Ejemplos** | `SA_PASSWORD`, `NODE_ENV`, `API_URL` | `$f`, `$?`, `$1` |
| **Cómo se usan** | La aplicación las lee directamente | Se usan en el script: `echo $f` |

### Ejemplo del problema con `$f`:

```yaml
command:
  - /bin/bash
  - -c
  - |
    for f in /docker-initdb.d/*.sql; do
      echo "Archivo: $f"    # ❌ PROBLEMA: Docker Compose ve $f
    done
```

**¿Qué pasa aquí?**

1. **Docker Compose procesa primero** el YAML antes de crear el contenedor
2. Ve `$f` y piensa: "¿hay una variable de entorno llamada `f`?"
3. No la encuentra (porque `f` es una variable de bash, no de entorno)
4. Reemplaza `$f` con cadena vacía: `""`
5. El script que recibe bash es: `echo "Archivo: "` ← ¡Sin el nombre del archivo!

**Solución con `$$f`:**

```yaml
command:
  - /bin/bash
  - -c
  - |
    for f in /docker-initdb.d/*.sql; do
      echo "Archivo: $$f"   #  CORRECTO: Docker Compose escapa $$
    done
```

**Flujo correcto:**

1. **Docker Compose procesa**: Ve `$$f` y lo convierte en `$f` (escapado)
2. **Bash recibe**: `echo "Archivo: $f"` ← Perfecto
3. **Bash ejecuta**: Reemplaza `$f` con el nombre del archivo actual del loop

---

## Casos de Uso Comunes

### 1. Configuración de Base de Datos
```yaml
environment:
  DB_HOST: "localhost"
  DB_PORT: "5432"
  DB_USER: "admin"
  DB_PASSWORD: "secreto123"
  DB_NAME: "mi_aplicacion"
```

### 2. Modos de Ejecución
```yaml
environment:
  NODE_ENV: "development"   
  DEBUG: "true"
  LOG_LEVEL: "verbose"
```

### 3. Integración con Servicios Externos
```yaml
environment:
  API_KEY: "sk-1234567890"
  STRIPE_SECRET: "sk_test_..."
  AWS_REGION: "us-east-1"
```

---

## Comandos Útiles para Depurar

### Ver variables de entorno dentro del contenedor:
```powershell
# Ver todas las variables
docker exec sqlserver env

# Ver una variable específica
docker exec sqlserver printenv SA_PASSWORD
```

### Probar un script bash dentro del contenedor:
```powershell
# Opción 1: Usar comillas dobles y escapar con `$
docker exec sqlserver /bin/bash -c "echo `$SA_PASSWORD"

# Opción 2: Usar comillas simples sin escape (MÁS RECOMENDADO)
docker exec sqlserver /bin/bash -c 'echo $SA_PASSWORD'

# Opción 3: Ver todas las variables de entorno formateadas
docker exec sqlserver printenv | Select-String "SA_PASSWORD|MSSQL"
```

** Nota importante sobre `$$` en PowerShell:**
- El `$$` solo se usa dentro de archivos `docker-compose.yml` 
- En la terminal PowerShell, usa `$` normal con comillas simples
- En docker-compose.yml: `$$VAR` → Docker Compose lo escapa a `$VAR`
- En PowerShell directamente: `'$VAR'` → Se pasa tal cual al contenedor

---

## Resumen Ejecutivo

**Variables de Entorno** = Configuración externa que se pasa a las aplicaciones
- Se definen en `environment:` del docker-compose.yml
- Docker las inyecta al contenedor al crearlo
- Las aplicaciones las leen para configurarse

**Variables de Bash** = Variables temporales dentro de scripts
- Se crean con `for`, asignaciones `VAR=valor`, etc.
- Solo existen mientras el script se ejecuta
- En docker-compose.yml se debe usar `$$` para escaparlas

---

## Operadores de Prueba Comunes en Bash

Los **operadores de prueba** se usan con los corchetes `[ ]` para verificar condiciones antes de ejecutar código.

### Sintaxis básica:
```bash
if [ OPERADOR "valor" ]; then
    # Código si la condición es verdadera
fi
```

### Tabla de Operadores:

| Operador | Significado | Descripción | Ejemplo |
|----------|-------------|-------------|---------|
| `-f` | **File** (archivo regular) | Verifica si es un archivo normal | `[ -f "schema.sql" ]` |
| `-d` | **Directory** (directorio) | Verifica si es un directorio/carpeta | `[ -d "/var/logs" ]` |
| `-e` | **Exists** (existe) | Verifica si existe (archivo o directorio) | `[ -e "config.txt" ]` |
| `-r` | **Readable** (legible) | Verifica si tiene permisos de lectura | `[ -r "datos.csv" ]` |
| `-w` | **Writable** (escribible) | Verifica si tiene permisos de escritura | `[ -w "log.txt" ]` |
| `-x` | **Executable** (ejecutable) | Verifica si tiene permisos de ejecución | `[ -x "script.sh" ]` |
| `-s` | **Size** (tamaño > 0) | Verifica si existe y no está vacío | `[ -s "output.log" ]` |
| `-L` | **Link** (enlace simbólico) | Verifica si es un enlace simbólico | `[ -L "acceso_directo" ]` |
| `-z` | **Zero length** (cadena vacía) | Verifica si una cadena está vacía | `[ -z "$variable" ]` |
| `-n` | **Non-zero** (cadena no vacía) | Verifica si una cadena NO está vacía | `[ -n "$variable" ]` |

### Uso en tu docker-compose.yml:

```bash
for f in /docker-initdb.d/*.sql; do 
  if [ -f "$$f" ]; then    # ← Aquí se usa -f
    # Solo procesa si $$f es un archivo regular
    /opt/mssql-tools18/bin/sqlcmd -i "$$f"
  fi
done
```

**¿Por qué usar `-f` aquí?**

Cuando el patrón `*.sql` no encuentra archivos, la variable `f` toma el valor literal `"*.sql"` (un string), no un archivo real. El `-f` previene que se intente procesar algo que no existe.

### Ejemplos Prácticos:

```bash
# Verificar si un archivo existe antes de leerlo
if [ -f "config.json" ]; then
    echo "Leyendo configuración..."
    cat config.json
else
    echo "ERROR: Archivo de configuración no encontrado"
fi

# Verificar si un directorio existe antes de crear archivos
if [ -d "/var/logs" ]; then
    echo "Directorio existe, creando log..."
    echo "Log entry" >> /var/logs/app.log
fi

# Verificar si un archivo está vacío
if [ -s "datos.txt" ]; then
    echo "El archivo tiene contenido"
else
    echo "El archivo está vacío o no existe"
fi

# Verificar permisos de ejecución
if [ -x "deploy.sh" ]; then
    ./deploy.sh
else
    echo "El script no tiene permisos de ejecución"
    chmod +x deploy.sh
fi

# Combinar con negación
if [ ! -f "archivo.txt" ]; then
    echo "El archivo NO existe, creándolo..."
    touch archivo.txt
fi
```

### 🔍 Operadores de Comparación (Bonus):

Para comparar valores numéricos y cadenas:

| Operador | Uso | Descripción |
|----------|-----|-------------|
| `-eq` | `[ $a -eq $b ]` | Igual (equal) - números |
| `-ne` | `[ $a -ne $b ]` | Diferente (not equal) - números |
| `-gt` | `[ $a -gt $b ]` | Mayor que (greater than) |
| `-lt` | `[ $a -lt $b ]` | Menor que (less than) |
| `-ge` | `[ $a -ge $b ]` | Mayor o igual (greater or equal) |
| `-le` | `[ $a -le $b ]` | Menor o igual (less or equal) |
| `=` | `[ "$a" = "$b" ]` | Igual - cadenas |
| `!=` | `[ "$a" != "$b" ]` | Diferente - cadenas |

Ejemplo usado en tu código:
```bash
if [ $$? -eq 0 ]; then    # ← Compara código de salida con 0
    echo "Éxito"
else
    echo "Error"
fi
```

---

## Declaración Automática de Variables en el Loop `for`

### ¿Dónde se declara la variable `f`?

La variable `f` **se declara automáticamente** en la línea del `for`, no necesitas declararla previamente.

### Sintaxis del loop `for` en Bash:

```bash
for VARIABLE in LISTA_DE_VALORES; do
    # usar $VARIABLE aquí
done
```

### En tu docker-compose.yml:

```bash
for f in /docker-initdb.d/*.sql; do
#   ↑
#   Aquí se declara 'f' automáticamente
    if [ -f "$$f" ]; then
        echo "Procesando: $$f"
    fi
done
```

**Explicación paso a paso:**

```bash
for f in /docker-initdb.d/*.sql; do
#   │ ││ └─────────────────────┘
#   │ ││         └── Lista de archivos que coinciden con el patrón *.sql
#   │ │└── Palabra clave 'in' (en)
#   │ └── Separador
#   └── 'f' es la VARIABLE que se crea automáticamente en cada iteración
```

### Ejemplo concreto:

Supongamos que tienes estos archivos:
- `/docker-initdb.d/schema.sql`
- `/docker-initdb.d/datos.sql`
- `/docker-initdb.d/usuarios.sql`

El loop hace esto internamente:

```bash
# Iteración 1:
f = "/docker-initdb.d/schema.sql"
# Ejecuta el cuerpo del loop (do...done) con f apuntando a schema.sql

# Iteración 2:
f = "/docker-initdb.d/datos.sql"
# Ejecuta el cuerpo del loop con f apuntando a datos.sql

# Iteración 3:
f = "/docker-initdb.d/usuarios.sql"
# Ejecuta el cuerpo del loop con f apuntando a usuarios.sql
```

### Comparación con otros lenguajes:

```javascript
// JavaScript
for (let i = 0; i < array.length; i++)
//      ↑ 'i' se declara aquí automáticamente

// Bash
for f in *.txt
//  ↑ 'f' se declara aquí automáticamente
```

### Más ejemplos de `for` en Bash:

#### Ejemplo 1: Lista de números
```bash
for numero in 1 2 3 4 5; do
    echo "Número: $numero"
done

# Salida:
# Número: 1
# Número: 2
# Número: 3
# Número: 4
# Número: 5
```

#### Ejemplo 2: Lista de palabras
```bash
for fruta in manzana pera uva plátano; do
    echo "Fruta: $fruta"
done

# Salida:
# Fruta: manzana
# Fruta: pera
# Fruta: uva
# Fruta: plátano
```

#### Ejemplo 3: Archivos con diferentes extensiones
```bash
for archivo in *.txt *.log *.csv; do
    if [ -f "$archivo" ]; then
        echo "Procesando: $archivo"
        wc -l "$archivo"  # Contar líneas
    fi
done
```

#### Ejemplo 4: Usando secuencias
```bash
# Del 1 al 10
for i in {1..10}; do
    echo "Iteración $i"
done

# Con incrementos de 2
for i in {0..20..2}; do
    echo "Número par: $i"
done
```

#### Ejemplo 5: Resultado de un comando
```bash
# Procesar todos los contenedores Docker
for container in $(docker ps -q); do
    echo "Inspeccionando contenedor: $container"
    docker inspect $container
done
```

### Lo que pasa internamente en tu código:

```bash
# 1. Bash busca archivos que coincidan con el patrón
#    /docker-initdb.d/*.sql

# 2. Encuentra (por ejemplo):
#    - /docker-initdb.d/schema.sql

# 3. Crea automáticamente la variable 'f'

# 4. Primera iteración:
f="/docker-initdb.d/schema.sql"
if [ -f "$f" ]; then  # Verifica que es un archivo
    echo "Ejecutando script: $f"
    /opt/mssql-tools18/bin/sqlcmd -i "$f"
    if [ $? -eq 0 ]; then
        echo "Script $f ejecutado exitosamente"
    fi
fi

# 5. Si hay más archivos, repite con el siguiente
```

### 🚫 Lo que NO necesitas hacer:

```bash
#  NO necesitas declarar 'f' antes del for:
f=""  # ← INNECESARIO
for f in *.sql; do
    echo "$f"
done

#  El 'for' lo hace automáticamente:
for f in *.sql; do
    echo "$f"
done

#  NO necesitas incrementar manualmente:
f=$f+1  # ← INNECESARIO, el for avanza solo

# ✅ El 'for' avanza automáticamente al siguiente elemento
```

### Conceptos clave:

1. **Declaración implícita**: `for VARIABLE in LISTA` crea la variable automáticamente
2. **Ámbito local**: La variable solo existe dentro del loop
3. **Iteración automática**: El loop avanza solo, no necesitas controlar el índice
4. **Puede ser cualquier nombre**: `for f`, `for archivo`, `for x`, etc.
