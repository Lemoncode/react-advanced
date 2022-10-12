# TODO

Nomenclatura ficheros.

- minúsculas y porque
- separación kebab case y . tipo fichero

- Estructura carpetas: preparados para crecer.

Estructurando en ficheros:

- Mismo fichero vs ficheros separados, reglas para romperlo.
- Barrel.
- Solución alias universal.
  Nombrando eventos y propiedades callbacks.

# Sumario

Tópicos de esta guía:

- Nombrando y creando carpetas.
- Estructura de carpetas.
- Importación de rutas relativas y aliases.
- Nombrando y creando ficheros.
- Distribución de contenido en ficheros.
- Nombrando eventos y propiedades callbacks.
- Principio de promoción.
- Política de pruebas unitarias.

# Nombrando y creando carpetas

Prácticas que tenemos definidas

- Usar minúsculas.
- Separar palabras con guiones medios.
- Usar nombres cortos pero descriptivos.
- Salvo que lo tengamos claro no crear carpetas demasiado temprano.
- Uso de singulares y plurales.
- Uso de barrel.

## Uso de minusculas

Esto viene porque Linux es case sensitive y Windows no, aunque
ya los IDE y herramientas de desarrollo lo suelen resaltar es
posible que se nos pase este detalle y por ejemplo tener
que el build local en máquinas Windows funciona, pero en CI en una
máquina Linux, y este fallo es muy complicado de depurar ya que
si nadie tiene una máquina Linux / Mac OS en local.

Podéis ver en muchos proyectos open source que no siguen esta aproximación,
nosotros lo entendemos así porque en el resto de europa y en USA la mayoría
de Front Enders desarrollan con Mac OS.

## Separación de palabras

Nosotros solemos usar guiones medios (kebak case) porque nos resulta más legible.

Podría valer otro separador, pero es importante que sea consistente, si por ejemplo
se usa guión bajo, que se use siempre guión bajo, no mezclar.

En el caso de los ficheros veremos que usamos dos separadores, el "-" y el ".", esto
lo veremos más adelante, así como el razonamiento.

## Nombres cortos pero descriptivos

En el caso de carpetas intentamos que los nombres sean cortos, ya que normalmente
acompañarán a ficheros que cuelgen del raíz, pero le damos importancia a que estos
describan que es lo que hacen.

En caso de que hagan falta más de una palabra, usamos guiones medios para separarlas
(mismo razonamiento que para nombre de ficheros).

## Salvo que lo tengamos claro no crear carpetas demasiado temprano

Salvo que este muy claro que es necesario crear una carpeta o estructura de carpetas
(por que tengamos un armazón inicial definido, o tengamos claro que van a ser necesarias),
preferimos crear la carpeta sólo cuando se necesario.

Por ejemplo:

- Tenemos una carpeta `components`, de primeras vamos soltando componentes aquí, conforme esta carpeta crece en contenido va haciendo más gande va a hacer falta refactorizarla y agrupar componentes comunes en subcarpetas.

- Tenemos debajo de components, un componente de layout, otro de que wrapea un input, un combobox, una lista... esos componentes serán candidatos
  de agruparlo en la carpeta `components/form`, sin embargo la de layout mientras no crezca no lo planteamos.

Siguiendo esta aproximación, nos evitamos tener una estructura de carpetas de las que hay veces qué sólo cuelga un fichero, este mal se llama "el principio de clarividencia del programador", a priori en muchos escenarios no sabemos por donde va a crecer el proyecto.

Es malo tanto tener muchas carpetas y profundidad sin contenido, como tener poca profundidad de carpetas y muchos ficheros.

## Uso de singulares y plurales

A nivel de carpetas, salvo que estemos hablando de adjetivos o terminos no contables (_common_, _core_), utilizaremos el plural para las carpetas, ya que suelen agrupar elementos (_components_, _scenes_, _layouts_).

Siguiendo esta aproximación es más natural identificar carpetas, en los ficheros evitaremos el uso de plurales.

## Uso de ficheros barrel

Es buena práctica debajo de cada subcarpeta generar un fichero _index.ts_ que sea el punto de entrada para los ficheros de esa carpeta, algo así
como:

_./index.ts_

```ts
export * from "./kanban.container";
export * from "./providers/kanban.provider";
```

De esta manera:

- Las importaciones son más cortas.
- Si se renombra un fichero, no hay que cambiar las importaciones, sólo tocar el barrel.
- Si se renombra una carpeta, sólo hay que cambiar el barrel.
- Si se reagrupa en subcarpetas, sólo hay que cambiar el barrel.
- Tenemos una forma de indicar al programador que va a consumir elementos de nuestra carpeta que funcionalidad queremos publicar como "pública", si bien el desarrollador puede ir a por la ruta completa, va a detectar que el desarrollador orginal no quería exponer el fichero por algún motivo.

# Estructura de carpetas.

Cuando creamos una aplicación de tamaño medio, seguimos la aproximación de pods.

```txt
my-application/
├─ common/
├─ common-app/
├─ core/
├─ layout/
├─ pods/
├─ scenes/
```

Para proyectos más grandes, candidatos dividir en cargas bajo demanda o submódulos podemos añadir un nivel de carpetas más
_submodules_ aquí se puede elegir dos aproximaciones:

```txt
my-application/
├─ common/
├─ core/
├─ module/
│  ├─ my-module/
│  │  ├─ common-app/
│  │  ├─ layout/
│  │  ├─ pods/
│  │  ├─ scenes/
```

Aquí depende como se enfoque cada submódulo podrían compartir concerns comunes.

Otra opción es la siguiente:

```txt

my-application/
├─ module/
│  ├─ my-module/
│  │  ├─ common/
│  │  ├─ common-app/
│  │  ├─ core/
│  │  ├─ layout/
│  │  ├─ pods/
│  │  ├─ scenes/
```

En este caso cada módulo es una isla independiente, si necesitamos compartir concerns comunes podríamos plantear crear una librería o una carpeta común o core a módulos.

## common

Bajo esta carpeta se incluye toda los componentes y funcionalidades que se pueden usar en cualquier parte de la aplicación, y que podrían ser reutilizables en otras aplicaciones (no tienen relación con el dominio de la aplicación), por ejemplo:

- Un componente de UI para mostrar un calendario.
- Una función para parsear un fichero CSV cualquier.
- Unas expresiones regulares para validar un email o un formato dado.
- ...

La funcionalidad que se publique aquí, si se demuestra útil (ver más abajo principio de promoción), se puede extraer a una librería estándar y que otros proyectos de la empresa lo usen o incluso promocionarlo a open source.

## common-app

Bajo esta carpeta se incluye toda los componentes y funcionalidades que se pueden usar en cualquier parte de la aplicación, pero que NO son reutilizables en otras aplicaciones (SI tienen relación con el dominio de la aplicación), por ejemplo:

- Un panel de filtro de paciente de un hospital que usan campos específicos de la base de datos.
- Un listado de pacientes con una jerarquía de datos específica del dominio.
- ...

Es decir son componentes / funcionalidades reusable que no se pueden reaprovechar en otras aplicaciones ya que están atadas al dominio del proyecto.

Esta carpeta es opcional y puede generar controversia ya que se puede incurrir en el riesgo de que la carpeta acabe siendo un cajón de sastre, si
no hay criterio de que debe incluir.

## core

En esta carpeta incluimos la funcionalidad que es transversal al proyecto, es decir ficheros que podemos usar a diferentes niveles de la aplicación
y que guardan información, por ejemplo:

- Las rutas de navegación.
- El perfil del usuario / roles de seguridad.
- El tema de la aplicación.
- Cachés de datos comunes.

A veces nos puedes costar distinguir que debe entrar en la carpeta _common_ y la _core_ como regla para distinguirlo:

- La carpeta _common_ está más orientadas a componentes y funcionalidades independientes que podemos incrustar en la aplicación, estas funcionalidades actúan como cajas negras independientes.
- La carpeta _core_ almacena funcionalidad que se usa y está cohesionada a nivel de aplicación, por ejemplo información de la aplicación que necesitamos consumir a diferentes niveles de la aplicación.
