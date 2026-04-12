---
title: "在 Cursor IDE 中结合 LLM 使用 Jupyter Notebook：AI 驱动的数据分析"
date: 2026-04-11
slug: "cursor-ide-jupyter-notebooks-llm-ai-shuju-fenxi"
description: "学习如何在 Cursor IDE 中把 Jupyter Notebook、LLM 与数据分析整合进同一条工作流，用纯文本笔记本完成探索、可视化、文档整理与报告导出，减少在编辑器、浏览器和聊天窗口之间反复切换。"
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

# 从挫败到顺畅：我在 Cursor IDE 中借助 LLM 使用 Jupyter Notebook 的经历

## 问题：LLM 和 Jupyter 笔记本很难真正配合起来

那天凌晨两点，我终于承认自己遇到了瓶颈。我的基因测序分析卡住了，因为 Cursor IDE 里的 LLM 助手始终无法可靠地解析 Jupyter 笔记本那种复杂的 JSON 结构。每次我请 AI 帮忙处理可视化代码，它返回的都是损坏的 JSON，连笔记本都打不开。我也试过只发几段代码片段，可这样又会丢掉预处理步骤的上下文。与此同时，我还同时开着三个窗口：浏览器里的 Jupyter、负责“正式编码”的 VSCode，以及另一个用于写文档的编辑器。Jupyter 的文件格式、LLM 的局限，再加上不停切换上下文，让复杂的数据工作几乎无法顺畅推进。即便只是像 Iris 这样更简单的基准数据集，这种根本性的错位也在不断吞掉我的效率。

听起来熟悉吗？数据科学工作流特别容易被上下文切换拖垮。你总是在这些工具之间来回跳转：

- 用于“正式编程”的代码编辑器
- 用来探索数据的 Jupyter 笔记本
- 用来分享结论的文档工具
- 用来制作图表的可视化软件
- 浏览器里开着的 ChatGPT 和 Claude

每切换一次，都会额外消耗一点心力，也会让探索过程多出一层阻力。但如果有更好的做法呢？

> **更喜欢视频教程？** 我录了一份完整的分步演示。[观看在 Cursor IDE 中使用 Jupyter Notebook 与 AI 做数据分析的视频教程](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)，可以直接看到整套流程如何运作。

[![在 Cursor IDE 中完成数据可视化后的 Jupyter 工作流效果图](/articles/assets/jupyter-notebooks/jupyter-workflow-result.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

## 发现：在 Cursor IDE 中用 LLM 统一数据科学工作流

后来我找到了一种彻底改变工作方式的方案：直接在 Cursor IDE 里使用 Jupyter 笔记本，再把 AI 的能力叠加上去。这种方法把几项关键能力结合到了一起：

- Jupyter 按单元交互执行的体验
- 真正 IDE 才具备的强大编辑和导航能力
- 能理解代码和数据科学概念的 AI 辅助
- 与版本控制高度兼容的纯文本文件格式

读完这篇文章，你会看到我是如何搭建出一个一体化环境，让自己能够：

- 以更少的手写代码完成数据分析和可视化
- 创建能揭示数据隐藏模式的 3D 可视化
- 在代码旁边直接整理分析结论
- 用一条命令导出专业级报告
- 全程尽量不在不同工具之间来回切换

如果你也受够了这种不停被打断的感觉，我们就从这里开始。

## 在 Cursor IDE 中搭建 Jupyter 环境：基础准备

任何一段顺畅的工作流都离不开准备工作。要在 Cursor IDE 中用好 Jupyter，先把工具装齐，再把环境配置正确。

### 安装 Jupyter 扩展

这套流程的起点，是 Cursor IDE 的 Jupyter 扩展：

1. 打开 Cursor IDE，创建一个项目目录
2. 在侧边栏进入 `Extensions`
3. 搜索 `Jupyter`，找到官方扩展
4. 点击 `Install`

这个扩展就是传统 Jupyter 笔记本与 IDE 之间的桥梁。它带来的关键能力是：你可以在普通 Python 文件里，用特殊标记创建可执行单元。这样就不必再依赖结构复杂的 `.ipynb` 文件，而是可以直接用纯文本 Python 文件完成整套笔记本工作流。

如果你想进一步了解 Jupyter 笔记本的能力，可以查看 [Jupyter Notebook 官方文档](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html)。

### 准备 Python 环境

扩展装好后，接着准备一个规范的 Python 环境：

```bash
python -m venv .venv
```

然后创建一个 `pyproject.toml` 文件来管理依赖：

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

接着在虚拟环境里安装这些依赖：

```bash
pip install -e .
```

我是在踩过坑之后才明白，版本冲突会引发一些看上去莫名其妙的错误。只要 AI 生成的代码要导入某个库，最好先确认它确实已经安装在当前环境里。

## 创建你的第一个笔记本：纯文本的力量

传统 Jupyter 笔记本使用 `.ipynb` 格式，本质上是一种复杂的 JSON 结构。这个格式既不便于直接编辑，也几乎不可能让 AI 在不破坏结构的前提下稳定修改。相比之下，纯文本方式能兼顾两边的好处。

### 原生 Jupyter 笔记本的问题

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

这种结构对 Cursor 的 AI 功能所使用的 LLM 尤其麻烦，原因包括：

[![传统 Jupyter 笔记本文件的复杂 JSON 结构](/articles/assets/jupyter-notebooks/jupyter-json-structure.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

1. JSON 里有大量与内容本身无关的符号和嵌套结构
2. 每个单元的内容都被存成字符串数组，还带着换行和引号转义
3. 代码与输出分散在结构的不同位置
4. 哪怕只改一小处，也必须理解整个 JSON schema 才不至于把文件弄坏
5. 内容稍有变动，JSON diff 就会变得很大，AI 很难精确地产生修改

当 LLM 尝试修改这种格式时，往往很难一边保持 JSON 结构正确，一边完成有意义的内容更新。结果就是笔记本损坏，既打不开，也无法运行。

### 单元标记的魔法

创建一个名为 `main.py` 的文件，先加入第一个单元：

```python
# %%
# 导入所需库
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 设置显示选项，便于观察数据
pd.set_option('display.max_columns', None)
plt.style.use('ggplot')

print("数据分析环境已就绪！")
```

看到顶部的 `# %%` 了吗？这就是关键标记。Jupyter 扩展会把它识别为一个代码单元。加上这个标记后，你会看到旁边出现运行按钮；只执行这一段，结果就会直接显示在编辑器里。

再添加一个说明单元：

```python
# %% [markdown]
"""
# Iris 数据集分析

这个笔记本会探索经典的 Iris 鸢尾花数据集，重点回答以下问题：
- 不同花朵测量特征之间有什么关系
- 这些特征能否区分不同物种
- 哪些特征最能把不同物种区分开来

数据集中的每一朵花都属于以下三种物种之一：
1. Setosa
2. Versicolor
3. Virginica
"""
```

这是一种非常强的组合：可执行代码与完整文档共存在同一个纯文本文件里。没有额外文件格式，没有浏览器编辑的限制，版本控制也更顺手。

在逐步搭建这个笔记本时，我们会遵循下面的结构：

- 用 `# %%` 表示代码单元
- 用 `# %% [markdown]` 加三引号编写说明文本
- 按照“载入数据、探索数据、可视化数据”的逻辑推进
- 一边分析，一边把过程和发现记录下来

## 释放 LLM 助手：你的数据科学搭档

真正让这套工作流变得革命性的，是它和 Cursor AI Composer 的整合。它不只是自动补全，而更像一个理解数据科学语境的协作搭档。

### Agent Mode：LLM 驱动的数据科学助手

在 Cursor IDE 中点击 `Composer`，然后选择 `Agent Mode`。这样会启用一个更成熟的 AI 助手，它能够：

- 在多轮交互中保留上下文
- 理解你的数据集和分析目标
- 生成带有正确 Jupyter 语法的完整代码单元
- 根据你的数据创建合适的可视化

先让它帮我们导入一个数据集：

```text
请按这种笔记本格式导入 Iris 数据集
```

AI 会生成一个完整、可执行的单元：

```python
# %%
# 导入所需库
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

# 载入 Iris 数据集
iris = load_iris()

# 转换为 pandas DataFrame
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['species'] = iris.target

# 查看前几行
print(df.head())
```

只用一句简单提示词，我们就得到一个格式正确、可直接运行的代码单元。函数名、导入方式和整体结构都不需要再自己硬记，AI 会替你处理。

但真正的魔法，是当我们请它生成可视化时：

```text
请为 Iris 数据集生成一个三维散点图，用不同颜色表示三种物种
```

AI 会创建一个带有旋转效果的复杂 3D 可视化：

[![展示 Iris 数据集聚类分布的 3D 散点图](/articles/assets/jupyter-notebooks/jupyter-3d-visualization.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

```python
# %%
# 创建 3D 散点图
from mpl_toolkits.mplot3d import Axes3D

# 创建图形和 3D 坐标轴
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# 获取三种物种名称
species_names = iris.target_names
colors = ['blue', 'red', 'green']

# 为每个物种使用不同颜色绘图
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

# 设置标签和标题
ax.set_xlabel('Sepal Length (cm)')
ax.set_ylabel('Sepal Width (cm)')
ax.set_zlabel('Petal Length (cm)')
ax.set_title('3D Scatter Plot of Iris Dataset')
ax.legend()

# 添加旋转效果，便于观察
for angle in range(0, 360, 5):
    ax.view_init(30, angle)
    plt.draw()
    plt.pause(0.001)

plt.show()
```

这已经不只是“画一张图”而已，而是一张会旋转、能从多个角度呈现数据的 3D 可视化，标签、颜色和格式也都处理妥当，而且只来自一句提示词。

## 用 Cursor Rules 引导 LLM 生成更好的代码

我后来发现，还可以在项目根目录创建一个 `.cursorrules` 文件，让 AI 生成的代码更贴近自己的习惯。这个文件里放的是自定义说明，用来约束 AI 该如何写代码。

如果你想系统了解如何配置和使用 Cursor rules，可以参考我另一篇更详细的文章：[如何用 Cursor rules 优化 AI 编码体验](/articles/cursor-ide-rules-for-ai)。

例如，我加入了这些规则：

```text
<cursorrules_code_style>
- Prefer functional programming over OOP
- Use pure functions with clear input/output
- Use strict typing for all variables and functions
</cursorrules_code_style>

<cursorrules_python_specifics>
- Prefer Pydantic over TypedDict for data models
- Use pyproject.toml over requirements.txt
- For complex structures, avoid generic collections
</cursorrules_python_specifics>
```

加上这些规则后，AI 开始稳定生成符合我偏好的类型安全代码：

```python
# %%
# 定义 Pydantic 模型，增强类型安全
from pydantic import BaseModel
from typing import List, Optional

class IrisFeatures(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float
    species: int
    species_name: Optional[str] = None

# 将 DataFrame 行转换为 Pydantic 模型
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

AI 几乎完全按我的规则执行，生成了类型明确、偏函数式、并且使用 Pydantic 模型的代码，和我的要求高度一致。

## 用 Python 探索 Iris 数据集：我们的数据分析之旅

环境已经搭好，AI 助手也准备就绪，现在可以正式开始探索经典的 Iris 数据集了。

### 先看一眼数据

数据已经载入，但我们先看看它的整体结构：

```python
# %%
# 获取数据集的基础信息
print("Dataset shape:", df.shape)
print("\nClass distribution:")
print(df['species'].value_counts())

# 创建一个更易读的物种名称列
species_names = {0: 'setosa', 1: 'versicolor', 2: 'virginica'}
df['species_name'] = df['species'].map(species_names)

# 显示描述性统计
print("\nDescriptive statistics:")
print(df.describe())
```

从这里可以看出，我们有 150 个样本，每个物种各 50 个，共有 4 个描述花朵不同部位的特征。接着，再用箱线图看看各个特征在不同物种之间如何变化：

```python
# %%
# 为每个特征按物种绘制箱线图
plt.figure(figsize=(12, 10))

for i, feature in enumerate(iris.feature_names):
    plt.subplot(2, 2, i+1)
    sns.boxplot(x='species_name', y=feature, data=df)
    plt.title(f'Distribution of {feature} by Species')
    plt.xticks(rotation=45)

plt.tight_layout()
plt.show()
```

这些箱线图会揭示一些有趣的模式。Setosa 的花萼明显更宽，但花瓣较小；Virginica 的花瓣整体最大。不过，究竟哪些特征最能把不同物种分开？

### 找出隐藏模式

为了回答这个问题，我们需要看特征之间的关系：

```python
# %%
# 绘制 pairplot，查看特征之间的关系
sns.pairplot(df, hue='species_name', height=2.5)
plt.suptitle('Iris Dataset Pairwise Relationships', y=1.02)
plt.show()
```

这个 pairplot 很有启发性。它把所有特征的两两组合都画了出来，并按照物种着色。我们几乎可以立刻看出：

1. 只要图里包含花瓣测量值，Setosa（蓝色）就会与另外两种完全分开
2. Versicolor 和 Virginica 有一定重叠，但仍然可以区分
3. 花瓣长度和花瓣宽度最能清楚地区分三种物种

但最醒目的图，还是我们前面创建的 3D 散点图。随着图像旋转到不同角度，会出现几个视角让三种物种的聚类几乎完全分离，这种洞察在静态二维图里很难看出来。

如果你想进一步学习更高级的可视化和数据分析技巧，可以参考内容非常扎实的 [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)。

## 解决 Jupyter 集成障碍：排查依赖问题

任何一段工作流都会遇到挑战。等我开始尝试更复杂的可视化时，就碰到了一次 Seaborn 导入错误：

```text
ImportError: Seaborn not valid package style
```

这类问题在数据科学环境里很常见，本质上通常是包版本不兼容。为了定位问题，我加了一个单元来检查当前安装的版本：

```python
# %%
# 检查已安装依赖的版本
import pkg_resources
print("Installed packages:")
for package in ['numpy', 'pandas', 'matplotlib', 'seaborn', 'scikit-learn']:
    try:
        version = pkg_resources.get_distribution(package).version
        print(f"{package}: {version}")
    except pkg_resources.DistributionNotFound:
        print(f"{package}: Not installed")
```

最后我发现，是 Seaborn 的版本和 NumPy 版本不兼容。解决办法是利用 Cursor 的弹出终端功能：

1. 点击底部面板里的终端图标
2. 选择 `Pop out terminal`
3. 运行更新命令：
   ```bash
   pip install seaborn --upgrade
   ```

这正是 Cursor IDE 发挥优势的地方。我不需要切换工具，也不用离开当前分析上下文，就能把依赖问题修好。

更进一步说，我还可以直接把错误信息发给 AI，它会建议出准确的修复命令。弹出终端配合 AI 辅助，让排障速度比传统环境快得多。

## 让数据可视化真正揭示模式：在 Jupyter 中制作交互图表

环境顺畅起来之后，我想做的不只是“画出图”，而是让图真正帮助我理解数据模式。

### 从简单图表到 3D 可视化

我先从一个关注花瓣尺寸的简单散点图开始：

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

plt.title('Petal Dimensions by Species')
plt.xlabel('Petal Length (cm)')
plt.ylabel('Petal Width (cm)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

这个图会立刻显示出，Setosa 在左下角形成了一个紧密的簇，花瓣测量值和另外两种物种明显不同。

为了更深入理解这些关系，我又做了一个相关性热力图：

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
plt.title('Correlation Matrix of Iris Features')
plt.show()
```

热力图显示，花瓣长度和花瓣宽度之间存在非常强的相关性，相关系数达到 0.96，也就是说，这两个特征在自然状态下会一起变化。

不过，最令人印象深刻的仍然是前面那个带旋转效果的 3D 散点图。随着视角变化，会出现一些瞬间让三种物种完全分离，揭示出静态二维图根本看不见的模式。

这就是交互式数据可视化的力量。它把抽象数字转化为直观、具体、几乎带有身体感的理解。

## 分享我们的发现：从分析到展示

在挖出这些洞察之后，我需要把结果分享给那些没有安装 Python 或 Jupyter 的同事。这时，Jupyter 扩展的导出能力就变得非常关键。

### 制作专业报告

为了生成一份可分享的报告：

1. 我先确认所有单元都执行过，保证输出完整可见
2. 添加说明单元，解释方法和结论
3. 使用 Jupyter 扩展里的 `Export as HTML`
4. 在浏览器中打开 HTML 文件，再用 `Save as PDF` 生成更正式的文档

[![将 Jupyter 笔记本导出为专业 PDF 报告](/articles/assets/jupyter-notebooks/jupyter-pdf-export.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

最终得到的报告会包含全部代码、说明文字和可视化内容，而且任何人都可以打开查看。前面在 Markdown 排版上的细心处理也会在这里得到回报，因为标题、项目符号和强调样式都能较好地保留到最终文档中。

如果要把报告展示给非技术背景的受众，我通常会把图表尺寸调到更适合展示的规格，例如：

```python
plt.figure(figsize=(10, 6), dpi=300)
```

这样可以保证图表在导出的 PDF 里依然清晰、易读。

对于 3D 可视化，我会在导出之前把视角停在最能传达信息的角度，因为旋转动画最终会被导出为一张静态图。只要角度选得好，报告就能准确突出我想强调的模式。

## 工作流的转变：在 Cursor IDE 中做 LLM 加持的数据科学

回头看整个过程，这种变化相当明显。过去需要三套工具和不停切换上下文的工作，现在可以在一个环境里顺畅完成。我的流程变成了：

1. **探索：** 用 AI 帮忙载入数据并生成初步可视化
2. **发现：** 利用 Jupyter 的按单元执行方式交互式细化分析
3. **记录：** 通过说明单元把结论直接写在代码旁边
4. **分享：** 用一条命令把完整分析导出为专业报告

Jupyter 的交互性、Cursor IDE 强大的编辑能力，以及 AI 辅助结合在一起，消除了过去那些不断打断我专注的摩擦。我终于可以顺着自己的好奇心往前走，而不是不停为工具切换付出额外代价。

还有一个意料之外的好处：因为我用的是纯文本文件，而不是原始的 Jupyter 笔记本格式，整个分析流程终于能被 Git 好好管理。我可以清楚看到每个版本到底改了什么，和团队协作时也更不容易陷入合并冲突。

这不只是节省时间而已，它还改变了我理解数据分析的方式。没有那些频繁的上下文切换之后，我更容易保持心流，也更容易沿着一个发现继续深入。分析会更完整，文档会更充分，可视化也更有效。

如果你已经厌倦了为数据科学工作同时维护多个工具，我建议你试试这种一体化方法：在 Cursor IDE 中配置好 Jupyter，用上 AI 助手，亲自体验统一工作流带来的效率提升。未来某个凌晨两点的你，会感谢现在的自己。

## 对比：传统 Jupyter 与 LLM 增强的 Cursor IDE

下面这张表可以快速总结传统 Jupyter 笔记本方法和 Cursor IDE 中纯文本 Jupyter 工作流之间的关键差异：

| 对比项 | 传统 Jupyter 笔记本 | Cursor IDE + 纯文本 Jupyter |
|--------|----------------------|------------------------------|
| **文件格式** | 复杂 JSON（`.ipynb`） | 纯文本 Python（`.py`） |
| **版本控制** | 困难，diff 大且容易产生合并冲突 | 很好，可直接融入标准 Git 工作流 |
| **IDE 能力** | 代码导航与重构能力有限 | 拥有完整 IDE 能力，如搜索、替换与跳转 |
| **AI 辅助** | 有限 | LLM 集成更强，并具备上下文感知能力 |
| **单元执行** | 依赖浏览器界面 | 原生 IDE 环境 |
| **上下文切换** | 做复杂编辑时不可避免 | 所有事情都能在一个环境里完成 |
| **性能** | 大型笔记本时可能变慢 | 受益于原生编辑器性能 |
| **调试** | 调试能力有限 | 拥有完整的 IDE 调试工具 |
| **导出选项** | HTML、PDF 等多种格式 | 通过扩展提供同样能力 |
| **协作** | 与版本控制结合时比较困难 | 符合标准代码协作流程 |
| **依赖管理** | 通常分散在单独的环境文件中 | 环境管理可直接整合进项目 |
| **隐藏状态问题** | 乱序执行时很常见 | 因鼓励线性执行而有所减少 |
| **Markdown 支持** | 原生支持 | 通过单元标记获得同等能力 |
| **类型检查** | 没有 | 具备完整 IDE 静态分析支持 |
| **扩展生态** | Jupyter 扩展 | IDE 扩展 + Jupyter 扩展 |

这张对比表已经很清楚地说明了，为什么 Cursor IDE 这种做法对认真做数据分析的人会更有优势，尤其是在你想利用 AI 能力、又想保持工作流顺畅的时候。

如果你想更深入了解 Jupyter 的架构和能力，可以继续阅读 [Project Jupyter Documentation](https://docs.jupyter.org/en/latest/)。

## 视频教程：完整观看 Cursor IDE 中的 Jupyter 工作流

如果你更喜欢通过视频学习，我也制作了一份完整教程，逐步演示本文涉及的所有内容：

[![在 Cursor IDE 中使用 Jupyter Notebook 的视频教程](/articles/assets/jupyter-notebooks/video-thumbnail.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

视频会完整展示如何在 Cursor IDE 中设置并使用 Jupyter 笔记本、AI 集成是如何工作的、如何创建可视化，以及如何导出结果。整个过程都在同一个环境里完成，而这正是这套工作流最有价值的地方。
