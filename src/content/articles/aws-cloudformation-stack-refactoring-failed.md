---
title: "AWS CloudFormation Stack Refactoring Failed: Our Recovery"
date: 2026-10-03
description: "A CloudFormation refactor blocked our releases. Exact alarm errors, read-only diagnostics, small-batch experiments, and proof of restored deployments."
tags: [aws, cloudformation, infrastructure, debugging]
publish: true
thumbnailUrl: "/articles/aws-cloudformation-stack-refactoring-failed.webp"
language: "en"
translations:
  - language: "es"
    slug: "aws-cloudformation-refactorizacion-stacks-fallida"
  - language: "zh"
    slug: "aws-cloudformation-duizhan-zhonggou-shibai"
  - language: "hi"
    slug: "aws-cloudformation-stack-refactoring-vifal"
  - language: "ar"
    slug: "aws-cloudformation-fashal-iadat-haykalat-stacks"
---

# AWS CloudFormation Stack Refactoring Failed: CloudWatch Alarms, Rollback Errors, and Recovery

Moving 58 CloudWatch alarms and eight metric filters into their own CloudFormation stack blocked our application releases. The source reached `UPDATE_ROLLBACK_FAILED`; the empty destination reached `ROLLBACK_FAILED`. Five accepted rollback requests failed to recover the stacks. AWS eventually repaired them internally. Then our next bulk move failed with a different error.

This was the monitoring split for my open-source flashcards app, the same project whose [agent API I described here](/articles/sql-like-dsl-for-ai-agents/). The source had 497 physical resources. We wanted to move 66 monitoring resources and leave the database where it was. The verified impact was blocked releases; we did not establish an application outage or data loss.

We eventually moved all 66 resources, preserved the original identities during migration, and completed ordinary releases afterward. The useful part of this incident is how we established each of those results, despite misleading status fields and ownership tags.

## If your refactor is stuck, start here

| What you see | Next step |
| --- | --- |
| A completed refactor preview | Read `ExecutionStatus` and its reason as well as `Status`. Compare every proposed resource mapping with your baseline before executing. |
| `UPDATE_ROLLBACK_FAILED` or a failed refactor rollback | Capture the operation, both stacks and timestamped errors. Retry only after identifying what prerequisite has changed. |
| An `AlarmName` null or unsupported tag-schema error | Keep the exact message tied to its operation. In our incident, these appeared at different stages. |
| Inventory and system tags disagree | Compare physical IDs and provider settings with both stack inventories. Pause dependent deployments until ownership is understood. |
| AWS reports recovery complete | Check stack operability, resource preservation, application health and an ordinary deployment separately. |

Our production batch sizes came from bounded experiments after AWS recovered the original stacks. They are observations to investigate, not a general recovery recipe.

![A worker lowers a tray of intact pottery into a small skiff while a larger cargo boat passes through an open canal lock](/articles/aws-cloudformation-stack-refactoring-failed.webp)

## Collect the current state before another retry

These commands only read AWS state. Replace every quoted placeholder with your own value, retain the JSON privately, and repeat the stack commands for each participating stack. Templates and outputs can contain sensitive details.

Start with the caller, stack state and exact refactor operation:

```bash
aws --profile '<profile>' --region '<region>' sts get-caller-identity \
  --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation describe-stacks \
  --stack-name '<stack-id>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudformation describe-stack-refactor \
  --stack-refactor-id '<refactor-id>' --output json --no-cli-pager
```

`get-caller-identity` identifies your diagnostic session. It does not identify every role CloudFormation used during the failure. Preserve the stack's `RoleARN` when present and investigate the execution identity separately.

Then collect events, inventory, templates and proposed actions:

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

Pagination stays enabled. `--no-cli-pager` disables the terminal viewer, not pagination. Do not add `--no-paginate` or leave a `--max-items` limit unhandled when collecting complete evidence. For deliberately limited CLI results, continue with the returned token through `--starting-token`; direct API callers must follow every `NextToken`. See the [CLI pagination options](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/list-stack-refactors.html) and [ListStackRefactors API](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStackRefactors.html).

For each affected alarm, compare provider state and tags with the stack inventory:

```bash
aws --profile '<profile>' --region '<region>' cloudwatch describe-alarms \
  --alarm-names '<alarm-name>' --output json --no-cli-pager

aws --profile '<profile>' --region '<region>' cloudwatch list-tags-for-resource \
  --resource-arn '<alarm-arn>' --output json --no-cli-pager
```

Keep the before/after logical-to-physical mappings, resource types and settings, including metric-filter settings if filters are involved. A fresh snapshot tells you what exists now; you still need the pre-move baseline to establish preservation.

Pause dependent deployments if ownership is uncertain, an operation times out, or the same retry fails without a changed prerequisite. A timeout does not prove execution stopped. Deleting resources, replacing roles, reversing the move or switching to retain/import all need a separate, reviewed recovery plan.

For AWS Support, prepare a private packet: account and region, stack and operation IDs, UTC timeline, exact errors and request IDs, commit and CI run, role/policy evidence, template comparisons, skip IDs, attempted recoveries and application impact. If Support asks you to preserve the incident state, continue read-only observation until that hold is lifted.

## Preview success did not mean the move succeeded

Native [CloudFormation stack refactoring](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stack-refactoring.html) reorganizes existing resources while preserving their properties and data. Check its resource eligibility, stack-policy, dependency and stack-dependent pseudo-parameter restrictions before attempting a move. Configuration changes belong in a separate update.

The API distinguishes creating a refactor from executing it. Our later failed experiment returned both of these fields:

```json
{
  "Status": "CREATE_COMPLETE",
  "ExecutionStatus": "ROLLBACK_COMPLETE"
}
```

The preview had completed; the move had rolled back. Read both reason fields too: `StatusReason` and `ExecutionStatusReason`. The [DescribeStackRefactor API reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackRefactor.html) defines them separately.

Our initial rollback problem had a different symptom. Historical alarm resource records contained this provider message, with the request token removed:

```text
Resource handler returned message: "Cannot invoke "String.equals(Object)" because the return value of "software.amazon.cloudwatch.alarm.ResourceModel.getAlarmName()" is null" (HandlerErrorCode: InternalFailure)
```

The null `AlarmName` was useful evidence for escalation. It did not identify a self-service repair.

## Five accepted rollback requests still left us blocked

Our five attempts included a verified request to skip 22 alarms and an AWS engineer-requested retry on September 27 at 08:39 UTC. The service accepted the requests, but their operations failed. Repeating the call did not establish progress.

AWS limits `continue-update-rollback` and `ResourcesToSkip` to a specific recovery path: skip eligible resources that failed during rollback, use the minimum necessary set, and reconcile skipped resources with the template before the next update. A skip does not establish that the live resource matches the template. Follow the [AWS rollback procedure](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html) for that decision.

Both stack statuses changed around October 1 at 22:00 UTC. The next morning, AWS Support confirmed that its internal team had recovered both stacks and deployments could resume. Thanks to that team for getting us out of the stuck state. AWS did not provide an internal repair command or establish that it had shipped a general service patch. The sanitized chronology is in our [pinned incident procedure](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/aws-infrastructure-changes.md).

## The RDS explanation depended on which identity made the read

AWS attributed the original failure to a missing `rds:DescribeDBInstances` permission under the execution role. Its explanation was that resolving the RDS endpoint in stack outputs required that read, even though the database was staying in the application stack.

That was AWS's assessment. Our independent observations did not establish the complete root cause. We saw the named role with `AdministratorAccess` and an allowed IAM simulation result, but neither reconstructed its historical policy or the actual service session at failure time.

There are several identities to account for: the CI caller, assumed deployment or lookup roles, the caller of the native refactor API, and CloudFormation's execution role. A database read that works in your shell only tests the identity used by that shell. The [service-role documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html) explains when CloudFormation uses a configured role's credentials; the [IAM simulator documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html) explains why simulation can differ from a live request.

The practical check is to trace that identity chain and required provider reads, including reads for resources referenced by outputs. Our evidence does not support prescribing one extra RDS permission as the cure for an alarm refactor failure.

## The next bulk failure reproduced without RDS

After AWS's internal recovery, another production bulk attempt rolled back. An isolated experiment reproduced the same error with 58 alarms and a destination created by native refactoring. There was no RDS dependency in that experiment. With the stack ARN prefix removed, the reason was:

```text
Stack Refactor does not support AWS::CloudWatch::Alarm because the resource type defines an unsupported tag schema.
```

An RDS read alone could not explain this later result. The message also sounded broader than our experiments supported: several native alarm moves worked.

| Experiment | Observed result |
| --- | --- |
| Single alarms with generated or explicit names and absent, empty or present tags | Native moves passed; physical identity, destination tags and cleanup verified. |
| Native-created destinations with 2, 10 and 25 alarms | Passed; IDs, configurations, destination system tags and cleanup verified. |
| Native-created destination with 58 alarms and no RDS | Rolled back with the unsupported tag-schema error. |
| Separate 58-alarm case with a precreated destination | Returned `InternalFailure`, a different error. |
| Two affected alarms moved, then another two into the same destination | Both moves passed; all 58 original identities and configurations remained intact. |

The public trail includes the [2/10/25 run](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37039188642), [58-alarm run](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37040911612) and [destination-reuse run](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37043811213). Logs may expire or require sign-in; the pinned incident documentation preserves the conclusions.

A single native-created case also passed without a destination `RoleARN`, so that absent field alone did not reproduce the failure. A disposable import-generated case passed, but we did not use import for production recovery. An explicit-name import case never started and contributes no result.

Twenty-five was a successful tested size, not a discovered AWS limit. Resource count, destination creation and rollback residue were useful dimensions to investigate. These results neither expose the service's internal root cause nor guarantee that smaller batches will recover another stack.

## Stack inventory and tags disagreed after rollback

After the isolated 58-alarm failure, CloudFormation inventory put the alarms back in the source. Yet 49 alarms retained system tags naming the subsequently deleted destination; only nine named the source. Cleanup also hit a `GetTemplate` `InternalFailure`.

An ownership check based only on `aws:cloudformation:stack-id` would therefore have given the wrong picture. We compared stack inventory, physical IDs, live configurations and tags separately. The disagreement itself was something to resolve before dependent releases.

In the recovery experiment, two successive two-alarm moves into the same destination preserved all 58 identities and configurations. System tags were correct for all four moved alarms. We did not manually write protected `aws:` tags. Cleanup was subsequently verified, with no disposable stacks or alarms left.

Two historical details could also mislead a fresh investigation. Twenty-two `UPDATE_FAILED` alarm rows remained after stack recovery; those rows alone did not prove a current physical alarm failure. An obsolete preview disappeared from `ListStackRefactors` but remained readable by its exact ID. Compare timestamps with live provider state, and directly describe known operations even when the list omits them. Our [pinned ownership guide](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/monitoring-stack-migration.md) records both observations.

## Recovery ended with an ordinary release

The production transfer completed in four native batches: eight metric filters, then 25 alarms, 25 alarms and eight alarms. All 497 original physical resource identities and types were preserved during migration. All 66 monitoring resources ended up in the monitoring stack.

We kept four recovery questions separate:

| Recovery outcome | Evidence to collect |
| --- | --- |
| Stack operability | Fresh statuses for both stacks and an accounted-for state for each known refactor operation. |
| Resource, configuration and data preservation | Before/after identity and settings comparisons, plus service-specific data checks. Unchanged physical IDs alone cannot prove data integrity. |
| Application health | Current health checks and the relevant web, Agent API and MCP smoke flows. |
| Ordinary deployment control | A known commit successfully deployed through the normal release path. |

The [first normal split release](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37061435128), at `ad297a8`, passed. The [subsequent ordinary release](https://github.com/kirill-markin/flashcards-open-source-app/actions/runs/37073868147), at `0a530c7`, passed all nine jobs and all three smoke flows. Platform, web and admin reported the expected deployed commit.

That later release intentionally replaced one immutable `AWS::Lambda::Version`. The other 496 original identities, including all 66 monitoring resources, remained unchanged. This is a separate comparison from the migration's preservation of all 497 identities: a normal release creating a new Lambda version does not invalidate the earlier migration result. The [pinned completion evidence](https://github.com/kirill-markin/flashcards-open-source-app/blob/d66cc6d02cc698654539d38361b5ed573b707963/docs/monitoring-stack-migration.md#verified-completion-evidence) records both.

After verification, we retired the temporary refactor access and diagnostic machinery. The release helper at that completed state checks ownership; it does not rerun the migration. The finish line was an ordinary release of a known commit, backed by resource comparisons and working application checks. That was the evidence that we could ship again.
