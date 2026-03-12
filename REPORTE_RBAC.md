# Revisión del proyecto con respecto a la práctica de RBAC

## 1. Soporte del modelo en base de datos

### Ya estaba correcto
- La base de datos ya incluía las tablas `roles`, `privilegios`, `tiene` y `posee`.
- La relación entre usuarios, roles y privilegios ya seguía el modelo RBAC básico.
- Ya existían llaves primarias y llaves foráneas para `tiene` y `posee`.

### Faltaba o estaba incompleto
- Sólo existían dos privilegios, lo que no alcanzaba para cubrir todos los accesos reales de la aplicación.
- Hacían falta más datos de prueba para verificar varios escenarios de permisos.
- Los usuarios nuevos no recibían automáticamente un rol, así que podían quedar fuera del modelo.

### Se corrigió
- Se agregaron los privilegios `editar_personajes` y `administrar_rbac`.
- Se agregó el rol `editor`.
- Se agregaron más asignaciones de roles y privilegios.
- Se agregó un usuario extra de prueba.
- Al registrar un usuario nuevo, se le asigna automáticamente el rol `invocador`.

## 2. Obtener permisos al autenticar

### Ya estaba correcto
- En el login ya se validaba el usuario y la contraseña.
- Después de autenticarse, ya se consultaban los permisos desde la base de datos.
- Los permisos ya se guardaban en sesión.

### Faltaba o estaba incompleto
- No se estaban guardando los roles del usuario en sesión.
- La consulta de permisos podía devolver repetidos si un usuario heredaba el mismo permiso desde más de un rol.

### Se corrigió
- Ahora también se consultan y almacenan los roles del usuario.
- La consulta de permisos usa `DISTINCT`.

## 3. Interfaz gráfica dinámica según permisos

### Ya estaba correcto
- La vista de listado ya ocultaba el botón de crear si el usuario no tenía `crear_personajes`.

### Faltaba o estaba mal
- El menú superior no estaba construido según permisos.
- El botón de editar aparecía siempre, aunque la ruta estuviera protegida.
- No existía una vista visible dentro del sistema con la explicación teórica pedida por el profesor.

### Se corrigió
- El menú ahora muestra enlaces según permisos.
- El botón de editar sólo aparece si el usuario tiene `editar_personajes`.
- Se agregó la vista `/users/info` con la explicación de RBAC y la comparación entre un sistema con RBAC y otro sin RBAC.

## 4. Validar el permiso requerido en cada ruta

### Ya estaba correcto
- Las rutas de personajes ya exigían autenticación.
- Existían middlewares para `ver_personajes` y `crear_personajes`.

### Faltaba o estaba mal
- La edición usaba el middleware de crear, no uno específico para editar.
- No existía una validación para administrar la parte de RBAC.
- La lógica de permisos estaba duplicada en varios archivos.

### Se corrigió
- Se creó un middleware reutilizable para validar cualquier permiso.
- Se agregó `can-edit` para `editar_personajes`.
- Se agregó `can-admin` para `administrar_rbac`.
- Las rutas de administración RBAC quedaron protegidas por autenticación y permiso.

## 5. Interfaz para administrar roles y permisos

### Antes
- No existía.

### Ahora
- Existe la vista `/users/rbac`.
- Permite asignar un rol a un usuario.
- Permite asignar un privilegio a un rol.
- Muestra tablas de usuarios con roles y roles con privilegios.

## Conclusión

El proyecto ya tenía una base RBAC parcial, pero no cumplía completo con la práctica. Después de los cambios realizados, ahora sí cubre los puntos principales de la consigna:

- Soporte RBAC en base de datos.
- Datos suficientes para probar distintos permisos.
- Obtención de permisos al autenticar.
- Interfaz dinámica según permisos.
- Validación de permisos en rutas.
- Interfaz básica de administración de asignaciones.
- Parte teórica dentro de la aplicación.

## Respuesta teórica

### ¿En qué consiste el control de acceso basado en roles?

RBAC es un modelo de control de acceso donde los permisos se asignan a roles y los roles se asignan a usuarios. Así, en lugar de configurar permisos usuario por usuario, se administran por grupos lógicos de responsabilidades. Esto simplifica la administración y mejora la consistencia de seguridad.

### Sistema que sí aplica RBAC

Un sistema hospitalario es un buen ejemplo. Puede haber roles como médico, enfermería, recepción y administrador. Cada rol tiene permisos específicos según su trabajo.

#### Ventajas
- Administración centralizada.
- Menor probabilidad de errores.
- Mejor escalabilidad.
- Más facilidad para auditoría.

#### Desventajas
- Si los roles se diseñan mal, pueden quedar rígidos.
- A veces se requieren más roles o reglas adicionales para casos especiales.

### Sistema que no aplica RBAC

Una aplicación pequeña que asigna permisos manualmente a cada usuario, sin roles intermedios.

#### Ventajas
- Puede ser simple de arrancar en sistemas muy pequeños.
- Da control directo usuario por usuario.

#### Desventajas
- Es difícil de mantener.
- Se vuelve inconsistente con muchos usuarios.
- Escala mal.
- Complica la auditoría de accesos.
