USE lol;

DELETE FROM personajes;
DELETE FROM tipo;

INSERT INTO tipo (id, tipo) VALUES
(1, 'heroe'),
(2, 'princesa'),
(3, 'villano'),
(4, 'companero');

INSERT INTO personajes (id, nombre, descripcion, tipo_id, imagen) VALUES
(1, 'Mario', 'Heroe del Reino Champinon que rescata a Peach y enfrenta a Bowser.', 1, '/img/mario.svg'),
(2, 'Peach', 'Princesa del Reino Champinon y una de las figuras mas importantes del reino.', 2, '/img/peach.svg'),
(3, 'Bowser', 'Villano principal de la saga y rey de los Koopas.', 3, '/img/bowser.svg'),
(4, 'Yoshi', 'Companero fiel de Mario que lo ayuda en sus aventuras.', 4, '/img/yoshi.svg');

ALTER TABLE tipo AUTO_INCREMENT = 5;
ALTER TABLE personajes AUTO_INCREMENT = 5;
