# Lab Remove Card

Ahora que lo tenemos todo más o menos organizado toca ir practicando y añadiendo funcionalidad. En este caso vamos a añadir la posibilidad de eliminar una tarjeta.

## Punto de partida

Vamos a partir justo del paso anterior.

Y vamos a añadir un botón en la card para borrarla (no vamos a preocuparnos de look & feel)

En la card añadimos un botón (si después quiere darle con el _martillo fino_ cambialo por un icono y pon un modal para confirmar la acción)

_./src/kanban.components/card/card.component.tsx_

```diff
<div ref={drop}>
  <div ref={ref}>
    <div ref={drag} className={classes.card} style={{ opacity }}>
      {content.title}
+     <button>Borrar</button>
    </div>
  </div>
</div>
```

Vamos hacer un justify del contenido para que hay algo de separación entre el título y el botón:

_./src/kanban.components/card/card.component.module.css_

```diff
.card {
  border: 1px dashed gray; /* TODO: review sizes, colors...*/
  padding: 5px 15px;
  background-color: white;
  width: 210px;
  display: flex;
+ justify-content: space-between;
}  
``````

## Pistas

## Solución
