---
title: "在 Cursor IDE 中使用 Jupyter Notebook 与 LLM：AI 驱动的数据分析工作流"
date: 2026-04-11
slug: "cursor-ide-jupyter-notebooks-llm-ai-shuju-fenxi"
description: "学习如何在 Cursor IDE 中把 Jupyter Notebook、LLM 与数据分析整合到同一套工作流里，用纯文本 notebook 完成探索、代码生成、可视化、文档整理与报告导出，减少在编辑器、浏览器和聊天窗口之间来回切换，让 AI 协作更顺畅，显著提升研究、分析与写作效率。"
tags: [productivity, cursor-ide, ai, llm]
publish: true
thumbnailUrl: "/articles/jupyter-2025-04-25.webp"
language: "zh"
originalArticle:
  language: "en"
  slug: "jupyter-notebooks-cursor-ide-llm-ai-tutorial"
translations:
  - language: "en"
    slug: "jupyter-notebooks-cursor-ide-llm-ai-tutorial"
  - language: "es"
    slug: "jupyter-notebooks-cursor-ide-llm-ia-analisis-datos"
  - language: "hi"
    slug: "cursor-ide-jupyter-notebooks-llm-ai-data-analysis"
  - language: "ar"
    slug: "jupyter-notebooks-cursor-ide-llm-ai-ltahlil-albayanat"
---

# 从挫败到顺手：我在 Cursor IDE 中把 Jupyter Notebook 与 LLM 串成一条工作流

## 问题：LLM 和 Jupyter Notebook 一直配合得不够好

那天凌晨两点，我终于承认自己卡住了。我的基因测序分析推进不下去，因为 Cursor IDE 里的 LLM 助手没法稳定理解 Jupyter notebook 那套复杂的 JSON 结构。每次我让 AI 帮我改可视化代码，最后生成的都是坏掉的 JSON，连 notebook 都打不开。我也试过只贴几段代码，但这样又会丢掉预处理步骤的上下文。与此同时，我桌面上常年开着三个窗口：浏览器里的 Jupyter、负责“正式开发”的 VSCode，以及另一个写文档的编辑器。Jupyter 文件格式本身和 LLM 的适配问题，再叠加不断切换工具的成本，让复杂数据分析几乎没法顺畅进行。哪怕只是 Iris 这种经典基准数据集，这种根本性不兼容也一样在拖慢节奏。

听起来是不是很熟悉？数据科学工作流最折磨人的地方之一，就是频繁切换上下文。你总是在下面这些工具之间跳来跳去：

- 写“正式代码”的编辑器
- 用来探索数据的 Jupyter notebook
- 用来整理结论和分享结果的文档工具
- 负责出图的可视化软件
- 浏览器里开着的 ChatGPT 和 Claude

每切换一次，都会消耗掉一点注意力，也会让探索过程多一层摩擦。问题是，这种损耗积累起来非常可观。那有没有一种更顺手的做法？

> **如果你更喜欢视频教程：** 我录了一份完整的分步演示。[观看在 Cursor IDE 中使用 Jupyter Notebook 与 AI 做数据分析的视频教程](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)，可以直接看到整套流程如何运行。

[![在 Cursor IDE 中完成数据可视化后的 Jupyter 工作流效果图](/articles/assets/jupyter-notebooks/jupyter-workflow-result.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

## 发现：把数据科学工作流统一到 Cursor IDE 里

后来我碰到一个彻底改变工作方式的方案：直接在 Cursor IDE 里使用 Jupyter notebook，再把 AI 的能力叠加上去。这种做法把几样关键能力合到了一起：

- Jupyter 按 cell 交互执行的体验
- 真正的 IDE 才有的编辑、导航和重构能力
- 既理解代码也理解数据分析语境的 AI 助手
- 更适合版本控制的纯文本文件格式

看完这篇文章后，你会看到我是怎样搭出一个统一环境，让自己能够：

- 用更少的手写代码完成数据分析和可视化
- 做出能暴露隐藏模式的 3D 图表
- 把分析结论直接写在代码旁边
- 用一条命令导出专业质量的报告
- 全程尽量不再切换工具

如果你也受够了这种不断被打断的感觉，那就从这里开始。

## 在 Cursor IDE 中准备 Jupyter 环境

任何顺畅的工作流，前提都是环境准备到位。要在 Cursor IDE 中把 Jupyter 用顺手，先把工具和依赖配好。

### 安装 Jupyter 扩展

一切都从 Cursor IDE 的 Jupyter 扩展开始：

1. 打开 Cursor IDE，创建一个项目目录。
2. 进入侧边栏里的 `Extensions` 面板。
3. 搜索 `Jupyter`，找到官方扩展。
4. 点击 `Install`。

这个扩展是传统 notebook 和 IDE 之间的桥梁。它带来的关键能力是：你可以在普通 Python 文件里，通过特殊标记创建可执行的 cell。换句话说，你不必再依赖结构复杂的 `.ipynb` 文件，而是可以直接用纯文本 Python 文件完成 notebook 工作流。

如果你想先了解 Jupyter Notebook 本身的能力，可以看看 [Jupyter Notebook 官方文档](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html)。

### 准备 Python 环境

扩展安装完成后，下一步是准备一个干净的 Python 环境：

```bash
python -m venv .venv
```

接着创建一个 `pyproject.toml` 文件来管理依赖：

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

然后在虚拟环境里安装依赖：

```bash
pip install -e .
```

这一步我是真踩过坑：只要依赖版本冲突，后面就会冒出一堆看起来毫无规律的报错。凡是 AI 生成了会导入某个库的代码，最好先确认那个库真的已经装在当前环境里。

## 创建第一个 Notebook：纯文本方式的优势

传统 Jupyter notebook 使用的是 `.ipynb` 格式，本质上是复杂的 JSON。这个格式不适合直接编辑，也很难让 AI 在不破坏结构的前提下修改内容。相比之下，纯文本方式能同时保留 notebook 的交互式体验和 IDE 的工程化优势。

### 原始 Jupyter Notebook 的问题

下面是一个传统 `.ipynb` 文件在文本编辑器里打开时的样子：

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
          "text": ["Hello, world!"]
        }
      ],
      "source": [
        "print(\"Hello, world!\")"
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

这种结构对 LLM 尤其不友好，主要有几个原因：

[![传统 Jupyter notebook 文件的复杂 JSON 结构](/articles/assets/jupyter-notebooks/jupyter-json-structure.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

1. JSON 里充满了与实际内容无关的符号和嵌套结构。
2. 每个 cell 的内容都被存成字符串数组，还带有换行和引号转义。
3. 代码和输出分散在不同位置，不利于整体理解。
4. 哪怕只是改一小段内容，也得保证整个 JSON 结构仍然合法。
5. 内容稍微一改，生成的 diff 往往会变得很大，不利于 AI 精准修改。

因此，LLM 在处理这种格式时，很容易一边改内容，一边把 JSON 结构弄坏，最后生成无法打开的 notebook。

### Cell 标记的魔法

创建一个 `main.py` 文件，先加入第一个 cell：

```python
# %%
# 导入所需库
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 调整显示设置，方便查看数据
pd.set_option('display.max_columns', None)
plt.style.use('ggplot')

print("数据分析环境已就绪！")
```

看到开头的 `# %%` 了吗？这就是关键标记。Jupyter 扩展会把它识别成一个代码 cell。加上这个标记后，编辑器旁边会出现运行按钮，你可以单独执行这一段，输出会直接显示在编辑器里。

再加一个 markdown cell：

```python
# %% [markdown]
"""
# Iris 数据集分析

这个 notebook 会用经典的 Iris 鸢尾花数据集来回答几个问题：
- 不同花朵测量特征之间有什么关系
- 这些特征能否有效区分物种
- 哪些特征最适合拿来做分类

数据集中的每朵花都属于以下三种物种之一：
1. Setosa
2. Versicolor
3. Virginica
"""
```

这就是一个非常强的组合：可执行代码和结构化说明都放在同一个纯文本文件里。没有额外文件格式，也没有浏览器端编辑的限制，对版本控制也更友好。

随着 notebook 逐渐成形，我会一直遵循这套结构：

- 用 `# %%` 表示代码 cell
- 用 `# %% [markdown]` 配合三引号写说明文字
- 按“载入数据 → 探索数据 → 可视化”的顺序组织内容
- 把过程和发现直接写在分析旁边

## 释放 LLM 助手：让 AI 成为数据分析搭档

真正让这套工作流发生质变的，是它和 Cursor AI 的结合。它不只是自动补全，而更像是一个能协作的分析搭档。

### Agent Mode：更像搭档的 AI 助手

在 Cursor IDE 中点击 `Composer`，再切换到 `Agent Mode`。启用之后，AI 助手会具备更完整的上下文能力，它能够：

- 在多轮对话中保留上下文
- 理解你的数据集和分析目标
- 直接生成符合 Jupyter 语法的完整代码 cell
- 根据数据内容生成合适的可视化

先让它帮我们导入一个数据集：

```text
请按这种 notebook 格式导入 Iris 数据集
```

AI 会生成一个完整且可执行的 cell：

```python
# %%
# 导入所需库
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

# 载入 Iris 数据集
iris = load_iris()

# 转成 pandas DataFrame
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['species'] = iris.target

# 查看前几行
print(df.head())
```

只用一句提示词，就能得到一个格式正确、可直接运行的 cell。函数名、导入方式和基本结构，AI 都会顺手帮你搭好。

更有意思的是，当我让它生成可视化时：

```text
请为 Iris 数据集生成一个三维散点图，用不同颜色表示三种物种
```

AI 会给出一个带旋转效果的 3D 可视化：

[![展示 Iris 数据集聚类分布的 3D 散点图](/articles/assets/jupyter-notebooks/jupyter-3d-visualization.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

```python
# %%
# 创建 3D 散点图
from mpl_toolkits.mplot3d import Axes3D

# 创建图形和 3D 坐标轴
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# 三个物种的名称
species_names = iris.target_names
colors = ['blue', 'red', 'green']

# 为每个物种使用不同颜色绘制散点
for species_id, species_name in enumerate(species_names):
    # 筛选当前物种的数据
    species_data = df[df['species'] == species_id]
    
    # 绘制当前物种
    ax.scatter(
        species_data['sepal length (cm)'],
        species_data['sepal width (cm)'],
        species_data['petal length (cm)'],
        c=colors[species_id],
        label=species_name,
        s=60,
        alpha=0.8
    )

# 设置坐标轴标签和标题
ax.set_xlabel('Sepal Length (cm)')
ax.set_ylabel('Sepal Width (cm)')
ax.set_zlabel('Petal Length (cm)')
ax.set_title('3D Scatter Plot of Iris Dataset')
ax.legend()

# 添加旋转效果，方便从不同角度观察
for angle in range(0, 360, 5):
    ax.view_init(30, angle)
    plt.draw()
    plt.pause(0.001)

plt.show()
```

这已经不只是“画出一个图”了，而是一个能从多个角度观察数据结构的动态 3D 散点图，标签、颜色和整体格式也都已经整理好了。

## 用 Cursor Rules 引导 LLM 生成更贴合你的代码

后来我发现，还可以在项目根目录创建 `.cursorrules` 文件，让 AI 生成的代码更稳定地贴近自己的习惯。这个文件本质上就是在告诉模型：写代码时请遵守这些偏好。

如果你想更系统地了解 Cursor rules，可以看看我写的另一篇文章：[如何用 Cursor rules 优化 AI 编码体验](/articles/cursor-ide-rules-for-ai)。

例如，我会加上这样的规则：

```text
<cursorrules_code_style>
- 优先使用函数式编程，而不是 OOP
- 使用输入输出清晰的纯函数
- 所有变量和函数都使用严格类型
</cursorrules_code_style>

<cursorrules_python_specifics>
- 数据模型优先使用 Pydantic，而不是 TypedDict
- 依赖管理优先使用 pyproject.toml，而不是 requirements.txt
- 处理复杂结构时，避免使用过于泛化的集合类型
</cursorrules_python_specifics>
```

规则写清楚之后，AI 生成的代码就会更接近我想要的风格，例如下面这种类型更明确的写法：

```python
# %%
# 使用 Pydantic 模型增强类型约束
from pydantic import BaseModel
from typing import List, Optional

class IrisFeatures(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float
    species: int
    species_name: Optional[str] = None

# 把 DataFrame 行转换成 Pydantic 模型
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

# 转换一个样本做演示
iris_models = convert_to_models(df.head())
for model in iris_models:
    print(model)
```

你会发现，模型基本会严格按规则行事：类型更明确、风格更一致，也更接近工程化写法。

## 分析 Iris 数据集：开始真正的数据探索

环境准备好，AI 助手也就位之后，就可以真正进入经典的 Iris 数据集分析了。

### 先看一眼数据

数据已经载入，接下来先看看基本结构：

```python
# %%
# 查看数据集的基础信息
print("数据集形状：", df.shape)
print("\n类别分布：")
print(df['species'].value_counts())

# 增加更易读的物种名称列
species_names = {0: 'setosa', 1: 'versicolor', 2: 'virginica'}
df['species_name'] = df['species'].map(species_names)

# 查看描述性统计
print("\n描述性统计：")
print(df.describe())
```

从这里可以看出，数据集共有 150 个样本，每个物种各 50 个，一共包含 4 个衡量花朵不同部位的特征。接着，我会用箱线图看看不同物种在各个特征上的分布：

```python
# %%
# 为每个特征绘制按物种分组的箱线图
plt.figure(figsize=(12, 10))

for i, feature in enumerate(iris.feature_names):
    plt.subplot(2, 2, i + 1)
    sns.boxplot(x='species_name', y=feature, data=df)
    plt.title(f'{feature} 在不同物种中的分布')
    plt.xticks(rotation=45)

plt.tight_layout()
plt.show()
```

这些图很快就揭示出几个明显规律：Setosa 的花萼偏宽，但花瓣明显更小；Virginica 的花瓣整体最大。那么，究竟哪些特征最能区分不同物种？

### 找出隐藏模式

要回答这个问题，就得看特征之间的关系：

```python
# %%
# 绘制 pairplot，查看特征两两之间的关系
sns.pairplot(df, hue='species_name', height=2.5)
plt.suptitle('Iris 数据集特征两两关系图', y=1.02)
plt.show()
```

这个 pairplot 非常直观。它一次性展示了所有特征的两两组合，并按物种着色。你几乎立刻就能看出：

1. 只要图里包含花瓣相关特征，Setosa 基本都会和另外两类完全分开。
2. Versicolor 和 Virginica 有一部分重叠，但仍然具备可区分性。
3. 花瓣长度和花瓣宽度，是区分三种物种最有效的特征。

而最醒目的图，还是前面那张 3D 散点图。随着视角不断旋转，你会看到某些角度下三种物种会形成非常清晰的分层，这种洞察在静态二维图里往往不容易第一眼看出来。

如果你想了解更多数据分析和可视化技巧，可以参考 [scikit-learn 用户指南](https://scikit-learn.org/stable/user_guide.html)。

## 解决 Jupyter 集成中的障碍：依赖问题排查

任何看起来很顺的工作流，背后都少不了排障。我在尝试更复杂的可视化时，就碰到了一个 Seaborn 导入错误：

```text
ImportError: Seaborn not valid package style
```

这是数据科学环境里非常常见的问题：依赖版本不兼容。为了确认到底哪里出了问题，我加了一个 cell 来检查当前安装版本：

```python
# %%
# 检查已安装依赖的版本
import pkg_resources
print("已安装的包：")
for package in ['numpy', 'pandas', 'matplotlib', 'seaborn', 'scikit-learn']:
    try:
        version = pkg_resources.get_distribution(package).version
        print(f"{package}: {version}")
    except pkg_resources.DistributionNotFound:
        print(f"{package}: 未安装")
```

最后我发现，是 Seaborn 版本和 NumPy 版本不兼容。解决方法也很直接，可以使用 Cursor 的弹出终端：

1. 点击底部面板里的终端图标。
2. 选择 `Pop out terminal`。
3. 执行更新命令：
   ```bash
   pip install seaborn --upgrade
   ```

这正是 Cursor IDE 的优势所在：我不需要切换到别的工具，也不用离开当前分析上下文，就能把依赖问题处理掉。

更方便的是，你还可以直接把报错信息发给 AI。很多时候，它会直接给出非常接近正确答案的修复命令。弹出终端和 AI 辅助结合起来，排障效率会比传统环境高很多。

## 做出真正有洞察的可视化

环境稳定之后，我想做的不只是“把图画出来”，而是做出真正能帮助理解数据模式的图。

### 从简单图表到 3D 可视化

我先从花瓣尺寸的散点图开始：

```python
# %%
# 绘制花瓣尺寸散点图
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

plt.title('不同物种的花瓣尺寸分布')
plt.xlabel('Petal Length (cm)')
plt.ylabel('Petal Width (cm)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

这个图很快就能看出，Setosa 在左下角形成了一个非常紧凑的簇。

为了更深入理解特征关系，我又画了一个相关性热力图：

```python
# %%
# 计算相关系数矩阵
correlation_matrix = df.drop(columns=['species_name']).corr()

# 绘制热力图
plt.figure(figsize=(10, 8))
sns.heatmap(
    correlation_matrix, 
    annot=True,
    cmap='coolwarm',
    linewidths=0.5,
    vmin=-1, 
    vmax=1
)
plt.title('Iris 特征相关性矩阵')
plt.show()
```

热力图显示，花瓣长度和花瓣宽度之间存在非常强的相关性，相关系数高达 0.96，也就是说这两个特征在自然条件下几乎是同步变化的。

不过最令人印象深刻的，依然是前面那张带旋转效果的 3D 散点图。随着观察角度变化，你会看到几个物种几乎完全分开的视角，这些模式在静态二维图中很容易被忽略。

这就是交互式数据可视化的价值：它能把抽象数字变成更直观、更贴近感知的理解。

## 分享分析结果：从探索走向展示

当这些洞察出现之后，下一步就是把结果分享给那些没有 Python 或 Jupyter 环境的同事。这时，Jupyter 扩展的导出能力就非常关键。

### 生成专业报告

为了生成一份可分享的报告，我通常会这样做：

1. 先确认所有 cell 都已经执行完，输出全部可见。
2. 补上 markdown cell，把方法、过程和结论解释清楚。
3. 使用 Jupyter 扩展里的 `Export as HTML`。
4. 在浏览器中打开导出的 HTML，再使用 `Save as PDF`。

[![将 Jupyter notebook 导出为专业 PDF 报告](/articles/assets/jupyter-notebooks/jupyter-pdf-export.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

最终导出的报告会同时包含代码、说明文字和可视化结果，而且任何人都能直接查看。前面在 markdown 里的排版投入，在这一步会非常值得，因为标题、列表和强调样式都会比较完整地保留下来。

如果我要把报告发给非技术背景的读者，我通常会提前把图表尺寸设得更适合展示，例如：

```python
plt.figure(figsize=(10, 6), dpi=300)
```

这样导出的 PDF 会更清晰，也更适合打印。

至于 3D 图，我会在导出前先把视角停在最能说明问题的角度，因为最终导出的 PDF 只能保留静态画面。只要这个角度选得好，报告里依然能突出你真正想强调的模式。

## 工作流的变化：在 Cursor IDE 中做 LLM 加持的数据分析

回头看，这个变化其实非常明显。以前我要在三个工具之间反复切换，现在整个流程可以在同一个环境里完成：

1. **探索：** 用 AI 帮我载入数据并搭出第一版可视化。
2. **发现：** 借助 Jupyter 的 cell 式执行方式持续细化分析。
3. **记录：** 直接在代码旁边补上 markdown，把结论和上下文写清楚。
4. **分享：** 用一条导出命令生成可以直接传播的完整报告。

Jupyter 的交互性、Cursor IDE 的编辑能力，再加上 AI 助手的参与，基本消除了过去那些会不断打断专注的摩擦。

还有一个经常被低估的额外好处：因为我用的是纯文本文件，而不是原始 `.ipynb`，整个分析过程终于可以被 Git 正常管理。我能清楚看到每次修改到底变了什么，也能显著减少 notebook 常见的合并冲突。

这种方式带来的不只是时间节省，它实际上改变了我做数据分析时的思考方式。因为不再被频繁切换工具打断，我更容易保持连贯的思路，也更容易顺着新发现继续深入。

如果你已经厌倦了在多个工具之间来回折腾，不妨试试这种集成方法：在 Cursor IDE 中配置好 Jupyter，配合 AI 助手，把数据分析、可视化和文档整理都放进同一条工作流里。

## 对比：传统 Jupyter 与 LLM 增强的 Cursor IDE 工作流

下面这张表可以快速概括传统 Jupyter Notebook 方案和 Cursor IDE 纯文本 Jupyter 方案之间的差别：

| 对比维度 | 传统 Jupyter Notebook | Cursor IDE + 纯文本 Jupyter |
|---------|------------------------|------------------------------|
| **文件格式** | 复杂 JSON（`.ipynb`） | 纯文本 Python（`.py`） |
| **版本控制** | diff 臃肿，容易出现合并冲突 | 非常友好，直接融入标准 Git 工作流 |
| **IDE 能力** | 代码导航和重构能力有限 | 拥有完整 IDE 能力，如搜索、替换和跳转 |
| **AI 辅助** | 能力有限 | LLM 集成更强，并且具备上下文理解能力 |
| **Cell 执行体验** | 主要依赖浏览器界面 | 直接在原生 IDE 环境中运行 |
| **工具切换成本** | 做复杂编辑时往往无法避免 | 基本都能在一个环境里完成 |
| **性能表现** | 大型 notebook 容易变慢 | 受益于原生编辑器性能 |
| **调试能力** | 调试工具相对有限 | 可以直接使用完整的 IDE 调试能力 |
| **导出选项** | 支持 HTML、PDF 等多种格式 | 通过扩展获得同样能力 |
| **协作方式** | 与版本控制结合时较麻烦 | 更符合标准代码协作流程 |
| **依赖管理** | 常常分散在额外环境文件里 | 更容易和项目环境管理整合 |
| **隐藏状态问题** | 乱序执行后很容易出现 | 线性执行习惯会减轻这类问题 |
| **Markdown 支持** | 原生支持 | 通过 cell 标记获得等价能力 |
| **类型检查** | 基本没有 | 可以直接享受 IDE 的静态分析能力 |
| **扩展生态** | 以 Jupyter 扩展为主 | 同时使用 IDE 扩展和 Jupyter 扩展 |

这样一对比就很清楚：如果你希望把 AI 真正纳入数据分析工作流，同时又想减少上下文切换，Cursor IDE 的这套做法会更适合长期使用。

如果你想更深入了解 Jupyter 整个生态的结构和能力，可以继续阅读 [Project Jupyter Documentation](https://docs.jupyter.org/en/latest/)。

## 视频教程：完整观看 Cursor IDE 中的 Jupyter 工作流

如果你更习惯用视频学习，我也录了一份完整教程，覆盖了本文讲到的全部内容：

[![在 Cursor IDE 中使用 Jupyter Notebook 的视频教程](/articles/assets/jupyter-notebooks/video-thumbnail.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

视频会逐步演示如何在 Cursor IDE 中配置并使用 Jupyter notebook、AI 集成是如何工作的、怎样生成可视化，以及怎样导出最终结果。整个过程都保持在同一个环境里，这也是这套工作流最有价值的地方。
