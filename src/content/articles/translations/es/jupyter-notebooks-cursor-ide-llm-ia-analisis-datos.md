---
title: "Jupyter Notebooks con LLM en Cursor IDE: análisis de datos con IA"
date: 2026-04-11
slug: "jupyter-notebooks-cursor-ide-llm-ia-analisis-datos"
description: "Aprende a integrar Jupyter Notebooks con Cursor IDE e IA para analizar datos, crear visualizaciones y documentar resultados sin saltar entre herramientas."
tags: [productivity, cursor-ide, ai, llm]
publish: true
thumbnailUrl: "/articles/jupyter-2025-04-25.webp"
language: "es"
originalArticle:
  language: "en"
  slug: "jupyter-notebooks-cursor-ide-llm-ai-tutorial"
translations:
  - language: "en"
    slug: "jupyter-notebooks-cursor-ide-llm-ai-tutorial"
  - language: "zh"
    slug: "cursor-ide-jupyter-notebooks-llm-ai-shuju-fenxi"
  - language: "hi"
    slug: "cursor-ide-jupyter-notebooks-llm-ai-data-analysis"
  - language: "ar"
    slug: "jupyter-notebooks-cursor-ide-llm-ai-ltahlil-albayanat"
---

# De la frustración a la fluidez: mi recorrido con Jupyter Notebooks, LLM y Cursor IDE

## El problema: los LLM y Jupyter Notebooks no se llevan especialmente bien

Eran las 2 de la madrugada cuando por fin admití la derrota. Mi análisis de secuenciación genómica estaba atascado porque el asistente LLM dentro de Cursor IDE no lograba interpretar bien la compleja estructura JSON de mi notebook de Jupyter. Cada vez que intentaba pedir ayuda con el código de visualización, el resultado era un JSON roto que ni siquiera cargaba. Probé a enviar solo fragmentos, pero eso eliminaba todo el contexto de los pasos de preprocesado. Mientras tanto, tenía tres ventanas abiertas: Jupyter en el navegador, VSCode para el “código serio” y otro editor para la documentación. La combinación de las limitaciones del LLM, el formato de Jupyter y el cambio constante de contexto hacía casi imposible trabajar con datos complejos. Incluso con un conjunto de datos sencillo como Iris, esa incompatibilidad básica estaba destruyendo mi productividad.

¿Te suena? Los flujos de trabajo de ciencia de datos suelen castigar especialmente el cambio de contexto. Saltas constantemente entre:
- Editores de código para la parte “seria”
- cuadernos de Jupyter para explorar
- Herramientas de documentación para compartir hallazgos
- Software de visualización para generar gráficas
- ChatGPT y Claude abiertos en el navegador

Cada cambio consume energía mental y añade fricción. Pero, ¿y si hubiera una forma mejor?

> **¿Prefieres vídeo?** Grabé una demostración paso a paso de este flujo completo. [Ver el tutorial de Jupyter Notebooks en Cursor IDE con análisis de datos asistido por IA](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL) para verlo en acción.

[![Resultado final del flujo de Jupyter en Cursor IDE con visualización de datos](/articles/assets/jupyter-notebooks/jupyter-workflow-result.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

## El descubrimiento: una experiencia unificada de ciencia de datos con LLM en Cursor IDE

Fue entonces cuando encontré una solución que cambió por completo mi flujo de trabajo: usar cuadernos de Jupyter directamente dentro de Cursor IDE, reforzados por IA. Este enfoque combina:

- La ejecución interactiva por celdas de Jupyter
- Las funciones potentes de edición y navegación de un IDE real
- Asistencia de IA que entiende tanto código como conceptos de ciencia de datos
- Archivos de texto plano que funcionan muy bien con control de versiones

Al final de este artículo verás cómo construí un entorno integrado que me permite:

- Analizar conjuntos de datos y generar visualizaciones con muy poco código manual
- Crear visualizaciones 3D que revelan patrones ocultos
- Documentar hallazgos junto al código
- Exportar informes profesionales con un solo comando
- Hacer todo esto sin ir saltando entre herramientas

Si quieres terminar con la locura del cambio de contexto, sigamos.

## Preparar el entorno de Jupyter en Cursor IDE

Toda expedición necesita preparación. Para usar Jupyter en Cursor IDE hay que instalar las herramientas correctas y dejar el entorno listo.

### Instalar la extensión de Jupyter

La magia empieza con la extensión Jupyter para Cursor IDE:

1. Abre Cursor IDE y crea una carpeta de proyecto
2. Ve a Extensiones en la barra lateral
3. Busca “Jupyter” y encuentra la extensión oficial
4. Haz clic en “Instalar”

Esta extensión es el puente entre los cuadernos tradicionales y el IDE. Activa una función muy útil: usar marcadores especiales en archivos Python normales para crear celdas ejecutables. Ya no necesitas depender de `.ipynb` con JSON complejo; puedes trabajar con Python en texto plano.

Si quieres profundizar en Jupyter Notebook, consulta la [documentación oficial de Jupyter Notebook](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html).

### Preparar el entorno de Python

Con la extensión instalada, toca crear un entorno limpio:

```bash
python -m venv .venv
```

Después crea un `pyproject.toml` para gestionar dependencias:

```toml
[build-system]
requires = ["setuptools>=42.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "jupyter-cursor-project"
version = "0.1.0"
description = "Data analysis with Jupyter in Cursor IDE"
   
[tool.poetry.dependencies]
python = "^3.9"
jupyter = "^1.0.0"
pandas = "^2.1.0"
numpy = "^1.25.0"
matplotlib = "^3.8.0"
seaborn = "^0.13.0"
scikit-learn = "^1.2.0"
```

Instala esas dependencias en el entorno virtual:

```bash
pip install -e .
```

Aprendí por las malas que los conflictos de versiones provocan errores muy raros. Si la IA te sugiere código que importa una librería, comprueba antes que realmente esté instalada.

## Crear tu primer notebook: el poder del texto plano

Los cuadernos tradicionales de Jupyter usan `.ipynb`, una estructura JSON compleja difícil de editar a mano y todavía más difícil de modificar con IA sin romper el archivo. En su lugar, podemos usar un enfoque en texto plano que conserva lo mejor de ambos mundos.

### El problema con los cuadernos originales

Así se ve un `.ipynb` tradicional en un editor de texto:

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "# My Notebook Title\n",
        "This is a markdown cell with text."
      ]
    },
    {
      "cell_type": "code",
      "execution_count": 1,
      "metadata": {},
      "outputs": [
        {
          "name": "stdout",
          "output_type": "stream",
          "text": ["Hola, mundo!"]
        }
      ],
      "source": [
        "print(\"Hola, mundo!\")"
      ]
    }
  ],
  "metadata": {
    "kernelspec": {
      "display_name": "Python 3",
      "language": "python",
      "name": "python3"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 4
}
```

Para un LLM, esta estructura resulta especialmente incómoda porque:

[![Estructura JSON compleja de un cuaderno tradicional de Jupyter](/articles/assets/jupyter-notebooks/jupyter-json-structure.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

1. El JSON incluye símbolos y anidamientos que no son el contenido real
2. Cada celda guarda su contenido como listas de cadenas con caracteres de escape
3. El código y sus salidas viven en partes distintas
4. Un cambio pequeño exige respetar todo el esquema del archivo
5. Pequeñas ediciones generan diffs grandes y poco precisos

Por eso, cuando un LLM intenta editar este formato, es muy fácil que rompa el cuaderno.

### La ventaja de los marcadores de celda

Crea un archivo `main.py` y añade la primera celda:

```python
# %%
# Importar las librerías necesarias
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Ajustes de visualización para ver mejor los datos
pd.set_option('display.max_columns', None)
plt.style.use('ggplot')

print("Entorno listo para el análisis de datos")
```

Ese `# %%` le dice a la extensión de Jupyter que ahí empieza una celda ejecutable. En cuanto lo añades, aparecen botones de ejecución al lado. Puedes ejecutar solo esa parte y ver el resultado directamente dentro del editor.

Ahora añade una celda de Markdown:

```python
# %% [markdown]
"""
# Análisis del conjunto de datos Iris

Este notebook explora el famoso conjunto de datos de flores Iris para entender:
- Las relaciones entre las distintas medidas de las flores
- Cómo estas medidas permiten distinguir entre especies
- Qué variables separan mejor a las distintas especies

Cada flor del conjunto de datos pertenece a una de estas tres especies:
1. Setosa
2. Versicolor
3. Virginica
"""
```

Esa combinación es potentísima: código ejecutable y documentación rica en el mismo archivo de texto. Sin formatos especiales, sin limitaciones del navegador y con muy buena integración con git.

A medida que construyamos el cuaderno, seguiremos esta estructura:
- Usar `# %%` para celdas de código
- Usar `# %% [markdown]` con triple comillas para documentación
- Mantener un flujo lógico desde carga de datos hasta visualización
- Documentar el proceso y los hallazgos en el camino

## Sacarle partido al asistente LLM: tu compañero de ciencia de datos

Lo que vuelve realmente transformador este flujo es su integración con Cursor Composer. No es solo autocompletado: se comporta como un compañero colaborativo.

### Modo agente: un asistente de ciencia de datos impulsado por LLM

En Cursor IDE, haz clic en “Composer” y elige “Modo agente”. Eso activa un asistente más sofisticado que:
- Mantiene contexto entre interacciones
- Entiende tu conjunto de datos y tus objetivos de análisis
- Genera celdas completas con sintaxis correcta de Jupyter
- Crea visualizaciones adaptadas a tus datos

Podemos pedirle que importe un conjunto de datos:

```text
Importa el conjunto de datos Iris con este formato de cuaderno
```

La IA genera una celda completa y ejecutable:

```python
# %%
# Importar las librerías necesarias
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

# Cargar el conjunto de datos Iris
iris = load_iris()

# Convertirlo en un DataFrame de pandas
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['species'] = iris.target

# Mostrar las primeras filas
print(df.head())
```

Con una sola instrucción, ya tenemos una celda perfectamente formateada que carga los datos.

Lo mejor llega cuando le pides una visualización:

```text
Genera un gráfico de dispersión 3D del conjunto de datos Iris en el que las tres especies aparezcan con colores distintos
```

La IA produce una visualización 3D bastante sofisticada:

[![Visualización 3D del conjunto de datos Iris mostrando grupos por especie](/articles/assets/jupyter-notebooks/jupyter-3d-visualization.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

```python
# %%
# Crear un gráfico de dispersión 3D
from mpl_toolkits.mplot3d import Axes3D

# Crear la figura y el eje 3D
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Obtener las tres especies
species_names = iris.target_names
colors = ['blue', 'red', 'green']

# Dibujar cada especie con un color distinto
for species_id, species_name in enumerate(species_names):
    # Filtrar los datos de esta especie
    species_data = df[df['species'] == species_id]
    
    # Dibujar esta especie
    ax.scatter(
        species_data['sepal length (cm)'],
        species_data['sepal width (cm)'],
        species_data['petal length (cm)'],
        c=colors[species_id],
        label=species_name,
        s=60,
        alpha=0.8
    )

# Configurar las etiquetas y el título
ax.set_xlabel('Longitud del sépalo (cm)')
ax.set_ylabel('Anchura del sépalo (cm)')
ax.set_zlabel('Longitud del pétalo (cm)')
ax.set_title('Gráfico de dispersión 3D del conjunto Iris')
ax.legend()

# Añadir rotación para mejorar la visualización
for angle in range(0, 360, 5):
    ax.view_init(30, angle)
    plt.draw()
    plt.pause(0.001)

plt.show()
```

No es solo una gráfica cualquiera: es una visualización animada que rota para mostrar los datos desde distintos ángulos.

## Guiar al LLM con reglas de Cursor

Descubrí que podía hacer a la IA todavía más útil si añadía un archivo `.cursorrules` en la raíz del proyecto. Ese archivo contiene instrucciones personalizadas que guían la generación de código.

Si quieres profundizar en esto, tengo otra guía sobre [cómo optimizar la programación con IA usando reglas de Cursor](/articles/cursor-ide-rules-for-ai).

Por ejemplo, añadí reglas como estas:

```text
<cursorrules_code_style>
- Prefiere programación funcional frente a OOP
- Usa funciones puras con entradas y salidas claras
- Usa tipado estricto en todas las variables y funciones
</cursorrules_code_style>

<cursorrules_python_specifics>
- Prefiere Pydantic frente a TypedDict para modelos de datos
- Usa pyproject.toml en lugar de requirements.txt
- Para estructuras complejas, evita las colecciones genéricas
</cursorrules_python_specifics>
```

Con estas reglas, la IA empezó a generar código más alineado con mis preferencias:

```python
# %%
# Definir un modelo de Pydantic para mejorar la seguridad de tipos
from pydantic import BaseModel
from typing import List, Optional

class IrisFeatures(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float
    species: int
    species_name: Optional[str] = None

# Función para convertir filas del DataFrame en modelos de Pydantic
def convert_to_models(df: pd.DataFrame) -> List[IrisFeatures]:
    species_map = {0: "setosa", 1: "versicolor", 2: "virginica"}
    
    return [
        IrisFeatures(
            sepal_length=row["sepal length (cm)"],
            sepal_width=row["sepal width (cm)"],
            petal_length=row["petal length (cm)"],
            petal_width=row["petal width (cm)"],
            species=row["species"],
            species_name=species_map[row["species"]]
        )
        for _, row in df.iterrows()
    ]

# Convertir una muestra como demostración
iris_models = convert_to_models(df.head())
for model in iris_models:
    print(model)
```

La IA siguió mis reglas bastante bien y terminó generando código tipado, funcional y más consistente.

## Explorar el conjunto de datos Iris con Python

Con el entorno listo y el asistente preparado, toca empezar la exploración del clásico conjunto de datos Iris.

### Primera mirada a los datos

Ya tenemos el conjunto de datos cargado, así que primero exploramos su estructura:

```python
# %%
# Obtener información básica del conjunto de datos
print("Dimensiones del conjunto de datos:", df.shape)
print("\nDistribución por clase:")
print(df['species'].value_counts())

# Crear una columna de especie más legible
species_names = {0: 'setosa', 1: 'versicolor', 2: 'virginica'}
df['species_name'] = df['species'].map(species_names)

# Mostrar estadísticas descriptivas
print("\nEstadísticas descriptivas:")
print(df.describe())
```

Esto nos muestra 150 muestras en total, 50 de cada especie, y 4 variables principales. Ahora podemos visualizar cómo cambia cada característica según la especie:

```python
# %%
# Crear diagramas de caja para cada variable por especie
plt.figure(figsize=(12, 10))

for i, feature in enumerate(iris.feature_names):
    plt.subplot(2, 2, i+1)
    sns.boxplot(x='species_name', y=feature, data=df)
    plt.title(f'Distribución de {feature} por especie')
    plt.xticks(rotation=45)

plt.tight_layout()
plt.show()
```

Los diagramas de caja revelan patrones interesantes: Setosa tiene sépalos relativamente anchos y pétalos pequeños; Virginica tiene los pétalos más grandes.

### Descubrir patrones ocultos

Para entender mejor las relaciones entre variables:

```python
# %%
# Crear un gráfico de pares para visualizar relaciones entre variables
sns.pairplot(df, hue='species_name', height=2.5)
plt.suptitle('Relaciones entre variables del conjunto Iris', y=1.02)
plt.show()
```

Ese gráfico de pares deja ver rápidamente que:

1. Setosa aparece completamente separada cuando intervienen medidas de pétalos
2. Versicolor y Virginica se solapan un poco, pero siguen siendo distinguibles
3. La longitud y anchura del pétalo son las variables que mejor separan las tres especies

Si quieres ampliar este tipo de análisis, la [guía de uso de scikit-learn](https://scikit-learn.org/stable/user_guide.html) es una muy buena referencia.

## Resolver problemas de integración: dependencias y errores

Como en toda aventura, aparecieron obstáculos. Cuando empecé a trabajar con visualizaciones más complejas me encontré con este error de Seaborn:

```text
ImportError: Seaborn not valid package style
```

Es un problema bastante común en entornos de ciencia de datos: incompatibilidades de versiones entre paquetes. Para diagnosticarlo añadí una celda para revisar versiones instaladas:

```python
# %%
# Comprobar las versiones instaladas de los paquetes
import pkg_resources
print("Paquetes instalados:")
for package in ['numpy', 'pandas', 'matplotlib', 'seaborn', 'scikit-learn']:
    try:
        version = pkg_resources.get_distribution(package).version
        print(f"{package}: {version}")
    except pkg_resources.DistributionNotFound:
        print(f"{package}: No instalado")
```

Descubrí que mi versión de Seaborn no era compatible con la de NumPy. La solución fue usar la terminal emergente de Cursor:

1. Haz clic en el icono de terminal del panel inferior
2. Selecciona “Abrir terminal en ventana”
3. Ejecuta:
   ```bash
   pip install seaborn --upgrade
   ```

Aquí es donde Cursor IDE brilla: pude solucionar la dependencia sin salir de la herramienta ni perder el contexto del análisis.

## Crear visualizaciones que de verdad revelan patrones

Una vez resuelto el entorno, quise crear gráficos que no solo se vieran bien, sino que ayudaran a entender el conjunto de datos.

### De gráficos simples a visualizaciones 3D

Empecé con un gráfico de dispersión sencillo centrado en las dimensiones del pétalo:

```python
# %%
# Crear un gráfico de dispersión con las dimensiones del pétalo
plt.figure(figsize=(10, 6))
for species_id, species_name in enumerate(iris.target_names):
    species_data = df[df['species'] == species_id]
    plt.scatter(
        species_data['petal length (cm)'],
        species_data['petal width (cm)'],
        label=species_name,
        alpha=0.7,
        s=70
    )

plt.title('Dimensiones del pétalo por especie')
plt.xlabel('Longitud del pétalo (cm)')
plt.ylabel('Anchura del pétalo (cm)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

Ese gráfico muestra enseguida cómo Setosa forma un grupo compacto.

Después añadí un mapa de calor de correlaciones:

```python
# %%
# Calcular la matriz de correlación
correlation_matrix = df.drop(columns=['species_name']).corr()

# Crear un mapa de calor
plt.figure(figsize=(10, 8))
sns.heatmap(
    correlation_matrix, 
    annot=True,
    cmap='coolwarm',
    linewidths=0.5,
    vmin=-1, 
    vmax=1
)
plt.title('Matriz de correlación de las variables de Iris')
plt.show()
```

El mapa de calor mostró una correlación muy fuerte, 0.96, entre la longitud y la anchura del pétalo.

Pero la visualización más impactante seguía siendo el gráfico de dispersión 3D animado. A medida que rota, aparecen ángulos donde las tres especies quedan visualmente clarísimas.

## Compartir los hallazgos: del análisis a la presentación

Después de obtener estos hallazgos, necesitaba compartirlos con colegas que no tienen Python ni Jupyter instalados. Ahí es donde las opciones de exportación resultan muy valiosas.

### Crear informes profesionales

Para generar un informe compartible:

1. Me aseguré de que todas las celdas estuvieran ejecutadas
2. Añadí celdas de Markdown para explicar la metodología y las conclusiones
3. Usé la opción “Exportar como HTML”
4. Abrí el HTML en el navegador y guardé como PDF

[![Conversión de un cuaderno de Jupyter en un informe PDF profesional](/articles/assets/jupyter-notebooks/jupyter-pdf-export.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

El resultado fue un documento que incluía código, explicaciones y visualizaciones en un formato que cualquiera podía abrir. También cuidé el tamaño de las figuras para presentaciones y PDF:

```python
plt.figure(figsize=(10, 6), dpi=300)
```

En el caso de las visualizaciones 3D, antes de exportar colocaba la cámara en el ángulo más informativo, ya que en el PDF la animación se convierte en una imagen estática.

## La transformación del flujo de trabajo

Mirando atrás, el cambio es claro. Lo que antes requería tres herramientas distintas y un cambio de contexto constante, ahora sucede dentro de un único entorno:

1. **Explorar**: uso la IA para cargar datos y crear visualizaciones iniciales
2. **Descubrir**: aprovecho la ejecución por celdas para refinar el análisis
3. **Documentar**: escribo mis hallazgos junto al código
4. **Compartir**: exporto el análisis completo como informe profesional

La combinación de interactividad de Jupyter, edición potente de Cursor IDE y asistencia de IA elimina gran parte de la fricción que antes rompía mi concentración.

Además, hay un beneficio extra: como trabajo con archivos de texto plano en vez de cuadernos `.ipynb`, todo el análisis entra mejor en git. Veo con claridad qué cambió entre versiones y evito muchos conflictos de merge.

Si estás cansado de ir saltando entre herramientas para hacer ciencia de datos, este enfoque integrado merece la pena.

## Comparación: Jupyter tradicional frente a Cursor IDE con LLM

Esta tabla resume bien las diferencias:

| Característica | Jupyter Notebook tradicional | Cursor IDE con Jupyter en texto plano |
|----------------|-----------------------------|-------------------------------------|
| **Formato de archivo** | JSON complejo (`.ipynb`) | Python en texto plano (`.py`) |
| **Control de versiones** | Difícil (diffs grandes, conflictos de merge) | Excelente (flujo de trabajo estándar con git) |
| **Funciones de IDE** | Navegación y refactorización limitadas | Capacidades completas de IDE (búsqueda, reemplazo, navegación) |
| **Asistencia de IA** | Limitada | Integración potente con LLM y conciencia de contexto |
| **Ejecución de celdas** | Interfaz basada en navegador | Entorno nativo del IDE |
| **Cambio de contexto** | Necesario para edición avanzada | Todo ocurre en un único entorno |
| **Rendimiento** | Puede volverse lento con notebooks grandes | Rendimiento de editor nativo |
| **Depuración** | Capacidades de depuración limitadas | Herramientas completas de depuración del IDE |
| **Opciones de exportación** | HTML, PDF y varios formatos | Las mismas capacidades mediante la extensión |
| **Colaboración** | Complicada con control de versiones | Flujos de colaboración estándar de código |
| **Dependencias** | Se gestionan en archivos de entorno separados | Gestión del entorno integrada |
| **Problemas de estado oculto** | Frecuentes por ejecuciones fuera de orden | Menores gracias a un flujo más lineal |
| **Soporte para Markdown** | Nativo | Mediante marcadores de celda con las mismas capacidades |
| **Verificación de tipos** | Ninguna | Compatibilidad completa con análisis estático del IDE |
| **Ecosistema de extensiones** | Extensiones de Jupyter | Extensiones del IDE y de Jupyter |

Por eso me parece un enfoque mucho más sólido para trabajo serio de análisis de datos.

Si quieres más contexto sobre la arquitectura completa de Jupyter, consulta la [documentación de Project Jupyter](https://docs.jupyter.org/en/latest/).

## Tutorial en vídeo

Si prefieres aprender visualmente, he creado un tutorial completo que recorre todos los conceptos del artículo:

[![Tutorial en vídeo de Jupyter Notebooks en Cursor IDE](/articles/assets/jupyter-notebooks/video-thumbnail.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

En el vídeo muestro cada paso de la configuración y el uso de cuadernos de Jupyter en Cursor IDE, cómo funciona la integración con IA, cómo crear visualizaciones y cómo exportar resultados sin salir de un entorno unificado.
