------------------------------------------------------------
-- Crear la base de datos si no existe
------------------------------------------------------------
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PruebaTecnica')
BEGIN
    CREATE DATABASE PruebaTecnica;
END
GO

USE PruebaTecnica;
GO

------------------------------------------------------------
-- TABLA: Estados (unificada para expedientes y revisiones)
------------------------------------------------------------
CREATE TABLE Estados (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL
);

------------------------------------------------------------
-- TABLA: Rol
------------------------------------------------------------
CREATE TABLE Rol (
    id INT IDENTITY(1,1) PRIMARY KEY,
    rol VARCHAR(25) NOT NULL
);

------------------------------------------------------------
-- TABLA: Usuarios
------------------------------------------------------------
CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasenia VARCHAR(200) NOT NULL,
    rol_id INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES Rol(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

------------------------------------------------------------
-- TABLA: Expediente
------------------------------------------------------------
CREATE TABLE Expediente (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fecha_registro DATETIME NOT NULL DEFAULT GETDATE(),
    descripcion VARCHAR(MAX),
    Usuarios_id INT NOT NULL,         -- Técnico que registró
    justificacion VARCHAR(MAX),
    Estados_id INT NOT NULL,          -- Estado del expediente
    FOREIGN KEY (Usuarios_id) REFERENCES Usuarios(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    FOREIGN KEY (Estados_id) REFERENCES Estados(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

------------------------------------------------------------
-- TABLA: Indicios
------------------------------------------------------------
CREATE TABLE Indicios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    descripcion VARCHAR(MAX) NOT NULL,
    color VARCHAR(50),
    tamano VARCHAR(20),
    peso VARCHAR(20),
    ubicacion VARCHAR(200),
    expediente_id INT NOT NULL,
    Usuarios_id INT NOT NULL,        -- Técnico que lo registró
    FOREIGN KEY (expediente_id) REFERENCES Expediente(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
    FOREIGN KEY (Usuarios_id) REFERENCES Usuarios(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

------------------------------------------------------------
-- TABLA: Revision
------------------------------------------------------------
CREATE TABLE Revision (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fecha_revision DATETIME NOT NULL DEFAULT GETDATE(),
    Usuarios_id INT NOT NULL,        -- Coordinador que revisó
    Estados_id INT NOT NULL,         -- Aprobado / Rechazado
    expediente_id INT NOT NULL,
    FOREIGN KEY (expediente_id) REFERENCES Expediente(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
    FOREIGN KEY (Usuarios_id) REFERENCES Usuarios(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    FOREIGN KEY (Estados_id) REFERENCES Estados(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
GO
