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

CREATE TABLE `historial_destinos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `destino_id` int(11) NOT NULL,
  `nombre_anterior` varchar(100) NOT NULL,
  `descripcion_anterior` varchar(500) NOT NULL,
  `continente_anterior_id` int(11) NOT NULL,
  `imagen_anterior` varchar(500) DEFAULT NULL,
  `nombre_nuevo` varchar(100) NOT NULL,
  `descripcion_nueva` varchar(500) NOT NULL,
  `continente_nuevo_id` int(11) NOT NULL,
  `imagen_nueva` varchar(500) DEFAULT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `destino_id` (`destino_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

ALTER TABLE `historial_destinos`
  ADD CONSTRAINT `historial_destinos_ibfk_1` FOREIGN KEY (`destino_id`) REFERENCES `destinos` (`id`);

DELIMITER //
CREATE TRIGGER asignar_rol_viajero
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO tiene(id_usuario, id_rol)
    VALUES (NEW.username, 1);
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER auditar_cambios_destino
AFTER UPDATE ON destinos
FOR EACH ROW
BEGIN
    IF OLD.nombre <> NEW.nombre
       OR OLD.descripcion <> NEW.descripcion
       OR OLD.continente_id <> NEW.continente_id
       OR IFNULL(OLD.imagen, '') <> IFNULL(NEW.imagen, '') THEN
        INSERT INTO historial_destinos(
            destino_id,
            nombre_anterior,
            descripcion_anterior,
            continente_anterior_id,
            imagen_anterior,
            nombre_nuevo,
            descripcion_nueva,
            continente_nuevo_id,
            imagen_nueva
        )
        VALUES (
            OLD.id,
            OLD.nombre,
            OLD.descripcion,
            OLD.continente_id,
            OLD.imagen,
            NEW.nombre,
            NEW.descripcion,
            NEW.continente_id,
            NEW.imagen
        );
    END IF;
END //
DELIMITER ;

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

-- Pruebas sugeridas para los triggers
-- 1) Trigger asignar_rol_viajero:
-- INSERT INTO usuarios(username, nombre, password, correo)
-- VALUES ('lau_test', 'Laura Test', 'hash_temporal', 'lau_test@correo.com');
-- SELECT * FROM tiene WHERE id_usuario = 'lau_test';
--
-- 2) Trigger auditar_cambios_destino:
-- UPDATE destinos
-- SET descripcion = 'Descripcion modificada para probar el trigger'
-- WHERE id = 1;
-- SELECT * FROM historial_destinos WHERE destino_id = 1;
