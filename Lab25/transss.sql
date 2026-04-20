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

ALTER TABLE `posee`
  ADD CONSTRAINT `posee_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `posee_ibfk_2` FOREIGN KEY (`id_privilegio`) REFERENCES `privilegios` (`id`);

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

-- Agregamos más destinos para tener más datos
INSERT INTO `destinos` (`nombre`, `descripcion`, `continente_id`, `imagen`) VALUES
('Sierra Nevada', 'Cadena montañosa en España perfecta para esquiar y hacer senderismo.', 2, NULL),
('Mallorca', 'Isla española en el Mediterráneo famosa por sus playas cristalinas.', 2, NULL),
('Waterloo', 'Ciudad histórica de Bélgica famosa por la batalla de Napoleón.', 2, NULL),
('CDMX', 'Ciudad de México, megalópolis llena de cultura, gastronomía y arte.', 4, NULL),
('San Miguel de Allende', 'Ciudad colonial mexicana famosa por su arquitectura y festivales.', 4, NULL),
('Michoacán', 'Estado mexicano con mariposas monarca, artesanías y paisajes naturales.', 4, NULL),
('Tokio', 'Capital de Japón, mezcla perfecta de tradición y modernidad.', 6, NULL),
('Bali', 'Isla indonesa famosa por sus templos, arrozales y playas paradisiacas.', 6, NULL),
('Nueva York', 'La ciudad que nunca duerme, famosa por Times Square y Central Park.', 3, NULL),
('París', 'Ciudad del amor, famosa por la Torre Eiffel y su gastronomía.', 2, NULL),
('Roma', 'Ciudad eterna llena de historia, arte y gastronomía increíble.', 2, NULL),
('Sydney', 'Ciudad australiana famosa por su ópera y playas espectaculares.', 7, NULL);

-- Agregamos usuarios de ejemplo
INSERT INTO `usuarios` (`username`, `nombre`, `password`, `correo`) VALUES
('lau123', 'Laura', '$2b$12$Trhu5g8emvTgIH577h4XuO0vT3t97RPbDe6ZduHrADdgepTYc0Nha', 'lau@gmail.com'),
('admin123', 'Administrador', '$2b$12$Trhu5g8emvTgIH577h4XuO0vT3t97RPbDe6ZduHrADdgepTYc0Nha', 'admin@gmail.com');

INSERT INTO `tiene` (`id_usuario`, `id_rol`) VALUES
('lau123', 1),
('admin123', 2);

-- Transacciones

-- 1.- Actualizar la descripcion de todos los destinos de Europa.
-- Si todo sale bien se confirma con COMMIT.
START TRANSACTION;

UPDATE destinos
SET descripcion = CONCAT(descripcion, ' - Visitado')
WHERE continente_id = 2;

COMMIT;

-- Verificacion: todos los destinos de Europa deben tener - Visitado
SELECT * FROM destinos WHERE continente_id = 2;


-- 2.- Insertar un nuevo destino y actualizar el continente relacionado.
-- Operacion que involucra dos tablas.
START TRANSACTION;

INSERT INTO destinos (nombre, descripcion, continente_id, imagen)
VALUES ('Cancún', 'Destino turístico mexicano famoso por sus playas y vida nocturna.', 5, NULL);

UPDATE continentes
SET continente = 'América Central y Caribe'
WHERE id = 5;

COMMIT;

-- Verificacion.
SELECT * FROM destinos WHERE nombre = 'Cancún';
SELECT * FROM continentes WHERE id = 5;


-- 3.- Ejemplo de ROLLBACK
-- Intentar cambiar el nombre de un continente y cancelar.
START TRANSACTION;

UPDATE continentes
SET continente = 'Continente Temporal'
WHERE id = 1;

ROLLBACK;

-- Verificacion: debe seguir siendo África.
SELECT * FROM continentes WHERE id = 1;


-- 4.- Uso de SAVEPOINT
-- Actualizar dos destinos, deshacer uno y confirmar el otro.
START TRANSACTION;

UPDATE destinos
SET descripcion = 'Descripción actualizada de Marruecos.'
WHERE nombre = 'Marruecos';

SAVEPOINT punto1;

UPDATE destinos
SET descripcion = 'Descripción actualizada de Tokio.'
WHERE nombre = 'Tokio';

ROLLBACK TO punto1;

COMMIT;

-- Verificacion:
-- Marruecos SI cambia
-- Tokio NO cambia
SELECT * FROM destinos WHERE nombre IN ('Marruecos', 'Tokio');


-- 5.- Eliminar un destino y restaurar con ROLLBACK.
START TRANSACTION;

DELETE FROM destinos
WHERE nombre = 'Cancún';

ROLLBACK;

-- Verificacion: Cancún debe seguir existiendo.
SELECT * FROM destinos WHERE nombre = 'Cancún';


-- 6.- Actualizacion en varias tablas
-- Cambiar nombre de continente y registrar un nuevo destino relacionado.
START TRANSACTION;

UPDATE continentes
SET continente = 'Oceanía y Pacífico'
WHERE id = 7;

INSERT INTO destinos (nombre, descripcion, continente_id, imagen)
VALUES ('Auckland', 'Ciudad de Nueva Zelanda famosa por sus volcanes y cultura maorí.', 7, NULL);

COMMIT;

-- Verificacion.
SELECT * FROM continentes WHERE id = 7;
SELECT * FROM destinos WHERE nombre = 'Auckland';

-- Consultas de apoyo.
SELECT COUNT(*) AS total_destinos FROM destinos;
SELECT COUNT(*) AS total_continentes FROM continentes;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_roles FROM roles;
