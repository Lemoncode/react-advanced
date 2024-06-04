# 01 Drop Card

Vamos a implementar el area de drop en las cards, así podremos interecalar cards al soltaras.

## Paso a paso

Partimos del ejemplo anterior, lo copiamos, instalamos dependencias y ejecutamos el proyecto.

```bash
npm install
```

```bash
npm run dev
```

Para hacernos más fácil buscar en que columna queremos hacerle el drop a la card, vamos a pasar el id de la columna al componente card:

```tsx

```

```tsx

```

Ahora que lo tenemos lo único que tenemos que hacer es quitar el drop de la columna y pasarlo a la card (informandole la columna).

Ya con esto debería de funcionar (le estamos pasando exactamente la misma informacíon al monitor de drag and drop que tenemos en el container).

Probamos

```
npm run dev
```

Parece que fucniona, peeeerooo si soltamos al card en el fondo de la columna podemos ver que no se hace el drop ¿Qué pasa aquí? Pues que ahí no ha zona de drop, lo arreglamos creando una especia de card vacía en el fondo de la columna que ocupe todo el espacio libre.

Vamos a hacer un cosa la pintamos de un color para que se distinga, despues le aplicaremos color transparente.

```tsx

```

Ahora probamos y a lo tenemos.

Vamos a poner el color transparente

```tsx

```

Siguientes pasos, ... el objetivo de este ejemplo es que te familiarices con esta librería de drag & drop, ¿Cómo se podría mejorar?

- En los cards definiendo dos areas de drop, una que haga que suelte la card arriba y otra que la suelte abajo.
- Implementando el scroll automático cuando se acerque a los bordes de la pantalla.
- Haciendo el drag and drop accesible.
- ...
