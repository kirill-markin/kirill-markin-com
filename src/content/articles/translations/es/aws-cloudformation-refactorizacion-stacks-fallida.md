---
title: "AWS CloudFormation: refactorización fallida y recuperación"
date: 2026-10-03
description: "Una refactorización de CloudFormation bloqueó los despliegues: errores exactos, diagnóstico de solo lectura, pruebas por lotes y recuperación verificada."
tags: [aws, cloudformation, infrastructure, debugging]
publish: true
thumbnailUrl: "/articles/aws-cloudformation-stack-refactoring-failed.webp"
language: "es"
originalArticle:
  language: "en"
  slug: "aws-cloudformation-stack-refactoring-failed"
translations:
  - language: "en"
    slug: "aws-cloudformation-stack-refactoring-failed"
  - language: "zh"
    slug: "aws-cloudformation-duizhan-zhonggou-shibai"
  - language: "hi"
    slug: "aws-cloudformation-stack-refactoring-vifal"
  - language: "ar"
    slug: "aws-cloudformation-fashal-iadat-haykalat-stacks"
---

# Falló la refactorización de stacks de AWS CloudFormation: alarmas de CloudWatch, errores de reversión y recuperación

Trasladar 58 alarmas de CloudWatch y ocho filtros de métricas a su propio stack de CloudFormation bloqueó los despliegues de nuestra aplicación. El stack de origen quedó en `UPDATE_ROLLBACK_FAILED`; el de destino, vacío, quedó en `ROLLBACK_FAILED`. Cinco solicitudes de reversión aceptadas no consiguieron recuperar los stacks. Finalmente, AWS los reparó internamente. Después, nuestro siguiente traslado en bloque falló con otro error.

Estábamos separando la monitorización de mi aplicación de tarjetas de estudio de código abierto, el mismo proyecto cuya [API para agentes describí aquí](/es/articulos/reemplace-17-herramientas-de-agentes-por-un-dsl-tipo-sql/). El origen tenía 497 recursos físicos. Queríamos trasladar 66 recursos de monitorización y dejar la base de datos donde estaba. El impacto verificado fue el bloqueo de los despliegues; no llegamos a constatar una caída de la aplicación ni pérdida de datos.

Al final trasladamos los 66 recursos, conservamos sus identidades originales durante la migración y completamos después despliegues normales. Lo útil de este incidente es cómo comprobamos cada uno de esos resultados, a pesar de los campos de estado y las etiquetas de pertenencia que podían inducir a error.

## Si tu refactorización está atascada, empieza aquí

| Lo que ves | Siguiente paso |
| --- | --- |
| Una vista previa de refactorización completada | Lee `ExecutionStatus` y su motivo, además de `Status`. Compara cada asignación de recursos propuesta con tu estado de referencia antes de ejecutar. |
| `UPDATE_ROLLBACK_FAILED` o una reversión de refactorización fallida | Registra la operación, ambos stacks y los errores con sus marcas de tiempo. Reintenta solo después de identificar qué requisito previo ha cambiado. |
| Un error de `AlarmName` nulo o de esquema de etiquetas no admitido | Conserva el mensaje exacto junto a la operación correspondiente. En nuestro incidente aparecieron en etapas distintas. |
| El inventario y las etiquetas del sistema no coinciden | Compara los ID físicos y la configuración en el proveedor con los inventarios de ambos stacks. Pausa los despliegues dependientes hasta entender a qué stack pertenece cada recurso. |
| AWS comunica que la recuperación ha terminado | Comprueba por separado que los stacks sean operativos, que los recursos se hayan conservado, que la aplicación funcione y que se pueda realizar un despliegue normal. |

Los tamaños de lote que usamos en producción salieron de experimentos acotados posteriores a la recuperación de los stacks originales por parte de AWS. Son observaciones que conviene investigar, no una receta general de recuperación.

![Un trabajador baja una bandeja de piezas de cerámica intactas a una pequeña barca mientras un barco de carga más grande atraviesa una esclusa abierta del canal](/articles/aws-cloudformation-stack-refactoring-failed.webp)

## Recoge el estado actual antes de volver a intentarlo

Estos comandos solo leen el estado de AWS. Sustituye cada valor de ejemplo entre comillas por el tuyo, guarda el JSON de forma privada y repite las consultas a los stacks para cada uno de los que intervienen en la operación. Las plantillas y las salidas pueden contener información sensible.

Empieza por la identidad que realiza la llamada, el estado del stack y la operación de refactorización exacta:

```bash
aws --profile '<profile>' --region '<region>' sts get-caller-identity \
  --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation describe-stacks \
  --stack-name '<stack-id>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation describe-stack-refactor \
  --stack-refactor-id '<refactor-id>' --output json --no-cli-pager
```

`get-caller-identity` identifica tu sesión de diagnóstico. No identifica todos los roles que utilizó CloudFormation durante el fallo. Conserva el `RoleARN` del stack cuando esté presente e investiga por separado la identidad de ejecución.

Después, recoge los eventos, el inventario, las plantillas y las acciones propuestas:

```bash
aws --profile '<profile>' --region '<region>' cloudformation describe-stack-events \
  --stack-name '<stack-id>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation list-stack-resources \
  --stack-name '<stack-id>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation get-template \
  --stack-name '<stack-id>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation list-stack-refactor-actions \
  --stack-refactor-id '<refactor-id>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation list-stack-refactors \
  --output json --no-cli-pager
```

La paginación sigue activada. `--no-cli-pager` desactiva el visor del terminal, no la paginación. No añadas `--no-paginate` ni dejes sin gestionar un límite `--max-items` cuando recopiles pruebas completas. Si limitas deliberadamente los resultados de la CLI, continúa con el token devuelto mediante `--starting-token`; quienes llamen directamente a la API deben seguir todos los `NextToken`. Consulta las [opciones de paginación de la CLI](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/list-stack-refactors.html) y la [API ListStackRefactors](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStackRefactors.html).

Para cada alarma afectada, compara el estado y las etiquetas en el proveedor con el inventario del stack:

```bash
aws --profile '<profile>' --region '<region>' cloudwatch describe-alarms \
  --alarm-names '<alarm-name>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudwatch list-tags-for-resource \
  --resource-arn '<alarm-arn>' --output json --no-cli-pager
```

Conserva las correspondencias entre ID lógicos y físicos antes y después del traslado, los tipos de recurso y su configuración, incluida la de los filtros de métricas si los hay. Una captura reciente te dice qué existe ahora; para demostrar que los recursos se han conservado necesitas también el estado de referencia anterior al traslado.

Pausa los despliegues dependientes si no está claro a qué stack pertenecen los recursos, si una operación agota su tiempo de espera o si el mismo reintento falla sin que haya cambiado ningún requisito previo. Un tiempo de espera agotado no demuestra que la ejecución se haya detenido. Eliminar recursos, sustituir roles, deshacer el traslado o pasar a un procedimiento de retención e importación requiere, en cada caso, un plan de recuperación aparte y revisado.

Para AWS Support, prepara un expediente privado: cuenta y región, ID de stacks y operaciones, cronología en UTC, errores exactos e ID de solicitudes, commit y ejecución de CI, pruebas sobre roles y políticas, comparaciones de plantillas, ID de recursos omitidos, intentos de recuperación e impacto en la aplicación. Si Support te pide conservar el estado del incidente, mantén la observación de solo lectura hasta que retire esa indicación.

## Una vista previa correcta no significaba que el traslado hubiera salido bien

La [refactorización nativa de stacks de CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stack-refactoring.html) reorganiza recursos existentes y conserva sus propiedades y datos. Antes de intentar un traslado, revisa qué recursos admite y las restricciones sobre políticas de stack, dependencias y pseudoparámetros que dependen del stack. Los cambios de configuración deben hacerse en una actualización aparte.

La API distingue entre crear una refactorización y ejecutarla. El experimento que falló más adelante devolvió estos dos campos:

```json
{
  "Status": "CREATE_COMPLETE",
  "ExecutionStatus": "ROLLBACK_COMPLETE"
}
```

La vista previa había terminado; el traslado se había revertido. Lee también ambos campos de motivo: `StatusReason` y `ExecutionStatusReason`. La [referencia de la API DescribeStackRefactor](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackRefactor.html) los define por separado.

Nuestro problema inicial de reversión tenía otro síntoma. Los registros históricos de los recursos de alarma contenían este mensaje del proveedor, del que hemos eliminado el token de solicitud:

```text
Resource handler returned message: "Cannot invoke "String.equals(Object)" because the return value of "software.amazon.cloudwatch.alarm.ResourceModel.getAlarmName()" is null" (HandlerErrorCode: InternalFailure)
```

El `AlarmName` nulo fue una prueba útil para escalar el caso. No indicaba cómo repararlo por nuestra cuenta.

## Cinco solicitudes de reversión aceptadas y seguíamos bloqueados

Nuestros cinco intentos incluyeron una solicitud verificada para omitir 22 alarmas y un reintento pedido por un ingeniero de AWS el 27 de septiembre a las 08:39 UTC. El servicio aceptó las solicitudes, pero sus operaciones fallaron. Repetir la llamada no demostró ningún avance.

AWS limita `continue-update-rollback` y `ResourcesToSkip` a un procedimiento de recuperación específico: omitir recursos elegibles que fallaron durante la reversión, usar el conjunto mínimo necesario y reconciliar los recursos omitidos con la plantilla antes de la siguiente actualización. Omitir un recurso no demuestra que su estado real coincida con la plantilla. Sigue el [procedimiento de reversión de AWS](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html) para tomar esa decisión.

Los estados de ambos stacks cambiaron el 1 de octubre, alrededor de las 22:00 UTC. A la mañana siguiente, AWS Support confirmó que su equipo interno había recuperado los dos stacks y que podíamos reanudar los despliegues. Gracias a ese equipo por sacarnos del bloqueo. AWS no proporcionó un comando interno de reparación ni confirmó que hubiera publicado un parche general del servicio. La cronología sin datos sensibles está en nuestro [procedimiento del incidente, fijado a una revisión concreta](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/aws-infrastructure-changes.md).

## La explicación sobre RDS dependía de qué identidad hiciera la lectura

AWS atribuyó el fallo original a la falta del permiso `rds:DescribeDBInstances` en el rol de ejecución. Su explicación fue que resolver el endpoint de RDS en las salidas del stack requería esa lectura, aunque la base de datos iba a permanecer en el stack de la aplicación.

Esa fue la evaluación de AWS. Nuestras observaciones independientes no permitieron establecer la causa raíz completa. Vimos que el rol indicado tenía `AdministratorAccess` y que una simulación de IAM permitía la operación, pero ninguna de esas comprobaciones reconstruía la política vigente ni la sesión real del servicio en el momento del fallo.

Hay varias identidades que tener en cuenta: la que llama desde CI, los roles asumidos para despliegue o consulta, la que llama a la API de refactorización nativa y el rol de ejecución de CloudFormation. Una lectura de la base de datos que funciona en tu terminal solo comprueba la identidad que usa ese terminal. La [documentación sobre roles de servicio](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html) explica cuándo utiliza CloudFormation las credenciales de un rol configurado; la [documentación del simulador de IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html) explica por qué la simulación puede diferir de una solicitud real.

La comprobación práctica consiste en seguir esa cadena de identidades y las lecturas necesarias en los proveedores, incluidas las de recursos referenciados por las salidas. Nuestras pruebas no justifican recomendar un permiso adicional de RDS como solución a un fallo de refactorización de alarmas.

## El siguiente fallo en bloque se reprodujo sin RDS

Tras la recuperación interna de AWS, otro intento de traslado en bloque en producción se revirtió. Un experimento aislado reprodujo el mismo error con 58 alarmas y un destino creado por la refactorización nativa. En ese experimento no había ninguna dependencia de RDS. Tras quitar del mensaje el prefijo con el ARN del stack, el motivo era:

```text
Stack Refactor does not support AWS::CloudWatch::Alarm because the resource type defines an unsupported tag schema.
```

Una lectura de RDS por sí sola no podía explicar este resultado posterior. Además, el mensaje parecía más general de lo que respaldaban nuestros experimentos: varios traslados nativos de alarmas funcionaron.

| Experimento | Resultado observado |
| --- | --- |
| Alarmas individuales con nombres generados o explícitos y etiquetas ausentes, vacías o presentes | Los traslados nativos se completaron; verificamos la identidad física, las etiquetas de destino y la limpieza. |
| Destinos creados por refactorización nativa con 2, 10 y 25 alarmas | Se completaron; verificamos los ID, las configuraciones, las etiquetas de sistema del destino y la limpieza. |
| Destino creado por refactorización nativa con 58 alarmas y sin RDS | Se revirtió con el error de esquema de etiquetas no admitido. |
| Caso aparte de 58 alarmas con un destino creado de antemano | Devolvió `InternalFailure`, un error diferente. |
| Traslado de dos alarmas afectadas y después otras dos al mismo destino | Ambos traslados se completaron; las 58 identidades y configuraciones originales permanecieron intactas. |

El registro público incluye la [ejecución con 2/10/25 alarmas](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37039188642), la [ejecución con 58 alarmas](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37040911612) y la [ejecución que reutilizó el destino](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37043811213). Los registros pueden caducar o exigir inicio de sesión; la documentación del incidente fijada a una revisión concreta conserva las conclusiones.

También se completó un caso individual con un destino creado por refactorización nativa sin `RoleARN` de destino, así que la ausencia de ese campo por sí sola no reprodujo el fallo. Un caso de prueba desechable generado mediante importación se completó, pero no utilizamos importación para recuperar producción. Un caso de importación con nombre explícito nunca llegó a iniciarse y no aporta ningún resultado.

Veinticinco fue un tamaño probado con éxito, no un límite de AWS que hubiéramos descubierto. El número de recursos, la creación del destino y los restos de la reversión fueron aspectos útiles para investigar. Estos resultados no revelan la causa raíz interna del servicio ni garantizan que lotes más pequeños recuperen otro stack.

## El inventario del stack y las etiquetas no coincidían tras la reversión

Después del fallo aislado con 58 alarmas, el inventario de CloudFormation volvió a situar las alarmas en el origen. Sin embargo, 49 alarmas conservaron etiquetas de sistema que apuntaban al destino eliminado posteriormente; solo nueve apuntaban al origen. Durante la limpieza también se produjo un `InternalFailure` de `GetTemplate`.

Por tanto, una comprobación de pertenencia basada únicamente en `aws:cloudformation:stack-id` habría dado una imagen equivocada. Comparamos por separado el inventario de los stacks, los ID físicos, las configuraciones reales y las etiquetas. La discrepancia en sí debía resolverse antes de los despliegues dependientes.

En el experimento de recuperación, dos traslados sucesivos de dos alarmas al mismo destino conservaron las 58 identidades y configuraciones. Las etiquetas de sistema eran correctas en las cuatro alarmas trasladadas. No escribimos manualmente las etiquetas protegidas `aws:`. Después verificamos la limpieza: no quedaron stacks ni alarmas de prueba.

Otros dos detalles históricos podían confundir una investigación nueva. Tras recuperar los stacks seguían apareciendo veintidós filas de alarmas con `UPDATE_FAILED`; esas filas por sí solas no demostraban un fallo físico actual de las alarmas. Una vista previa obsoleta desapareció de `ListStackRefactors`, pero aún se podía consultar por su ID exacto. Compara las marcas de tiempo con el estado actual del proveedor y consulta directamente las operaciones conocidas aunque la lista las omita. Nuestra [guía de pertenencia de recursos, fijada a una revisión concreta](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/monitoring-stack-migration.md) recoge ambas observaciones.

## La recuperación terminó con un despliegue normal

El traslado en producción se completó en cuatro lotes mediante refactorización nativa: ocho filtros de métricas, luego 25 alarmas, 25 alarmas y ocho alarmas. Durante la migración se conservaron las identidades y los tipos de los 497 recursos físicos originales. Los 66 recursos de monitorización acabaron en el stack de monitorización.

Mantuvimos separadas cuatro preguntas sobre la recuperación:

| Resultado de la recuperación | Pruebas que recopilar |
| --- | --- |
| Operatividad de los stacks | Estados recientes de ambos stacks y una explicación del estado de cada operación de refactorización conocida. |
| Conservación de recursos, configuración y datos | Comparaciones de identidades y configuración antes y después, más comprobaciones de datos específicas de cada servicio. Que los ID físicos no cambien no basta para demostrar la integridad de los datos. |
| Funcionamiento de la aplicación | Comprobaciones actuales de estado y los flujos de pruebas de humo pertinentes de la web, la API para agentes y MCP. |
| Capacidad de desplegar por la vía habitual | Un commit conocido desplegado con éxito por el procedimiento normal. |

El [primer despliegue normal tras la separación](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37061435128), con el commit `ad297a8`, se completó. El [siguiente despliegue normal](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37073868147), con `0a530c7`, superó los nueve trabajos y los tres flujos de pruebas de humo. La plataforma, la web y el panel de administración informaron del commit desplegado esperado.

Ese último despliegue sustituyó intencionadamente un recurso inmutable `AWS::Lambda::Version`. Las otras 496 identidades originales, incluidos los 66 recursos de monitorización, permanecieron sin cambios. Es una comparación distinta de la conservación de las 497 identidades durante la migración: que un despliegue normal cree una versión nueva de Lambda no invalida el resultado de la migración anterior. Las [pruebas de finalización fijadas a una revisión concreta](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/monitoring-stack-migration.md#verified-completion-evidence) recogen ambas comprobaciones.

Tras la verificación, retiramos los accesos temporales para la refactorización y las herramientas de diagnóstico. En ese estado final, el script auxiliar de despliegue comprueba a qué stack pertenecen los recursos; no vuelve a ejecutar la migración. El punto de llegada fue un despliegue normal de un commit conocido, respaldado por comparaciones de recursos y comprobaciones satisfactorias de la aplicación. Esa fue la prueba de que podíamos volver a publicar versiones.
