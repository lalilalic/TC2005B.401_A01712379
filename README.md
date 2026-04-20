# TC2005B.401_A01712379
Software Construction Project

-- Respuestas teóricas
-- 1. ¿Qué utilidad tiene un trigger?
-- Un trigger sirve para automatizar acciones dentro de la base de datos cuando ocurre un evento
-- como INSERT, UPDATE o DELETE. Sus ventajas son mantener la integridad de los datos,
-- registrar auditorías, aplicar reglas de negocio y evitar tareas manuales repetitivas.

-- 2. ¿Tipos de triggers?
-- Los tipos más comunes son BEFORE y AFTER, y se pueden ejecutar sobre eventos
-- INSERT, UPDATE y DELETE.
-- Ejemplos:
-- BEFORE INSERT
-- AFTER INSERT
-- BEFORE UPDATE
-- AFTER UPDATE
-- BEFORE DELETE
-- AFTER DELETE

-- 3. ¿En qué casos no son de utilidad?
-- No son convenientes cuando la lógica es muy compleja, cuando pueden afectar el rendimiento,
-- cuando dificultan el mantenimiento del sistema o cuando la lógica se entiende y controla
-- mejor desde la aplicación en lugar de ocultarla dentro de la base de datos.
