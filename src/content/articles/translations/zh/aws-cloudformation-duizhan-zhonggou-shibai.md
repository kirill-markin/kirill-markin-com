---
title: "AWS CloudFormation 堆栈重构失败：CloudWatch 告警、回滚报错与恢复发布的验证过程"
date: 2026-10-03
description: "一次 CloudFormation 堆栈重构阻塞了我们的应用发布。本文记录告警的原始报错、只读排查命令、AWS 内部恢复后的分批迁移实验，以及确认资源身份与配置得到保留、部署恢复正常的证据。我们区分了预览与执行状态，核对了堆栈清单和系统标签的分歧，也说明了这些观察为何不能直接作为其他堆栈的通用恢复方案。"
tags: [aws, cloudformation, infrastructure, debugging]
publish: true
thumbnailUrl: "/articles/aws-cloudformation-stack-refactoring-failed.webp"
language: "zh"
originalArticle:
  language: "en"
  slug: "aws-cloudformation-stack-refactoring-failed"
translations:
  - language: "en"
    slug: "aws-cloudformation-stack-refactoring-failed"
  - language: "es"
    slug: "aws-cloudformation-refactorizacion-stacks-fallida"
  - language: "hi"
    slug: "aws-cloudformation-stack-refactoring-vifal"
  - language: "ar"
    slug: "aws-cloudformation-fashal-iadat-haykalat-stacks"
---

# AWS CloudFormation 堆栈重构失败：CloudWatch 告警、回滚报错与恢复过程

我们尝试把 58 个 CloudWatch 告警和 8 个指标筛选器移到独立的 CloudFormation 堆栈，结果阻塞了应用发布。源堆栈进入 `UPDATE_ROLLBACK_FAILED`，空的目标堆栈进入 `ROLLBACK_FAILED`。服务接受了 5 次回滚请求，却都没能恢复堆栈。最后，AWS 在内部修复了它们。随后，我们的下一次批量迁移又失败了，这次报的是另一个错误。

这次操作是为我的开源闪卡应用拆分监控资源。我在[这篇文章里介绍过它的智能体 API](/zh/zhishi/yige-lei-sql-dsl-qudai-17-ge-agent-gongju/)。源堆栈有 497 个物理资源。我们希望迁走其中的 66 个监控资源，数据库留在原处。已确认的影响是发布受阻；我们没有证实发生了应用中断或数据丢失。

最终，我们迁完了全部 66 个资源，在迁移期间保留了原来的资源身份，之后也完成了常规发布。这次事件值得记录的地方，是面对容易误导人的状态字段和归属标签，我们如何逐项确认这些结果。

## 如果你的重构卡住了，先从这里开始

| 你看到的情况 | 下一步 |
| --- | --- |
| 重构预览已完成 | 除了 `Status`，还要读取 `ExecutionStatus` 及其原因。执行前，将每一项拟议的资源映射与基线逐一比较。 |
| `UPDATE_ROLLBACK_FAILED`，或重构回滚失败 | 保存操作、两个堆栈的状态，以及带时间戳的报错。只有确认某项前提条件已经改变后，才重试。 |
| `AlarmName` 为 null，或不支持标签架构的报错 | 保留原始错误消息，并关联到对应操作。这两类错误在我们的事件中出现在不同阶段。 |
| 资源清单与系统标签不一致 | 将物理 ID 和资源提供程序侧的设置与两个堆栈的清单进行比较。在弄清资源归属前，暂停依赖这些资源的部署。 |
| AWS 表示恢复已完成 | 分别检查堆栈是否可操作、资源是否保留、应用是否健康，以及常规部署能否完成。 |

生产环境中的批次大小，来自 AWS 恢复原始堆栈后开展的有限范围实验。这些是可以进一步研究的观察结果，不能当作通用的恢复步骤。

![一名工人将一盘完好的陶器放入小艇，一艘较大的货船正驶过打开的运河船闸](/articles/aws-cloudformation-stack-refactoring-failed.webp)

## 再次重试前，先收集当前状态

以下命令只读取 AWS 状态。请将引号内的每个占位符替换成自己的值，私下保存返回的 JSON，并对每个参与重构的堆栈重复执行相应命令。模板和输出可能包含敏感信息。

先确认调用者、堆栈状态和具体的重构操作：

```bash
aws --profile '<profile>' --region '<region>' sts get-caller-identity \
  --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation describe-stacks \
  --stack-name '<stack-id>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation describe-stack-refactor \
  --stack-refactor-id '<refactor-id>' --output json --no-cli-pager
```

`get-caller-identity` 确认的是你当前排查会话的身份。它不能确认 CloudFormation 在失败过程中使用过的每一个角色。如果堆栈有 `RoleARN`，请保留这个字段，并单独调查实际执行身份。

接下来收集事件、资源清单、模板和拟执行的操作：

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

保持分页开启。`--no-cli-pager` 关闭的是终端查看器，并不会关闭分页。收集完整证据时，不要加上 `--no-paginate`，也不要设置 `--max-items` 后就不再处理剩余结果。如果有意限制 CLI 的单次返回数量，要将返回的令牌传给 `--starting-token` 继续读取；直接调用 API 时，则必须沿每个 `NextToken` 读完后续结果。具体参见 [CLI 分页选项](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/list-stack-refactors.html) 和 [ListStackRefactors API](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStackRefactors.html)。

对每个受影响的告警，将资源提供程序侧的状态和标签与堆栈清单进行比较：

```bash
aws --profile '<profile>' --region '<region>' cloudwatch describe-alarms \
  --alarm-names '<alarm-name>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudwatch list-tags-for-resource \
  --resource-arn '<alarm-arn>' --output json --no-cli-pager
```

保留前后两次逻辑 ID 到物理 ID 的映射，以及资源类型和设置；如果涉及指标筛选器，也要保留它们的设置。新快照能告诉你当前有哪些资源，但要确认迁移保留了原有资源，仍然需要迁移前的基线。

如果资源归属不明、操作超时，或前提条件未变而同样的重试再次失败，应暂停依赖这些资源的部署。超时并不代表执行已经停止。无论是删除资源、替换角色、反向迁移，还是改用保留资源再导入的方式，都需要单独制定并审核恢复计划。

提交给 AWS Support 的材料应私下整理，包括账号和区域、堆栈及操作 ID、UTC 时间线、原始错误和请求 ID、提交与 CI 运行记录、角色及策略证据、模板对比、跳过的资源 ID、已尝试的恢复操作，以及对应用的影响。如果 Support 要求保留现场，就继续进行只读观察，直到他们解除这一要求。

## 预览成功，不代表迁移成功

原生的 [CloudFormation 堆栈重构](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stack-refactoring.html)会重新组织现有资源，同时保留它们的属性和数据。尝试迁移前，应检查资源是否符合条件，以及堆栈策略、依赖关系和依赖堆栈的伪参数方面的限制。配置变更应放在另一次独立更新中。

API 将创建重构与执行重构分开处理。我们后来一次失败的实验同时返回了以下两个字段：

```json
{
  "Status": "CREATE_COMPLETE",
  "ExecutionStatus": "ROLLBACK_COMPLETE"
}
```

预览已经完成，但迁移已经回滚。两个原因字段也要读取：`StatusReason` 和 `ExecutionStatusReason`。[DescribeStackRefactor API 参考文档](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackRefactor.html)分别定义了它们。

最初的回滚问题表现不同。告警资源的历史记录中出现了下面这条资源提供程序消息，以下内容已移除请求令牌：

```text
Resource handler returned message: "Cannot invoke "String.equals(Object)" because the return value of "software.amazon.cloudwatch.alarm.ResourceModel.getAlarmName()" is null" (HandlerErrorCode: InternalFailure)
```

`AlarmName` 为 null 是请 AWS 进一步处理问题时的有用证据，但它并没有指出一种可以自行完成的修复方法。

## 5 次回滚请求都被接受，发布仍然受阻

我们的 5 次尝试中，有一次已核实的请求要求跳过 22 个告警，还有一次是应 AWS 工程师要求，在 9 月 27 日 08:39 UTC 进行的重试。服务接受了这些请求，但相应操作都失败了。重复调用本身并不能证明恢复取得了进展。

AWS 将 `continue-update-rollback` 和 `ResourcesToSkip` 限定在特定的恢复路径中：只跳过回滚过程中失败且符合条件的资源，将跳过范围控制在必要的最小集合，并在下次更新前让被跳过的资源与模板保持一致。跳过某个资源，并不代表线上资源与模板相符。作出这一决定时，请遵循 [AWS 的回滚流程](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html)。

两个堆栈的状态在 10 月 1 日 22:00 UTC 左右发生了变化。次日早晨，AWS Support 确认内部团队已恢复两个堆栈，可以恢复部署。感谢这个团队帮我们解决了堆栈卡住的问题。AWS 没有提供内部使用的修复命令，也没有确认已发布通用的服务补丁。脱敏后的时间线保存在我们[固定到具体提交的事件处理文档](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/aws-infrastructure-changes.md)中。

## 关于 RDS 的解释，要看读取操作使用的是哪个身份

AWS 将最初的失败归因于执行角色缺少 `rds:DescribeDBInstances` 权限。他们的解释是，即使数据库仍留在应用堆栈中，解析堆栈输出里的 RDS 端点也需要这项读取权限。

这是 AWS 的判断。我们自己的观察没有确定完整的根因。我们看到所指的角色具有 `AdministratorAccess`，IAM 模拟结果也显示允许访问，但这两项证据都无法还原失败时的历史策略或实际服务会话。

需要梳理的身份有好几个：CI 调用者、所代入的部署或查询角色、原生重构 API 的调用者，以及 CloudFormation 的执行角色。在你的 shell 里成功读取数据库，只验证了该 shell 使用的身份。[服务角色文档](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html)解释了 CloudFormation 何时使用已配置角色的凭证；[IAM 模拟器文档](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)则解释了模拟结果为何可能与实际请求不同。

实际排查时，应追踪这条身份链，以及资源提供程序所需的读取操作，也包括对输出所引用资源的读取。我们的证据不足以支持把“再加一项 RDS 权限”作为告警重构失败的解决办法。

## 下一次批量迁移失败，在没有 RDS 的情况下也复现了

AWS 完成内部恢复后，生产环境中的又一次批量尝试发生了回滚。一个隔离实验用 58 个告警，以及由原生重构创建的目标堆栈，复现了同样的错误。这个实验没有 RDS 依赖。移除堆栈 ARN 前缀后，错误原因如下：

```text
Stack Refactor does not support AWS::CloudWatch::Alarm because the resource type defines an unsupported tag schema.
```

仅凭 RDS 读取问题，无法解释这次后续结果。这条消息的表述也比实验所支持的结论更宽泛：好几次原生告警迁移实际都成功了。

| 实验 | 观察结果 |
| --- | --- |
| 单个告警，使用自动生成或显式指定的名称，标签字段缺失、为空或包含标签 | 原生迁移成功；已验证物理资源身份、目标标签和清理结果。 |
| 原生重构创建的目标堆栈，分别包含 2、10 和 25 个告警 | 成功；已验证 ID、配置、目标堆栈系统标签和清理结果。 |
| 原生重构创建的目标堆栈，包含 58 个告警，没有 RDS | 回滚，报不支持标签架构的错误。 |
| 另一个包含 58 个告警的案例，目标堆栈预先创建 | 返回 `InternalFailure`，是另一种错误。 |
| 先迁移 2 个受影响的告警，再向同一目标堆栈迁移另外 2 个 | 两次迁移都成功；全部 58 个原始资源的身份和配置均保持不变。 |

公开记录包括 [2/10/25 个告警的运行记录](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37039188642)、[58 个告警的运行记录](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37040911612)和[复用目标堆栈的运行记录](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37043811213)。日志可能过期，也可能需要登录；固定到具体提交的事件文档保留了结论。

有一个由原生重构创建目标堆栈的案例，在目标堆栈没有 `RoleARN` 的情况下也成功了，因此仅缺少这个字段并没有复现失败。一个通过导入生成的一次性测试案例也成功了，但我们没有使用导入来恢复生产环境。另一个显式指定名称的导入案例始终没有启动，因此不构成任何结果。

25 个只是已测试成功的规模，并不是我们发现的 AWS 限制。资源数量、目标堆栈的创建方式和回滚残留，都是值得调查的维度。这些结果既没有揭示服务内部的根因，也不能保证小批次能恢复另一个堆栈。

## 回滚后，堆栈清单与标签出现了分歧

在隔离环境中那次 58 个告警的操作失败后，CloudFormation 的资源清单显示告警已回到源堆栈。然而，49 个告警的系统标签仍指向后来被删除的目标堆栈，只有 9 个指向源堆栈。清理过程中还遇到了 `GetTemplate` 的 `InternalFailure`。

因此，只凭 `aws:cloudformation:stack-id` 检查资源归属，会得到错误的判断。我们分别比较了堆栈清单、物理 ID、实时配置和标签。这种分歧本身，就是恢复依赖这些资源的发布前需要解决的问题。

在恢复实验中，我们连续两次向同一个目标堆栈各迁移 2 个告警，全部 58 个资源的身份和配置均得到保留。迁走的 4 个告警，其系统标签全部正确。我们没有手动写入受保护的 `aws:` 标签。之后也验证了清理结果，没有留下任何一次性测试堆栈或告警。

还有两个历史细节可能误导重新排查的人。堆栈恢复后，仍保留着 22 条 `UPDATE_FAILED` 告警记录；仅凭这些记录，不能证明当前的物理告警仍处于故障状态。一个过时的预览从 `ListStackRefactors` 中消失了，但用其确切 ID 仍能读取。应将时间戳与资源提供程序的实时状态对照；对于已知操作，即使列表中没有，也应直接查询。我们[固定到具体提交的资源归属指南](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/monitoring-stack-migration.md)记录了这两项观察。

## 恢复的终点，是一次常规发布

生产环境的迁移通过 4 个原生批次完成：先迁移 8 个指标筛选器，再依次迁移 25 个、25 个和 8 个告警。迁移期间，全部 497 个原始物理资源的身份和类型都得到了保留。全部 66 个监控资源最终都进入了监控堆栈。

我们把恢复是否完成拆成了 4 个独立的问题：

| 恢复结果 | 需要收集的证据 |
| --- | --- |
| 堆栈可操作 | 两个堆栈的最新状态，并查明每个已知重构操作的状态。 |
| 资源、配置和数据得到保留 | 前后的资源身份及设置对比，加上针对具体服务的数据检查。仅凭物理 ID 未变，无法证明数据完整。 |
| 应用健康 | 当前的健康检查，以及相关的 Web、Agent API 和 MCP 冒烟流程。 |
| 能够按常规流程部署 | 一个已知提交通过正常发布路径成功部署。 |

[拆分后的首次正常发布](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37061435128)成功部署了提交 `ad297a8`。[后续的一次常规发布](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37073868147)对应提交 `0a530c7`，全部 9 个作业和 3 个冒烟流程均通过。平台、Web 和管理端报告的部署提交都符合预期。

后面这次发布按预期替换了 1 个不可变的 `AWS::Lambda::Version`。其余 496 个原始资源的身份保持不变，其中包括全部 66 个监控资源。这与迁移时保留全部 497 个资源身份，是两次不同的比较：常规发布创建了新的 Lambda 版本，并不会推翻先前的迁移结果。[固定到具体提交的完成证据](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/monitoring-stack-migration.md#verified-completion-evidence)记录了这两项结果。

验证完成后，我们撤除了临时的重构访问权限和诊断工具。完成后的发布辅助程序会检查资源归属，不会重新执行迁移。我们以一个已知提交的常规发布作为终点，并用资源对比和通过的应用检查来支撑结论。这些证据表明，我们终于又能发布了。
