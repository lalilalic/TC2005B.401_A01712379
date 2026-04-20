DROP DATABASE IF EXISTS `viajes`;
CREATE DATABASE `viajes`;
USE `viajes`;

CREATE TABLE `destinos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `continente_id` int(11) NOT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `continente_id` (`continente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

INSERT INTO `destinos` (`nombre`, `descripcion`, `continente_id`, `imagen`) VALUES
('Marruecos', 'País del norte de África lleno de colores, especias y medinas laberínticas.', 1, NULL),
('Madrid', 'Capital de España, ciudad vibrante con museos, gastronomía y mucha vida.', 2, NULL),
('Toronto', 'Ciudad multicultural de Canadá con rascacielos, lagos y diversidad cultural.', 3, NULL),
('Puerto Escondido', 'Paraíso costero en Oaxaca, México, famoso por sus olas y atardeceres.', 4, NULL),
('Barcelona', 'Ciudad costera española con arquitectura de Gaudí y ambiente mediterráneo.', 2, NULL);

CREATE TABLE `continentes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `continente` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

INSERT INTO `continentes` (`continente`) VALUES
('África'),
('Europa'),
('América del Norte'),
('América del Sur'),
('América Central'),
('Asia'),
('Oceanía');

ALTER TABLE `destinos`
  ADD CONSTRAINT `destinos_ibfk_1` FOREIGN KEY (`continente_id`) REFERENCES `continentes` (`id`);

-- Tabla de auditoría para guardar acciones realizadas sobre destinos
CREATE TABLE IF NOT EXISTS auditoria_destinos (
    id INT AUTO_INCREMENT PRIMARY KEY, -- identificador único del registro de auditoría
    accion VARCHAR(50) NOT NULL,       -- tipo de acción realizada: INSERT, DELETE, etc.
    destino_id INT,                    -- id del destino afectado
    nombre_destino VARCHAR(100),       -- nombre del destino afectado
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha y hora en que ocurrió la acción
    usuario VARCHAR(100) DEFAULT 'sistema'     -- usuario responsable de la acción
);

-- Trigger que registra en auditoría cada nuevo destino insertado
DELIMITER //
CREATE TRIGGER trg_after_insert_destino
AFTER INSERT ON destinos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_destinos (accion, destino_id, nombre_destino)
    VALUES ('INSERT', NEW.id, NEW.nombre);
END;
//
DELIMITER ;

-- Trigger que registra en auditoría cada destino antes de ser eliminado
DELIMITER //
CREATE TRIGGER trg_before_delete_destino
BEFORE DELETE ON destinos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_destinos (accion, destino_id, nombre_destino)
    VALUES ('DELETE', OLD.id, OLD.nombre);
END;
//
DELIMITER ;

-- Tablas de usuarios y permisos (igual que el profe)
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

INSERT INTO `roles` (`nombre_rol`) VALUES ('viajero'), ('administrador');

CREATE TABLE `privilegios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_privilegio` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

INSERT INTO `privilegios` (`nombre_privilegio`) VALUES ('ver_destinos'), ('crear_destinos');

CREATE TABLE `posee` (
  `id_rol` int(11) NOT NULL,
  `id_privilegio` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_rol`, `id_privilegio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

INSERT INTO `posee` (`id_rol`, `id_privilegio`) VALUES (1, 1), (2, 1), (2, 2);

CREATE TABLE `usuarios` (
  `username` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

CREATE TABLE `tiene` (
  `id_usuario` varchar(50) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`, `id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

ALTER TABLE `tiene`
  ADD CONSTRAINT `tiene_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`username`),
  ADD CONSTRAINT `tiene_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`);

-- Procedimiento para obtener todos los destinos
DELIMITER //
CREATE PROCEDURE obtener_destinos()
BEGIN
    SELECT * FROM destinos;
END //
DELIMITER ;

-- Procedimiento para insertar un nuevo destino
DELIMITER //
CREATE PROCEDURE insertar_destino(
    IN mi_nombre VARCHAR(100),
    IN mi_descripcion VARCHAR(500),
    IN mi_continente_id INT,
    IN mi_imagen VARCHAR(500)
)
BEGIN
    INSERT INTO destinos(nombre, descripcion, continente_id, imagen)
    VALUES (mi_nombre, mi_descripcion, mi_continente_id, mi_imagen);
END //
DELIMITER ;

-- Procedimiento para editar un destino existente
DELIMITER //
CREATE PROCEDURE editar_destino(
    IN mi_id INT,
    IN mi_nombre VARCHAR(100),
    IN mi_descripcion VARCHAR(500),
    IN mi_continente_id INT,
    IN mi_imagen VARCHAR(500)
)
BEGIN
    UPDATE destinos 
    SET nombre = mi_nombre, 
        descripcion = mi_descripcion, 
        continente_id = mi_continente_id, 
        imagen = mi_imagen
    WHERE id = mi_id;
END //
DELIMITER ;

-- Prueba del trigger AFTER INSERT
INSERT INTO destinos (nombre, descripcion, continente_id, imagen)
VALUES ('Paris', 'Ciudad famosa por la Torre Eiffel', 2, NULL);

SELECT * FROM auditoria_destinos WHERE accion = 'INSERT';

-- Prueba del trigger BEFORE DELETE
DELETE FROM destinos WHERE nombre = 'Paris';

SELECT * FROM auditoria_destinos WHERE accion = 'DELETE';
