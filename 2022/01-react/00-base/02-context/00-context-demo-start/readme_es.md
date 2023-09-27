# Contexto - Buenas prácticas

## Partida

Punto de partida de la demo de contexto.

Que estamos usando aquí:

- Un contexto para almacenar el nombre del usuario logado.
- Lo recogemos en la ventana de login.
- Lo mostramos en la cabecera del layout de la aplicación.

- Por otro lado
  - Estamos cargando una lista de usuarios miembros de una organización (Git)
  - Podemos navegar a una tercera página (detalle usuario)
  - Al volver no se muestra la lista de usuarios, esta se pierde
    y volvemos a cargar los datos.

## Donde queremos llegar

Vamos a hacer el siguiente refactoring:

- Vamos reorganizar el contexto de login.

- Vamos a refactorizar la carga de los miembros de Git, de
  forma que los datos anteriores se queden en contexto y
  cuando vuelva a la página tenga respuesta inmediata.
