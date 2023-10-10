# De la manteca al estricto

## Any y Unknown

## Strict mode

Otro tema muy interesante es si usar TypeScript en modo estricto o no.

En muchos proyectos trabajamos con TS como si fuera una ayuda para obtener tipado,pero... ¿Y si pudiéramos ir un paso más allá? Por ejemplo:

- No aceptar por defecto que un valor sea `null` o `undefined`.
- No aceptar que una función devuelva _any_ por defecto.
- Que no te dejará imports o variables declaras pero sin utilizar.
- Si trabajas con clases avisarte si un _this_ no está bien enlazado.

Vamos a ver ejemplos :

### Null o undefined

Partimos de este ejemplo:

```typescript
interface clienteModel {
  nombre: string;
  apellido: string;
  ciudad: {
    id: number;
    nombre: string;
  };
}

interface clientViewModel {
  nombre: string;
  apellido: string;
  ciudad: string;
}

const mapClienteModelToViewModel = (
  cliente: clienteModel
): clientViewModel => ({
  nombre: cliente.nombre,
  apellido: cliente.apellido,
  ciudad: cliente.ciudad.nombre,
});

const resultadoA = mapClienteModelToViewModel({
  nombre: "Pepe",
  apellido: "Perez",
  ciudad: {
    id: 1,
    nombre: "Madrid",
  },
});

console.log(resultadoA);
```

¿Todo perfecto no? Vamos a probar un poco más...:

```typescript
const resultadoB = mapClienteModelToViewModel({
  nombre: "Pepe",
  apellido: "Perez",
  ciudad: null;
});

console.log(resultadoB);
```

¿Qué pasa aquí? Pues que el mapper revienta, no puede acceder a la propiedad _nombre_ de _ciudad_ porque es _null_.

¿Qué tendríamos que hacer?

- Añadir lógica para chequear si el caso es nulo.
- Añadir pruebas unitarias para cubrir los casos en que pueda ser nulo.

Otro caso más es que el parametro _cliente_ venga a nulo.

```typescript
const clienteC: ClienteModel = null;

const resultadoC = mapClienteModelToViewModel(clienteC);
console.log(resultadoC);
```

En este caso puede parecer fácil, pero en una estructura compleja es fácil que se nos pase algo y tengamos un bombazo cuando ejecutemos el programa (sonrie cuando salgas en la foto con el cliente).

¿Y si cambiamos esto a modo estricto?

_tsconfig.json_

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Ahora este código nos avisa de que hay cosas mal, las podemos arreglar.

```diff

```

¿Qué nos ahorramos?

- Un castañazo en producción.
- Pruebas unitarias, tu método no admite nulos, si hay opción de que te puedas llegar uno, TypeScript te avisará para que lo controles.

¿Y si realmente queremos poder admitir nulos o undefined? Tenemos que tiparlo explicitamente:

# Hacks en modo estricto

Si por lo que sea te quieres saltar un chequeo estricto, podemos hacerlo de dos formas:

En el caso de que queramos que una variable pueda ser nula, podemos usar el operador _!_.

Y para los parámetros:

... Esto pasa mucho en Angular, donde tienes un constructor y ngOnInit, resulta que aunque inicializas las variables miembro en ngOnInit, en el constructor no está la inicialización y Angular se queja.

En general utilizar estos hacks es un mal olor y hay que evitarlo en la medida de lo posible.
