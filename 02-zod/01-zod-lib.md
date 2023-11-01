# El problema

Cuando desarrollamos un Front, lo normal es que nos tengamos que integrar con un Back, y seguro que nos prometemos o prometen:

- Que vamos a tener un swagger.
- Que están claros los contratos.
- Que no van a cambiar los datos.
- Que podemos crear un mock para trabajar en paralelo.
- Que los reyes magos existen...

Pero después nos encontramos que:

- El swagger se autogenera cada vez que se compila el back y muchas veces se nos pasa comunicar cambios.
- Los datos de desarrollo suelen tener baja calidad.
- Los datos no cumplen con lo que esperabamos (algo tan tonto como asegurarte que un NIF siempre va a venir informado como 8 numero y una letra, sin espacios, guiones, puntos...)

Y al final nuestro Front revienta y no sabemos de donde viene el fuego amigo, y sabes lo peor... Qué TypeScript puede hacer poco ahí, a ti lo que te llega del servidor es un JSON y le metes un casting a las bravas suponiendo que está bien.

# Validación de datos

Zod es una librería TypeScript-first de declaración y validación de esquemas de datos.

Es más sencilla, y natural que sar JSON Schema y trae mas funcionalidades y además nos permite generar el modelo a partir del ZOD que hayamos definido.

Vamos a ver tanto la opción de JSON Schema como la de ZOD en acción.

Partamos de un ejemplo, tenemos la ficha de un paciente de un hospital:

```typescript
  {
    NIF: "12345678A",
    nombre: "Juan",
    apellidos: "Gómez Pérez",
    edad: 45,
    fechaNacimiento: new Date("1978-05-20"),
    alergias: ["Polen", "Penicilina"],
    medicacion: ["Aspirina", "Ibuprofeno"],
    medidasPresionArterial: [
      {
        fechaHora: new Date("2023-01-15T08:30:00"),
        sistolica: 120,
        diastolica: 80,
      },
      {
        fechaHora: new Date("2022-09-10T14:15:00"),
        sistolica: 130,
        diastolica: 85,
      },
    ],
  },
```

Tenemos la siguientes restricciones:

- NIF es un string de 9 caracteres, los 8 primeros son números y el último una letra.
- Nombre y apellidos son strings y deben de informarse.
- Edad es un número entero entre 0 y 150.
- Fecha de nacimiento es una fecha válida.
- Alergias y medicación son arrays de strings y pueden venir vacío o null.
- Medidas de presión arterial es un array de objetos con fechaHora, sistolica y diastolica. FechaHora es una fecha válida, sistolica y diastolica son números enteros entre 0 y 300 y deben venir informados.
- El array de medidas de presión arterial puede venir vacío o null.

## JSON Schema

Esto lo podemos definir con un JSON Schema, sería algo así como:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "ID": {
      "type": "integer"
    },
    "NIF": {
      "type": "string",
      "pattern": "^[0-9]{8}[A-Z]$"
    },
    "nombre": {
      "type": "string",
      "minLength": 1
    },
    "apellidos": {
      "type": "string",
      "minLength": 1
    },
    "edad": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "fechaNacimiento": {
      "type": "string",
      "format": "date-time"
    },
    "alergias": {
      "type": ["array", "null"],
      "items": {
        "type": "string"
      }
    },
    "medicacion": {
      "type": ["array", "null"],
      "items": {
        "type": "string"
      }
    },
    "medidasPresionArterial": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "fechaHora": {
            "type": "string",
            "format": "date-time"
          },
          "sistolica": {
            "type": "number",
            "minimum": 0,
            "maximum": 200
          },
          "diastolica": {
            "type": "number",
            "minimum": 0,
            "maximum": 200
          }
        },
        "required": ["fechaHora", "sistolica", "diastolica"]
      }
    }
  },
  "required": [
    "NIF",
    "nombre",
    "edad",
    "fechaNacimiento",
    "medidasPresionArterial"
  ]
}
```

En TypeScript lo podemos modelar como:

```typescript
interface MedidaPresionArterial {
  fechaHora: string;
  sistolica: number;
  diastolica: number;
}

interface Paciente {
  NIF: string;
  nombre: string;
  edad: number;
  fechaNacimiento: string;
  alergias: string[] | null;
  medicacion: string[] | null;
  medidasPresionArterial: MedidaPresionArterial[];
}
```

Un ejemplo de un paciente sería:

```ts
 {
    NIF: "12345678A",
    nombre: "Juan",
    edad: 45,
    fechaNacimiento: "1978-05-20T00:00:00.000Z",
    alergias: ["Polen", "Penicilina"],
    medicacion: ["Aspirina", "Ibuprofeno"],
    medidasPresionArterial: [
      {
        fechaHora: "2023-01-15T08:30:00.000Z",
        sistolica: 120,
        diastolica: 80,
      },
      {
        fechaHora: "2022-09-10T14:15:00.000Z",
        sistolica: 130,
        diastolica: 85,
      },
    ],
  },
```

Hasta aquí todo de color de rosa, tenemos ya un JSON Server para simular una API Rest y vamos a traernos datos,

```ts
const getPaciente = async (id: number): Promise<Paciente> => {
  const response = await fetch(`${API_URL}/pacientes/${id}`);
  const paciente = await response.json();
  return paciente;
};
```

E imaginate que nos hace falta extraer el número del NIF y la letra, como hemos acordado con Backend que siempre va a venir en el formato 8 números y una letra, pues lo hacemos así:

```ts
const paciente = await getPaciente(1);
const nif = paciente.NIF;
const numero = nif.substring(0, 8);
const letra = nif.substring(8, 9);
console.log(numero, letra);
```

Peeero... resulta que se hizo una importación de datos de un sistema de terceros y digamos que a alguien se le olvidó ese pequeño de datos y los datos vienen tal que así:

```
"123456768 Z"
"123456768-Z"
"123.456.768 Z"
"123.456.768+Z"
"No tiene"
"1 23 45 768 Z"
"."
// ...
```

Y "más combinaciones infernales", ¿Se puede controlar? Si, ... pero ya no es directo y sencillo, y si nos habían asegurado que el formato era otro, ¿Qué pasa? Pues que el Front revienta, y no sabemos de donde viene el fuego amigo.

Vamos a ver que pasaría si le pasamos si validamos con nuestro JSON Schema:

Podemos instalar la librería _ajv_ (Another JSON Schema Validator) y hacer algo así:

```bash
npm install ajv
```

```ts
import Ajv from "ajv";

const ajv = new Ajv();
const validate = ajv.compile(schema);
const valid = validate(paciente);
if (!valid) {
  console.log(validate.errors);
  // Aquí podemos:
  //  - Si estamos en desarrollo sacar un aviso por consola, y por ejemplo loggearlo o mostrar un aviso.
  //  - Si estamos en producción, ver como gestionar el problema (degradación, mostrar un mensaje de error, ...) y enviarlo a un sistema de log.
}
```

¿Qué hecho de menos aquí? Por un lado tener que aprender a validar con JSON Schema (hay tooling, aunque no es tan natural como ZOD), por otro lado tener que definir el modelado (aunque existe tooling para generar lel modelo a partir del JSON Schema)

## ZOD

Vamos a ver como lo haríamos con ZOD, primero instalamos la librería:

```bash
npm install zod
```

Y ahora vamos a definir el modelo:

```ts
import { z } from "zod";

const MedidaPresionArterial = z.object({
  fechaHora: z.date(),
  sistolica: z.number().min(0).max(200),
  diastolica: z.number().min(0).max(200),
});

const Paciente = z.object({
  NIF: z.string().regex(/^[0-9]{8}[A-Z]$/),
  nombre: z.string().min(1),
  edad: z.number().int().min(0).max(150),
  fechaNacimiento: z.date(),
  alergias: z.array(z.string()).nullable(),
  medicacion: z.array(z.string()).nullable(),
  medidasPresionArterial: z.array(MedidaPresionArterial),
});
```

Y ahora podemos validar:

```ts
const paciente = await getPaciente(1);

try {
  Paciente.parse(paciente);
} catch (error) {
  console.log(error);
  // Aquí podemos:
  //  - Si estamos en desarrollo sacar un aviso por consola, y por ejemplo loggearlo o mostrar un aviso.
  //  - Si estamos en producción, ver como gestionar el problema (degradación, mostrar un mensaje de error, ...) y enviarlo a un sistema de log.
}
```

Si no queremos que suelte una excepción, podemos usar el método _safeParse_:

```ts
const paciente = await getPaciente(1);

const result = Paciente.safeParse(paciente);
if (!result.success) {
  console.log(result.error);
  // Aquí podemos:
  //  - Si estamos en desarrollo sacar un aviso por consola, y por ejemplo loggearlo o mostrar un aviso.
  //  - Si estamos en producción, ver como gestionar el problema (degradación, mostrar un mensaje de error, ...) y enviarlo a un sistema de log.
}
```

Ahora vienen varios temas interesantes de ZOD, puede inferir sacar los interfaces de TypeScript a partir de un esquema de ZOD:

```ts
type MedidaPresionArterial = z.infer<typeof MedidaPresionArterial>;
type Paciente = z.infer<typeof Paciente>;
```

Esto no esta mal, ¿Pero y al contrario? ¿Podemos generar un esquema de ZOD a partir de un interface de TypeScript? Hay varias librerías para ello, una es _@runtpying/zod_

vamos a crear un proyecto nuevo:

```bash
npm init
```

Añadimos un tsconfig estandar

```json

```

Creamos debejamos de la carpeta model un fichero _paciente.ts_ con el siguiente contenido:

_./src/model/paciente.model.ts_

```ts
interface MedidaPresionArterial {
  fechaHora: string;
  sistolica: number;
  diastolica: number;
}

interface Paciente {
  NIF: string;
  nombre: string;
  edad: number;
  fechaNacimiento: string;
  alergias: string[] | null;
  medicacion: string[] | null;
  medidasPresionArterial: MedidaPresionArterial[];
}
```

Añadimos un fichero _yml_ para generar el esquema de ZOD:

_./runtpying.yml_

```yml
targetFile: ./model/paciente.zod.ts # The file to create
sourceTypes:
  file: ./model/paciente.model.ts # The file where your type lives
  type: Paciente
```

Y ejecutamos el comando para generar el esquema:

```bash
npx runtyping
```

TODO: ver si se puede buscar recursivamente todo los .model.ts y sacar los .zod.ts (y nombre de fichero)... un poco complicado :)
