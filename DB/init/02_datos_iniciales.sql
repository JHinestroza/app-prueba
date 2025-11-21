USE PruebaTecnica;
GO

------------------------------------------------------------
-- INSERTAR DATOS INICIALES
------------------------------------------------------------

-- Estados
INSERT INTO Estados (nombre) VALUES ('En Revisión');
INSERT INTO Estados (nombre) VALUES ('Aprobado');
INSERT INTO Estados (nombre) VALUES ('Rechazado');
GO

-- Roles
INSERT INTO Rol (rol) VALUES ('Técnico');
INSERT INTO Rol (rol) VALUES ('Coordinador');
INSERT INTO Rol (rol) VALUES ('Administrador');
GO

-- Usuarios de prueba (contraseñas en MD5)
-- Contraseña "admin123" = MD5: 0c909a141f1f2c0a1cb602b0b2d7d050

INSERT INTO Usuarios (nombre, apellido, correo, contrasenia, rol_id) 
VALUES ('Juan', 'Pérez', 'admin@dicri.gob.gt', '0c909a141f1f2c0a1cb602b0b2d7d050', 3);

INSERT INTO Usuarios (nombre, apellido, correo, contrasenia, rol_id) 
VALUES ('María', 'González', 'tecnico1@dicri.gob.gt', '0c909a141f1f2c0a1cb602b0b2d7d050', 1);

INSERT INTO Usuarios (nombre, apellido, correo, contrasenia, rol_id) 
VALUES ('Carlos', 'Ramírez', 'coordinador@dicri.gob.gt', '0c909a141f1f2c0a1cb602b0b2d7d050', 2);

INSERT INTO Usuarios (nombre, apellido, correo, contrasenia, rol_id) 
VALUES ('Ana', 'López', 'tecnico2@dicri.gob.gt', '0c909a141f1f2c0a1cb602b0b2d7d050', 1);
GO

PRINT 'Datos iniciales insertados correctamente';
GO
