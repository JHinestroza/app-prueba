USE PruebaTecnica;
GO

------------------------------------------------------------
-- STORED PROCEDURES - AUTENTICACIÓN
------------------------------------------------------------

-- Login de Usuario
CREATE OR ALTER PROCEDURE sp_Login
    @correo VARCHAR(100),
    @contrasenia VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.correo,
        r.id as rol_id,
        r.rol as rol_nombre
    FROM Usuarios u
    INNER JOIN Rol r ON u.rol_id = r.id
    WHERE u.correo = @correo 
    AND u.contrasenia = @contrasenia;
END
GO

------------------------------------------------------------
-- STORED PROCEDURES - USUARIOS
------------------------------------------------------------

-- Obtener todos los usuarios
CREATE OR ALTER PROCEDURE sp_ObtenerUsuarios
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.correo,
        r.id as rol_id,
        r.rol as rol_nombre
    FROM Usuarios u
    INNER JOIN Rol r ON u.rol_id = r.id
    ORDER BY u.nombre, u.apellido;
END
GO

-- Obtener usuario por ID
CREATE OR ALTER PROCEDURE sp_ObtenerUsuarioPorId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.correo,
        r.id as rol_id,
        r.rol as rol_nombre
    FROM Usuarios u
    INNER JOIN Rol r ON u.rol_id = r.id
    WHERE u.id = @id;
END
GO

-- Crear Usuario
CREATE OR ALTER PROCEDURE sp_CrearUsuario
    @nombre VARCHAR(100),
    @apellido VARCHAR(50),
    @correo VARCHAR(100),
    @contrasenia VARCHAR(200),
    @rol_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Usuarios WHERE correo = @correo)
    BEGIN
        RAISERROR('El correo ya está registrado', 16, 1);
        RETURN;
    END
    
    INSERT INTO Usuarios (nombre, apellido, correo, contrasenia, rol_id)
    VALUES (@nombre, @apellido, @correo, @contrasenia, @rol_id);
    
    SELECT SCOPE_IDENTITY() as id;
END
GO

-- Actualizar Usuario
CREATE OR ALTER PROCEDURE sp_ActualizarUsuario
    @id INT,
    @nombre VARCHAR(100),
    @apellido VARCHAR(50),
    @correo VARCHAR(100),
    @rol_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Usuarios WHERE correo = @correo AND id != @id)
    BEGIN
        RAISERROR('El correo ya está registrado por otro usuario', 16, 1);
        RETURN;
    END
    
    UPDATE Usuarios 
    SET nombre = @nombre,
        apellido = @apellido,
        correo = @correo,
        rol_id = @rol_id
    WHERE id = @id;
    
    SELECT @@ROWCOUNT as affected_rows;
END
GO

-- Cambiar Contraseña
CREATE OR ALTER PROCEDURE sp_CambiarContrasenia
    @id INT,
    @contrasenia VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Usuarios 
    SET contrasenia = @contrasenia
    WHERE id = @id;
    
    SELECT @@ROWCOUNT as affected_rows;
END
GO

-- Eliminar Usuario
CREATE OR ALTER PROCEDURE sp_EliminarUsuario
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Usuarios WHERE id = @id;
    
    SELECT @@ROWCOUNT as affected_rows;
END
GO

------------------------------------------------------------
-- STORED PROCEDURES - EXPEDIENTES
------------------------------------------------------------

-- Obtener todos los expedientes
CREATE OR ALTER PROCEDURE sp_ObtenerExpedientes
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.id,
        e.fecha_registro,
        e.descripcion,
        e.justificacion,
        u.id as tecnico_id,
        u.nombre + ' ' + u.apellido as tecnico_nombre,
        est.id as estado_id,
        est.nombre as estado_nombre,
        (SELECT COUNT(*) FROM Indicios WHERE expediente_id = e.id) as cantidad_indicios
    FROM Expediente e
    INNER JOIN Usuarios u ON e.Usuarios_id = u.id
    INNER JOIN Estados est ON e.Estados_id = est.id
    ORDER BY e.fecha_registro DESC;
END
GO

-- Obtener expediente por ID
CREATE OR ALTER PROCEDURE sp_ObtenerExpedientePorId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.id,
        e.fecha_registro,
        e.descripcion,
        e.justificacion,
        u.id as tecnico_id,
        u.nombre + ' ' + u.apellido as tecnico_nombre,
        est.id as estado_id,
        est.nombre as estado_nombre
    FROM Expediente e
    INNER JOIN Usuarios u ON e.Usuarios_id = u.id
    INNER JOIN Estados est ON e.Estados_id = est.id
    WHERE e.id = @id;
END
GO

-- Obtener expedientes por técnico
CREATE OR ALTER PROCEDURE sp_ObtenerExpedientesPorTecnico
    @tecnico_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.id,
        e.fecha_registro,
        e.descripcion,
        e.justificacion,
        u.id as tecnico_id,
        u.nombre + ' ' + u.apellido as tecnico_nombre,
        est.id as estado_id,
        est.nombre as estado_nombre,
        (SELECT COUNT(*) FROM Indicios WHERE expediente_id = e.id) as cantidad_indicios
    FROM Expediente e
    INNER JOIN Usuarios u ON e.Usuarios_id = u.id
    INNER JOIN Estados est ON e.Estados_id = est.id
    WHERE e.Usuarios_id = @tecnico_id
    ORDER BY e.fecha_registro DESC;
END
GO

-- Crear Expediente
CREATE OR ALTER PROCEDURE sp_CrearExpediente
    @descripcion VARCHAR(MAX),
    @tecnico_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Estado inicial: En Revisión (1)
    INSERT INTO Expediente (fecha_registro, descripcion, Usuarios_id, Estados_id)
    VALUES (GETDATE(), @descripcion, @tecnico_id, 1);
    
    SELECT SCOPE_IDENTITY() as id;
END
GO

-- Actualizar Expediente
CREATE OR ALTER PROCEDURE sp_ActualizarExpediente
    @id INT,
    @descripcion VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Expediente 
    SET descripcion = @descripcion
    WHERE id = @id;
    
    SELECT @@ROWCOUNT as affected_rows;
END
GO

-- Aprobar/Rechazar Expediente
CREATE OR ALTER PROCEDURE sp_RevisarExpediente
    @expediente_id INT,
    @coordinador_id INT,
    @estado_id INT, -- 2 = Aprobado, 3 = Rechazado
    @justificacion VARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Actualizar estado del expediente
        UPDATE Expediente 
        SET Estados_id = @estado_id,
            justificacion = @justificacion
        WHERE id = @expediente_id;
        
        -- Registrar la revisión
        INSERT INTO Revision (fecha_revision, Usuarios_id, Estados_id, expediente_id)
        VALUES (GETDATE(), @coordinador_id, @estado_id, @expediente_id);
        
        COMMIT TRANSACTION;
        SELECT 1 as success, 'Expediente revisado correctamente' as mensaje;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 as success, ERROR_MESSAGE() as mensaje;
    END CATCH
END
GO

-- Eliminar Expediente
CREATE OR ALTER PROCEDURE sp_EliminarExpediente
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Los indicios y revisiones se eliminan automáticamente por CASCADE
    DELETE FROM Expediente WHERE id = @id;
    
    SELECT @@ROWCOUNT as affected_rows;
END
GO

------------------------------------------------------------
-- STORED PROCEDURES - INDICIOS
------------------------------------------------------------

-- Obtener indicios por expediente
CREATE OR ALTER PROCEDURE sp_ObtenerIndiciosPorExpediente
    @expediente_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        i.id,
        i.descripcion,
        i.color,
        i.tamano,
        i.peso,
        i.ubicacion,
        i.expediente_id,
        u.id as tecnico_id,
        u.nombre + ' ' + u.apellido as tecnico_nombre
    FROM Indicios i
    INNER JOIN Usuarios u ON i.Usuarios_id = u.id
    WHERE i.expediente_id = @expediente_id
    ORDER BY i.id;
END
GO

-- Obtener indicio por ID
CREATE OR ALTER PROCEDURE sp_ObtenerIndicioPorId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        i.id,
        i.descripcion,
        i.color,
        i.tamano,
        i.peso,
        i.ubicacion,
        i.expediente_id,
        u.id as tecnico_id,
        u.nombre + ' ' + u.apellido as tecnico_nombre
    FROM Indicios i
    INNER JOIN Usuarios u ON i.Usuarios_id = u.id
    WHERE i.id = @id;
END
GO

-- Crear Indicio
CREATE OR ALTER PROCEDURE sp_CrearIndicio
    @descripcion VARCHAR(MAX),
    @color VARCHAR(50),
    @tamano VARCHAR(20),
    @peso VARCHAR(20),
    @ubicacion VARCHAR(200),
    @expediente_id INT,
    @tecnico_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Indicios (descripcion, color, tamano, peso, ubicacion, expediente_id, Usuarios_id)
    VALUES (@descripcion, @color, @tamano, @peso, @ubicacion, @expediente_id, @tecnico_id);
    
    SELECT SCOPE_IDENTITY() as id;
END
GO

-- Actualizar Indicio
CREATE OR ALTER PROCEDURE sp_ActualizarIndicio
    @id INT,
    @descripcion VARCHAR(MAX),
    @color VARCHAR(50),
    @tamano VARCHAR(20),
    @peso VARCHAR(20),
    @ubicacion VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Indicios 
    SET descripcion = @descripcion,
        color = @color,
        tamano = @tamano,
        peso = @peso,
        ubicacion = @ubicacion
    WHERE id = @id;
    
    SELECT @@ROWCOUNT as affected_rows;
END
GO

-- Eliminar Indicio
CREATE OR ALTER PROCEDURE sp_EliminarIndicio
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Indicios WHERE id = @id;
    
    SELECT @@ROWCOUNT as affected_rows;
END
GO

------------------------------------------------------------
-- STORED PROCEDURES - REVISIONES
------------------------------------------------------------

-- Obtener todas las revisiones
CREATE OR ALTER PROCEDURE sp_ObtenerRevisiones
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        r.id,
        r.fecha_revision,
        r.expediente_id,
        u.id as coordinador_id,
        u.nombre + ' ' + u.apellido as coordinador_nombre,
        est.id as estado_id,
        est.nombre as estado_nombre,
        e.descripcion as expediente_descripcion
    FROM Revision r
    INNER JOIN Usuarios u ON r.Usuarios_id = u.id
    INNER JOIN Estados est ON r.Estados_id = est.id
    INNER JOIN Expediente e ON r.expediente_id = e.id
    ORDER BY r.fecha_revision DESC;
END
GO

-- Obtener revisiones por expediente
CREATE OR ALTER PROCEDURE sp_ObtenerRevisionesPorExpediente
    @expediente_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        r.id,
        r.fecha_revision,
        u.id as coordinador_id,
        u.nombre + ' ' + u.apellido as coordinador_nombre,
        est.id as estado_id,
        est.nombre as estado_nombre
    FROM Revision r
    INNER JOIN Usuarios u ON r.Usuarios_id = u.id
    INNER JOIN Estados est ON r.Estados_id = est.id
    WHERE r.expediente_id = @expediente_id
    ORDER BY r.fecha_revision DESC;
END
GO

------------------------------------------------------------
-- STORED PROCEDURES - REPORTES Y ESTADÍSTICAS
------------------------------------------------------------

-- Obtener estadísticas generales
CREATE OR ALTER PROCEDURE sp_ObtenerEstadisticas
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        (SELECT COUNT(*) FROM Expediente) as total_expedientes,
        (SELECT COUNT(*) FROM Expediente WHERE Estados_id = 1) as expedientes_en_revision,
        (SELECT COUNT(*) FROM Expediente WHERE Estados_id = 2) as expedientes_aprobados,
        (SELECT COUNT(*) FROM Expediente WHERE Estados_id = 3) as expedientes_rechazados,
        (SELECT COUNT(*) FROM Indicios) as total_indicios,
        (SELECT COUNT(*) FROM Usuarios WHERE rol_id = 1) as total_tecnicos,
        (SELECT COUNT(*) FROM Usuarios WHERE rol_id = 2) as total_coordinadores;
END
GO

-- Obtener expedientes por rango de fechas
CREATE OR ALTER PROCEDURE sp_ObtenerExpedientesPorFecha
    @fecha_inicio DATE,
    @fecha_fin DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.id,
        e.fecha_registro,
        e.descripcion,
        e.justificacion,
        u.id as tecnico_id,
        u.nombre + ' ' + u.apellido as tecnico_nombre,
        est.id as estado_id,
        est.nombre as estado_nombre,
        (SELECT COUNT(*) FROM Indicios WHERE expediente_id = e.id) as cantidad_indicios
    FROM Expediente e
    INNER JOIN Usuarios u ON e.Usuarios_id = u.id
    INNER JOIN Estados est ON e.Estados_id = est.id
    WHERE CAST(e.fecha_registro AS DATE) BETWEEN @fecha_inicio AND @fecha_fin
    ORDER BY e.fecha_registro DESC;
END
GO

-- Obtener expedientes por estado
CREATE OR ALTER PROCEDURE sp_ObtenerExpedientesPorEstado
    @estado_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.id,
        e.fecha_registro,
        e.descripcion,
        e.justificacion,
        u.id as tecnico_id,
        u.nombre + ' ' + u.apellido as tecnico_nombre,
        est.id as estado_id,
        est.nombre as estado_nombre,
        (SELECT COUNT(*) FROM Indicios WHERE expediente_id = e.id) as cantidad_indicios
    FROM Expediente e
    INNER JOIN Usuarios u ON e.Usuarios_id = u.id
    INNER JOIN Estados est ON e.Estados_id = est.id
    WHERE e.Estados_id = @estado_id
    ORDER BY e.fecha_registro DESC;
END
GO

------------------------------------------------------------
-- STORED PROCEDURES - ROLES Y ESTADOS
------------------------------------------------------------

-- Obtener todos los roles
CREATE OR ALTER PROCEDURE sp_ObtenerRoles
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT id, rol FROM Rol ORDER BY id;
END
GO

-- Obtener todos los estados
CREATE OR ALTER PROCEDURE sp_ObtenerEstados
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT id, nombre FROM Estados ORDER BY id;
END
GO

PRINT 'Stored Procedures creados correctamente';
GO
