# 00 Rendering condicional

## Resumen

Un escenario muy común que nos encontramos cuando desarrollamos una aplicación
es que ciertos componentes se tienen que mostrar o no dependiendo de ciertas
condiciones.

Esto de primeras puede resultar muy obvio, puede usar el operador and _&&_,
indicar la condición y después el markup que se tendría que mostrar si
la condición es true.

Está "facilidad" nos puede llevar a grandes quebradores de cabeza:

- En algunos casos la condición puede cortocircuitar de forma erronea.
- En otros casos nuestro código puede ser muy difícil de leer y mantener,
  sobre todo cuando tienes que anidar varios condicionales.

En estos ejemplos vamos 

## Paso a Paso

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```
