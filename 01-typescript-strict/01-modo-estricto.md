# De la manteca al estricto

## Any y Unknown

En _TypeScript_ cuando queremos volar por los aires los tipos de datos, estamos a acostumbrados a usar el tipo _any_, esto:

- Hay veces que no queda otra y tenemos que usar.
- Otras suele ser un mal olor en el código, que nos indica que algo no estamos haciendo bien, de hecho una metrica rápida para evaluar una base de código es si se hace un uso excesivo de _any_.

```ts
const mensaje: any = "hola";

mensaje = 2;

console.log(mensaje);
```

En versiones más recientes de TypeScript te habrás encontrado con un tipo _primo hermano_ de _any_, el tipo _unknown_, de hecho te habrá pasado al consumir alguna librería que te sale un error un poco raro, en el que te comenta que no puedes asignar un tipo _unknown_ a lo que sea...

¿Qué es el tipo _unknown_? Pues es un tipo que se usa para indicar que no sabemos el tipo de dato que vamos a recibir, y que antes de tener que usarlo tenemos que castear nosotros a un tipo concreto.

Ejemplos con unknown (este con una guarda):

```ts
function procesarValorDesconocido(valor: unknown): void {
  if (typeof valor === "string") {
    // Si 'valor' es una cadena, la convertimos a mayúsculas y la imprimimos
    const cadenaEnMayusculas = (valor as string).toUpperCase();
    console.log(cadenaEnMayusculas);
  } else {
    console.log("El valor no es una cadena.");
  }
}

procesarValorDesconocido("Hola, mundo"); // Imprimirá "HOLA, MUNDO"
procesarValorDesconocido(42); // Imprimirá "El valor no es una cadena."
```

También podemos hacer un casting a lo bruto, pero ojo que tenemos que estar seguros de lo que hacemos:

```ts
function duplicarNumero(valor: unknown): number {
  return (valor as number) * 2;
}

const resultado1 = duplicarNumero(5); // Esto funciona y devuelve 10
console.log(resultado1);
const resultado2 = duplicarNumero("cadena"); // Esto compila, pero arrojará temido NaN
console.log(resultado2);
```

## Strict mode

Otro tema muy interesante es si usar TypeScript en modo estricto o no.

En muchos proyectos trabajamos con TS como si fuera una ayuda para obtener tipado,pero... ¿Y si pudiéramos ir un paso más allá? Por ejemplo:

- No aceptar por defecto que un valor sea `null` o `undefined`.
- No aceptar que una función devuelva _any_ por defecto.
- Que no te dejará imports o variables declaras pero sin utilizar.
- Si trabajas con clases avisarte si un _this_ no está bien enlazado.

Vamos a ver ejemplos :

### Null o undefined

#### Campos nulos o undefined

Partimos de este ejemplo:

```typescript
interface ClienteModel {
  nombre: string;
  apellido: string;
  ciudad: {
    id: number;
    nombre: string;
  };
}

interface ClientViewModel {
  nombre: string;
  apellido: string;
  ciudad: string;
}

const mapClienteModelToViewModel = (
  cliente: clienteModel
): ClientViewModel => ({
  nombre: cliente.nombre,
  apellido: cliente.apellido,
  ciudad: cliente.ciudad.nombre,
});

const resultadoA = mapClienteModelToViewModel({
  nombre: "Pepe",
  apellido: "Perez",
  ciudad: {
    id: 1,
    nombre: "Paris",
  },
});

console.log(resultadoA);
```

¿Todo perfecto no? Vamos a probar un poco más...:

```typescript
const resultadoB = mapClienteModelToViewModel({
  nombre: "Pepe",
  apellido: "Perez",
  ciudad: null,
});

console.log(resultadoB);
```

¿Qué pasa aquí? Pues que el mapper revienta, no puede acceder a la propiedad _nombre_ de _ciudad_ porque es _null_.

¿Qué tendríamos que hacer si no usaramos modo estricto?

- Añadir lógica para chequear si el caso es nulo.
- Añadir pruebas unitarias para cubrir los casos en que pueda ser nulo.

¿Qué pasa en modo estricto? Que no te deja compilar, te avisa de que hay un problema y te obliga a solucionarlo.

> Muy bien pero que pasa si tiro de una API REST que va en "modo gamberro", aquí:

- Podemos modelar entidades de API Rest que acepten nulos etc (utilizando _?_).
- Podemos implementar mappers acordes a la API Rest.
- En el caso de que se salten los contrato, podemos ayudarnos de ZOD para validar los datos que nos llegan.

#### Parámetros nulos o undefined

Seguimos con el mismo ejemplo.

Otro caso más es que el parametro _cliente_ venga a nulo.

```typescript
const clienteC: ClienteModel = null;

const resultadoC = mapClienteModelToViewModel(clienteC);
console.log(resultadoC);
```

En este caso puede parecer fácil, pero en una estructura compleja es fácil que se nos pase algo y tengamos un bombazo cuando ejecutemos el programa (sonríe cuando salgas en la foto con el cliente).

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

```
Type 'null' is not assignable to type 'ClienteModel'.
```

¿Qué nos ahorramos?

- Un castañazo en producción.
- Pruebas unitarias, tu método no admite nulos, si hay opción de que te puedas llegar uno, TypeScript te avisará para que lo controles.

¿Y si realmente queremos poder admitir nulos o undefined? Tenemos dos opciones:

A) Podemos decirle que el tipo es _ClienteModel_ o _null_.

```diff
- const clienteC: ClienteModel = null;
+ const clienteC: ClienteModel | null = null;
```

Esto tufa un poco...

B) Podemos decirle que que sabemos lo que hacemos que no nos de la matraca, para ello usamos la exclamación _!_.

```diff
- const clienteC: ClienteModel | null = null;
+ const clienteC: ClienteModel  = null!;
```

Esto huele mucho a chapuza máxima, es muy normal verlo en Angular por el dilema de inicialización en _constructor_ o _ngInit_

C) Y vamos a por otro chapu, le metemos un comentario para decirle al compilador que no se queje para esa línea de código:

```diff
- const clienteC: ClienteModel  = null!;
+ const clienteC: ClienteModel  = null!; // @ts-ignore
```

Si ves cosas como estás a menudo en el proyecto que has entrado ¡¡ HUYE !!

### Imports muertos

Algo que ya nos suele cantar VSCode en gris, en modo estricto nos lo canta en rojo como fallo.

_b.ts_

```typescript
export const diHola = () => {
  console.log("Hola");
};

export const diAdios = () => {
  console.log("Adios");
};
```

_main.ts_

```typescript
import { diHola, diAdios } from "./b";

diHola();
```

Si no usamos _diAdios_ en _main.ts_ nos lo canta como error.

### Parametros opcionales más seguros

Volvemos al _diHola_, apaga el modo estricto y vamos a ver los fuego artificiales:

```typescript
interface Persona {
  nombre: string;
  apellido: string;
}

const diHola = (persona?: Persona) => {
  console.log(`Hola ${persona.nombre}`);
};

diHola(null);
```

En modo estricto nos avisa podemos jugar y poner que acepta nulo (también podríamos poner un valor seguro por defecto), y en código podemos meter un if para tratar el caso arisa.

```typescript
const diHola = (persona?: Persona | null) => {
  if (persona) {
    console.log(`Hola ${persona.nombre}`);
  } else {
    console.log(`Que Hola ni hostias... identifícate`);
  }
};
```

### Casting específicos

### Comprobaciones de tipo más estrictas

Esto a veces puede ser un poco latoso, por ejemplo: hay plugins que extienden el objeto Windows y le añaden propiedades, por ejemplo _redux devtools_, añaden una propiedad **_REDUX_DEVTOOLS_EXTENSION_** a objeto windows.

¿Cómo accedemos sin modo estricto? Utilizando los corchetes:

```typescript
const reduxDevTools = window["__REDUX_DEVTOOLS_EXTENSION__"];

console.log(reduxDevTools);
```

¿Qué pasa si probamos esto con Typescript en modo estricto? Qué me dice que me _peine_

En TypeScript, cuando estás en modo estricto, no puedes acceder a propiedades de window utilizando notación de corchetes (window['propiedad']) de la misma manera que lo harías en JavaScript puro. Esto es porque TypeScript verifica en tiempo de compilación que las propiedades a las que intentas acceder existen en el tipo Window, y si no existen, te dará un error.

¿Que podemos intentar?

Intentar hacer un casting del objeto _window_ como _any_ a lo burro:

```typescript
const reduxDevTools = (window as any)["__REDUX_DEVTOOLS_EXTENSION__"];

console.log(reduxDevTools);
```

Otra opción es extender del objeto Window:

```typescript
interface CustomWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
}

const reduxDevTools = (window as unkown as CustomWindow)[
  "__REDUX_DEVTOOLS_EXTENSION__"
];
console.log(reduxDevTools);
```

## TsConfig adicionales

Aquí podemos añadir unas propiedades adicionales en el _tsconfig.json_

```diff
    "strict": true,
+    "noUnusedLocals": true,
+    "noUnusedParameters": true,
+    "noFallthroughCasesInSwitch": true
```

### Variables que no se usan

Lo mismo pasa si tenemos una variable o función que no se usa:

```typescript
const diHola = () => {
  const hora = new Date().getHours();

  console.log("Hola");
};
```

### Parámetros que no se usan

Un tema que puede hacer pupa, es que también se queja si no usas un parámetro de una función:

```typescript
const diHola = (nombre: string) => {
  console.log("Hola");
};
```

Esto puede ser un rollo, si por ejemplo tenemos un event callback con un parametro que vamos a ignorar pero que hace falta para la firma, ¿Qué podemos hacer? Con \_ le indicamos que ahí está el parámetro pero que no lo vamos a usar.

```typescript
const diHola = (_: string) => {
  console.log("Hola");
};
```
