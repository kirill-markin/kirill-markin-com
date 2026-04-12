---
keywords: [
  "Jupyter Notebooks داخل Cursor IDE",
  "تحليل البيانات بالذكاء الاصطناعي",
  "LLM مع Jupyter",
  "Cursor IDE لعلم البيانات",
  "بديل ipynb النصي",
  "تصور البيانات في Jupyter",
  "تصدير Jupyter إلى PDF"
]
title: "Jupyter Notebooks مع LLM داخل Cursor IDE: سير عمل أذكى لتحليل البيانات"
date: 2026-04-11
slug: "jupyter-notebooks-cursor-ide-llm-ai-ltahlil-albayanat"
description: "تعلّم كيف تستخدم Jupyter Notebooks داخل Cursor IDE مع LLM لتحليل البيانات، وبناء التصورات، وكتابة التوثيق، وتصدير تقارير احترافية من بيئة عمل واحدة."
tags: [productivity, cursor-ide, ai, llm]
publish: true
thumbnailUrl: "/articles/jupyter-2025-04-25.webp"
language: "ar"
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
  - language: "es"
    slug: "jupyter-notebooks-cursor-ide-llm-ia-analisis-datos"
---

# من الإحباط إلى الانسياب: رحلتي مع Jupyter Notebooks وLLM داخل Cursor IDE

## المشكلة: نماذج اللغة وJupyter Notebooks لا تنسجمان بسهولة

كانت الساعة الثانية صباحًا عندما اعترفت أخيرًا بالهزيمة. كان تحليل التسلسل الجيني الذي أعمل عليه متوقفًا لأن مساعد LLM داخل Cursor IDE لم يستطع فهم البنية المعقدة لملف Jupyter Notebook بصيغة JSON. في كل مرة طلبت فيها من الذكاء الاصطناعي المساعدة في شيفرة التصور البصري، كانت النتيجة ملف JSON مكسورًا لا يفتح أصلًا. جرّبت إرسال مقتطفات صغيرة بدل الملف الكامل، لكن ذلك كان يزيل كل السياق المتعلق بخطوات المعالجة المسبقة. وفي الوقت نفسه كنت أتنقل بين ثلاث نوافذ: Jupyter في المتصفح، وVSCode للبرمجة "الحقيقية"، ومحرر آخر للتوثيق. الجمع بين قيود LLM وصيغة Jupyter وتبديل السياق المستمر جعل العمل الجاد على البيانات شبه مستحيل. وحتى مع مجموعات بيانات أبسط مثل Iris، كانت هذه الفجوة الأساسية تقتل إنتاجيتي.

هل يبدو هذا مألوفًا؟ سير عمل علم البيانات مرهق أصلًا، ويصبح أسوأ عندما تضطر إلى القفز باستمرار بين:
- محرر شيفرة للبرمجة الجدية
- Jupyter Notebooks للاستكشاف
- أداة توثيق لمشاركة النتائج
- برنامج رسوم أو تصورات
- ChatGPT وClaude المفتوحين في المتصفح لطرح الأسئلة

كل انتقال يستهلك جزءًا من طاقتك الذهنية ويضيف احتكاكًا يبطئ الاكتشاف. لكن ماذا لو أمكن جمع كل ذلك في مكان واحد؟

> **تفضل شرحًا بالفيديو؟** أنشأت عرضًا عمليًا خطوة بخطوة لهذا المسار كاملًا. [شاهد الشرح الكامل لاستخدام Jupyter Notebooks داخل Cursor IDE لتحليل البيانات بالذكاء الاصطناعي](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL) لترى هذه الطريقة أثناء التطبيق.

[![النتيجة النهائية لسير عمل Jupyter داخل Cursor IDE مع تصور البيانات](/articles/assets/jupyter-notebooks/jupyter-workflow-result.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

## الاكتشاف: توحيد سير عمل علم البيانات داخل Cursor IDE

هنا اكتشفت حلًا غيّر طريقتي في العمل: استخدام Jupyter Notebooks مباشرة داخل Cursor IDE مع الاستفادة من قدرات الذكاء الاصطناعي. هذا الأسلوب يجمع بين:

- التنفيذ التفاعلي المعتمد على الخلايا في Jupyter
- إمكانات التحرير والتنقل الموجودة في بيئة تطوير متكاملة حقيقية
- مساعدة بالذكاء الاصطناعي تفهم الشيفرة ومفاهيم علم البيانات معًا
- ملفات نصية عادية تتعامل بسلاسة مع أنظمة التحكم بالإصدارات

وبحلول نهاية هذا المقال، سترى كيف بنيت بيئة موحدة تسمح لي بأن:

- أحلل البيانات وأنشئ التصورات بأقل قدر ممكن من الكتابة اليدوية
- أبني رسومًا ثلاثية الأبعاد تكشف أنماطًا يصعب ملاحظتها
- أوثّق النتائج بجانب الشيفرة نفسها داخل الملف نفسه
- أصدّر تقارير احترافية بأمر واحد
- أفعل كل ذلك من دون التنقل المستمر بين أدوات متفرقة

إذا كنت تريد التخلص من فوضى تبديل السياق، فلنبدأ من الأساس.

## إعداد بيئة Jupyter داخل Cursor IDE: الأساس الذي يقوم عليه كل شيء

كل سير عمل جيد يبدأ بإعداد صحيح. لكي تستخدم Jupyter داخل Cursor IDE، تحتاج إلى تثبيت الأدوات المناسبة وتجهيز البيئة أولًا.

### تثبيت إضافة Jupyter

البداية تكون مع إضافة Jupyter الرسمية داخل Cursor IDE:

1. افتح Cursor IDE وأنشئ مجلد المشروع
2. انتقل إلى قسم Extensions في الشريط الجانبي
3. ابحث عن "Jupyter" واختر الإضافة الرسمية
4. اضغط "Install"

هذه الإضافة هي الجسر بين دفاتر Jupyter التقليدية وبيئة التطوير. والأهم أنها تفتح لك ميزة عملية جدًا: استخدام علامات خاصة داخل ملفات Python العادية لإنشاء خلايا قابلة للتنفيذ. لا حاجة بعد ذلك إلى التعامل المباشر مع ملفات `.ipynb` الثقيلة والمعقدة؛ يمكنك الاكتفاء بملف Python نصي واضح مع بعض العلامات البسيطة.

إذا أردت فهمًا أعمق لما يتيحه Jupyter Notebook نفسه، فراجع [الوثائق الرسمية](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html).

### تجهيز بيئة Python

بعد تثبيت الإضافة، حان وقت إعداد بيئة Python نظيفة:

```bash
python -m venv .venv
```

بعدها أنشئ ملف `pyproject.toml` لإدارة الاعتماديات:

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

ثم ثبّت هذه الاعتماديات داخل البيئة الافتراضية:

```bash
pip install -e .
```

تعلمت بالطريقة الصعبة أن تضارب الإصدارات يخلق أخطاء غامضة يصعب تفسيرها. عندما يقترح عليك الذكاء الاصطناعي شيفرة تستخدم مكتبات محددة، تأكد أولًا أن هذه المكتبات مثبتة فعلًا في بيئتك.

## إنشاء أول Notebook: قوة النص العادي

ملفات Jupyter التقليدية تستخدم صيغة `.ipynb`، وهي في جوهرها بنية JSON معقدة يصعب تحريرها يدويًا، ويصعب أكثر على أدوات الذكاء الاصطناعي تعديلها من دون كسرها. لذلك سأستخدم نهجًا أبسط يمنحني أفضل ما في العالمين: تفاعلية Jupyter مع وضوح الملفات النصية.

### المشكلة في ملفات Jupyter الأصلية

هذا مثال مبسط على شكل ملف `.ipynb` عندما تفتحه في محرر نصوص:

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

هذه البنية مربكة لنماذج اللغة لعدة أسباب:

[![البنية المعقدة لملف Jupyter Notebook التقليدي بصيغة JSON](/articles/assets/jupyter-notebooks/jupyter-json-structure.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

1. صيغة JSON مليئة برموز وطبقات متداخلة لا تعبّر مباشرة عن الفكرة أو التحليل
2. محتوى كل خلية مخزن داخل مصفوفات نصية مع محارف هروب للأسطر والاقتباسات
3. الشيفرة والمخرجات منفصلتان داخل أجزاء مختلفة من البنية
4. أي تعديل بسيط يتطلب الحفاظ على المخطط الكامل للملف حتى لا ينكسر
5. التغييرات الصغيرة في المحتوى تنتج فروقات كبيرة في الملف، ما يصعّب على الذكاء الاصطناعي توليد تعديلات دقيقة

ولهذا السبب، عندما يحاول LLM تعديل هذا النوع من الملفات مباشرة، كثيرًا ما ينجح في الفكرة ويفشل في الصيغة.

### سحر علامات الخلايا

أنشئ ملفًا باسم `main.py` وأضف أول خلية:

```python
# %%
# Import necessary libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Display settings for better visualization
pd.set_option('display.max_columns', None)
plt.style.use('ggplot')

print("Environment ready for data analysis!")
```

العلامة `# %%` هي المفتاح هنا. إضافة Jupyter تفهمها على أنها بداية خلية شيفرة، وعندها ستظهر لك أزرار التشغيل بجانبها. يمكنك تشغيل هذه الخلية وحدها، وستظهر النتائج مباشرة داخل المحرر.

بعد ذلك أضف خلية Markdown للتوثيق:

```python
# %% [markdown]
"""
# Iris Dataset Analysis

This notebook explores the famous Iris flower dataset to understand:
- The relationships between different flower measurements
- How these measurements can distinguish between species
- Which features provide the best separation between species

Each flower in the dataset belongs to one of three species:
1. Setosa
2. Versicolor
3. Virginica
"""
```

هذه تركيبة قوية جدًا: شيفرة قابلة للتنفيذ وتوثيق غني داخل ملف نصي واحد. لا صيغ خاصة معقدة، ولا قيود تحرير مرتبطة بالمتصفح، بل نص واضح يعمل جيدًا مع Git وأدوات المراجعة.

وأثناء بناء الـ notebook، من المفيد الحفاظ على هذا النمط:
- استخدم `# %%` لخلايا الشيفرة
- استخدم `# %% [markdown]` مع triple quotes لخلايا التوثيق
- رتّب الخلايا منطقيًا من تحميل البيانات إلى الاستكشاف ثم التصور
- وثّق خطواتك واستنتاجاتك أثناء التقدم، لا بعد الانتهاء

## إطلاق مساعد LLM: شريكك في تحليل البيانات

ما يجعل هذا الأسلوب مختلفًا فعلًا هو الدمج مع Composer في Cursor. الأمر لا يتعلق بالإكمال التلقائي فقط، بل بمساعد يفهم سياق تحليل البيانات ويستطيع العمل معك كشريك فعلي.

### Agent Mode: رفيق علم بيانات مدعوم بالذكاء الاصطناعي

داخل Cursor IDE، اضغط على زر "Composer" ثم اختر "Agent Mode". هذا يفعّل مساعدًا أكثر قدرة يمكنه:
- الحفاظ على السياق عبر عدة تفاعلات
- فهم مجموعة البيانات وأهداف التحليل
- توليد خلايا كاملة بصيغة Jupyter الصحيحة
- إنشاء تصورات مناسبة لبياناتك الفعلية

لنضعه في العمل عبر طلب استيراد مجموعة البيانات:

```text
Please import the Iris dataset in this notebook format
```

سينشئ خلية كاملة قابلة للتنفيذ:

```python
# %%
# Import necessary libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

# Load the Iris dataset
iris = load_iris()

# Convert to pandas DataFrame
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['species'] = iris.target

# Display the first few rows
print(df.head())
```

بمجرد طلب واحد فقط، تحصل على خلية مكتملة ومنسقة كما ينبغي لتحميل البيانات. لا حاجة لتذكر أسماء الدوال بدقة أو الصيغة المثالية؛ الذكاء الاصطناعي يتعامل مع ذلك.

لكن السحر الحقيقي يظهر عندما تطلب تصورًا بصريًا أكثر طموحًا:

```text
Generate a 3D scatter plot for the iris dataset showing the three species in different colors
```

عندها يولّد تصورًا ثلاثي الأبعاد متقدمًا:

[![تصور ثلاثي الأبعاد يوضح تجمعات Iris حسب الأنواع](/articles/assets/jupyter-notebooks/jupyter-3d-visualization.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

```python
# %%
# Create 3D scatter plot
from mpl_toolkits.mplot3d import Axes3D

# Create figure and 3D axis
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Get the three species
species_names = iris.target_names
colors = ['blue', 'red', 'green']

# Plot each species with a different color
for species_id, species_name in enumerate(species_names):
    # Filter data for this species
    species_data = df[df['species'] == species_id]
    
    # Plot this species
    ax.scatter(
        species_data['sepal length (cm)'],
        species_data['sepal width (cm)'],
        species_data['petal length (cm)'],
        c=colors[species_id],
        label=species_name,
        s=60,
        alpha=0.8
    )

# Set labels and title
ax.set_xlabel('Sepal Length (cm)')
ax.set_ylabel('Sepal Width (cm)')
ax.set_zlabel('Petal Length (cm)')
ax.set_title('3D Scatter Plot of Iris Dataset')
ax.legend()

# Add rotation for better visualization
for angle in range(0, 360, 5):
    ax.view_init(30, angle)
    plt.draw()
    plt.pause(0.001)

plt.show()
```

هذا ليس مجرد رسم بسيط، بل تصور ثلاثي الأبعاد متحرك يدور ليعرض البيانات من زوايا متعددة، مع تسميات وألوان وتنسيق كاملين، وكل ذلك انطلاقًا من طلب واحد.

## توجيه LLM باستخدام Cursor Rules للحصول على شيفرة أفضل

اكتشفت أيضًا أن بإمكاني جعل الذكاء الاصطناعي أكثر فائدة عبر إنشاء ملف `.cursorrules` في جذر المشروع. هذا الملف يحتوي تعليمات مخصصة توجه الطريقة التي يولد بها المساعد الشيفرة.

إذا أردت شرحًا أعمق لهذا الجانب، فراجع مقالتي التفصيلية عن [تحسين البرمجة بالذكاء الاصطناعي باستخدام Cursor rules](/articles/cursor-ide-rules-for-ai).

مثلًا، أضفت القواعد التالية:

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

مع هذه القواعد، بدأ الذكاء الاصطناعي يولد شيفرة أقرب بكثير إلى أسلوبي المفضل:

```python
# %%
# Define a Pydantic model for better type safety
from pydantic import BaseModel
from typing import List, Optional

class IrisFeatures(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float
    species: int
    species_name: Optional[str] = None

# Function to convert DataFrame rows to Pydantic models
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

# Convert a sample for demonstration
iris_models = convert_to_models(df.head())
for model in iris_models:
    print(model)
```

هنا أصبح المساعد يلتزم بالقواعد التي وضعتها: شيفرة ذات أنواع أوضح، ونمط أقرب إلى البرمجة الوظيفية، واستخدام Pydantic تمامًا كما طلبت.

## استكشاف مجموعة بيانات Iris باستخدام Python: بداية التحليل الفعلي

بعد تجهيز البيئة واستعداد المساعد، حان وقت بدء الرحلة داخل مجموعة بيانات Iris الكلاسيكية.

### نظرة أولى على البيانات

مجموعة البيانات محمّلة بالفعل، لكن لنفحص بنيتها أولًا:

```python
# %%
# Get basic information about the dataset
print("Dataset shape:", df.shape)
print("\nClass distribution:")
print(df['species'].value_counts())

# Create a more readable species column
species_names = {0: 'setosa', 1: 'versicolor', 2: 'virginica'}
df['species_name'] = df['species'].map(species_names)

# Display descriptive statistics
print("\nDescriptive statistics:")
print(df.describe())
```

يوضح هذا أن لدينا 150 عينة، بواقع 50 عينة لكل نوع، مع أربع خصائص تصف أجزاء مختلفة من الزهرة. بعد ذلك يمكننا تصور كل خاصية بحسب النوع:

```python
# %%
# Create boxplots for each feature by species
plt.figure(figsize=(12, 10))

for i, feature in enumerate(iris.feature_names):
    plt.subplot(2, 2, i+1)
    sns.boxplot(x='species_name', y=feature, data=df)
    plt.title(f'Distribution of {feature} by Species')
    plt.xticks(rotation=45)

plt.tight_layout()
plt.show()
```

تكشف هذه الرسوم الصندوقية أنماطًا واضحة جدًا. يتميز Setosa بسبلات أعرض وبتلات أصغر، بينما تمتلك Virginica أكبر البتلات عمومًا. لكن يبقى السؤال الأهم: أي الخصائص تفصل بين الأنواع بأوضح صورة؟

### كشف الأنماط المخفية

للإجابة عن ذلك، نحتاج إلى النظر في العلاقات بين الخصائص:

```python
# %%
# Create a pairplot to visualize relationships between features
sns.pairplot(df, hue='species_name', height=2.5)
plt.suptitle('Iris Dataset Pairwise Relationships', y=1.02)
plt.show()
```

هذا الرسم يكشف الكثير بسرعة:

1. نوع Setosa منفصل تمامًا تقريبًا في أي رسم يتضمن قياسات البتلات
2. هناك بعض التداخل بين Versicolor وVirginica، لكنه يظل قابلًا للفهم
3. طول البتلة وعرضها يقدمان أوضح فصل بين الأنواع الثلاثة

لكن أكثر تصور لافت كان الرسم الثلاثي الأبعاد الذي أنشأناه سابقًا. مع دوران المشهد، ظهرت زوايا تصبح فيها المجموعات الثلاث منفصلة بوضوح تام، وهو نوع من الفهم يصعب الوصول إليه برسوم ثنائية الأبعاد ثابتة.

إذا أردت التوسع في تقنيات التحليل والتصور، فراجع [دليل scikit-learn](https://scikit-learn.org/stable/user_guide.html)، فهو مرجع ممتاز في هذا المجال.

## تجاوز عقبات التكامل في Jupyter: حل مشكلات الاعتماديات

لا يوجد سير عمل حقيقي من دون عقبات. أثناء العمل على تصورات أكثر تعقيدًا، اصطدمت بخطأ استيراد متعلق بـ Seaborn:

```text
ImportError: Seaborn not valid package style
```

وهذا نوع شائع من المشاكل في مشاريع علم البيانات: عدم توافق الإصدارات بين الحزم. لتشخيصه، أضفت خلية تتحقق من الإصدارات المثبتة:

```python
# %%
# Check installed package versions
import pkg_resources
print("Installed packages:")
for package in ['numpy', 'pandas', 'matplotlib', 'seaborn', 'scikit-learn']:
    try:
        version = pkg_resources.get_distribution(package).version
        print(f"{package}: {version}")
    except pkg_resources.DistributionNotFound:
        print(f"{package}: Not installed")
```

اكتشفت أن إصدار Seaborn لم يكن متوافقًا مع إصدار NumPy لدي. وكان الحل بسيطًا عبر ميزة الطرفية المنبثقة في Cursor:

1. اضغط على أيقونة الطرفية في اللوحة السفلية
2. اختر "Pop out terminal"
3. شغّل أمر التحديث التالي:
   ```bash
   pip install seaborn --upgrade
   ```

هنا بالذات يظهر تفوق Cursor IDE: أصلحت مشكلة الاعتماديات من داخل البيئة نفسها، من دون الانتقال إلى أداة أخرى أو فقدان مكانك داخل التحليل.

والأفضل من ذلك أنني استطعت عرض رسالة الخطأ على الذكاء الاصطناعي، فاقترح مباشرة الأمر المناسب لإصلاحها. الجمع بين الطرفية المنبثقة ومساعدة LLM يجعل حل الأعطال أسرع بكثير من البيئات التقليدية.

## إنشاء تصورات تكشف الأنماط فعلاً: رسوم تفاعلية داخل Jupyter

بعد أن أصبحت البيئة مستقرة، أردت إنشاء تصورات لا تكون جميلة فقط، بل تساعد فعلًا على رؤية الأنماط المهمة في البيانات.

### من الرسوم البسيطة إلى التصورات ثلاثية الأبعاد

بدأت بمخطط scatter بسيط يركز على أبعاد البتلات:

```python
# %%
# Create a scatter plot of petal dimensions
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

هذا الرسم يوضح مباشرة كيف تفصل قياسات البتلات بين الأنواع، مع ظهور Setosa كتجمع صغير واضح في الزاوية السفلية اليسرى.

ولفهم العلاقات على نحو أعمق، أنشأت خريطة حرارية للارتباطات:

```python
# %%
# Calculate correlation matrix
correlation_matrix = df.drop(columns=['species_name']).corr()

# Create a heatmap
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

أظهرت الخريطة الحرارية ارتباطًا قويًا جدًا، يصل إلى 0.96، بين طول البتلة وعرضها. هذه الخصائص تتحرك معًا بوضوح في الطبيعة.

لكن التصور الأكثر إقناعًا ظل الرسم الثلاثي الأبعاد المتحرك. أثناء دورانه، ظهرت لحظات تصبح فيها الأنواع الثلاثة منفصلة تمامًا، كاشفةً أنماطًا لا يمكن ملاحظتها بالسهولة نفسها في الرسوم ثنائية الأبعاد الثابتة.

هذه هي قوة التصور التفاعلي للبيانات: إنه يحول الأرقام المجردة إلى فهم بصري مباشر.

## مشاركة النتائج: من التحليل إلى العرض

بعد الوصول إلى هذه الاستنتاجات، احتجت إلى مشاركتها مع زملاء لا يملكون Python أو Jupyter مثبتين على أجهزتهم. وهنا تصبح إمكانات التصدير في إضافة Jupyter ذات قيمة حقيقية.

### إنشاء تقارير احترافية

لإنشاء تقرير سهل المشاركة:

1. تأكدت من تنفيذ كل الخلايا بحيث تكون المخرجات ظاهرة
2. أضفت خلايا Markdown تشرح المنهجية والنتائج
3. استخدمت خيار "Export as HTML" في إضافة Jupyter
4. فتحت ملف HTML في المتصفح ثم استخدمت "Save as PDF" للحصول على نسخة نهائية أنيقة

[![تحويل Jupyter Notebook إلى تقرير PDF احترافي](/articles/assets/jupyter-notebooks/jupyter-pdf-export.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

النتيجة كانت تقريرًا يحتوي على الشيفرة والشرح النصي والتصورات كلها في صيغة يمكن لأي شخص قراءتها. والاهتمام بتنسيق Markdown أثمر هنا بوضوح: العناوين والقوائم والتأكيدات النصية انتقلت بسلاسة إلى المستند النهائي.

وعند إعداد مواد لعرضها على غير التقنيين، كنت أضبط حجم الرسوم وجودتها بما يناسب الطباعة:

```python
plt.figure(figsize=(10, 6), dpi=300)
```

هذا يضمن أن تبقى الرسوم واضحة ومقروءة داخل ملف PDF.

أما في التصورات ثلاثية الأبعاد، فكنت أختار الزاوية الأكثر إفادة قبل التصدير، لأن ملف PDF سيلتقط صورة ثابتة فقط. هذا الاختيار المسبق يساعدني على إبراز النمط الذي أريد للقارئ أن يلاحظه.

## كيف غيّر هذا الأسلوب سير عملي بالكامل

عندما أنظر إلى ما كنت أفعله سابقًا، يبدو الفرق كبيرًا. ما كان يتطلب ثلاث أدوات منفصلة وتبديلًا مستمرًا للسياق أصبح الآن يحدث بسلاسة داخل بيئة واحدة. صار سير عملي كالتالي:

1. **الاستكشاف:** أستخدم الذكاء الاصطناعي لتحميل البيانات وإنشاء تصورات أولية
2. **الاكتشاف:** أستفيد من تنفيذ الخلايا في Jupyter لتحسين التحليل خطوة بخطوة
3. **التوثيق:** أضيف خلايا Markdown لشرح النتائج بجانب الشيفرة مباشرة
4. **المشاركة:** أصدّر التحليل كاملًا كتقرير احترافي بأمر واحد

الجمع بين تفاعلية Jupyter، وقوة التحرير في Cursor IDE، ومساعدة LLM أزال الاحتكاك الذي كان يقطع تركيزي باستمرار. أصبحت أستطيع متابعة فضولي التحليلي من دون استنزاف ذهني مع كل انتقال بين الأدوات.

وهناك فائدة إضافية لم أكن أتوقعها: لأنني أستخدم ملفات نصية عادية بدل ملفات Jupyter الأصلية، أصبح التحليل كله خاضعًا لـ Git بصورة أفضل. أستطيع رؤية التغييرات بدقة، والتعاون مع الآخرين من دون معارك merge غير ضرورية، والاحتفاظ بتاريخ أنظف لعملي.

هذا الأسلوب لا يوفر الوقت فقط، بل يغير طريقة التفكير نفسها في تحليل البيانات. عندما يختفي عبء تبديل السياق، يصبح من الأسهل الحفاظ على حالة التدفق ومتابعة الفكرة حتى النهاية. التحليل يصبح أعمق، والتوثيق أكمل، والتصورات أكثر فاعلية.

إذا كنت متعبًا من التنقل بين عدة أدوات لإنجاز عمل واحد في علم البيانات، فأنصحك بتجربة هذا النهج المتكامل. جهّز Jupyter داخل Cursor IDE، واستفد من المساعد الذكي، واختبر بنفسك كيف يبدو العمل عندما تجتمع الأدوات في مكان واحد.

## مقارنة: Jupyter التقليدي مقابل Cursor IDE المعزز بـ LLM

يلخص الجدول التالي الفروقات الأساسية بين أسلوب Jupyter Notebook التقليدي وبين العمل داخل Cursor IDE باستخدام ملفات Jupyter النصية:

| الميزة | Jupyter Notebooks التقليدية | Cursor IDE مع Jupyter النصي |
|--------|------------------------------|------------------------------|
| **صيغة الملف** | JSON معقدة بصيغة `.ipynb` | ملف Python نصي عادي بصيغة `.py` |
| **التحكم بالإصدارات** | صعب بسبب الفروقات الكبيرة وتعارضات الدمج | ممتاز ضمن سير عمل Git المعتاد |
| **قدرات الـ IDE** | محدودة في التنقل وإعادة الهيكلة | قدرات IDE كاملة مثل البحث والاستبدال والتنقل |
| **مساعدة الذكاء الاصطناعي** | محدودة | تكامل قوي مع LLM وفهم أفضل للسياق |
| **تنفيذ الخلايا** | واجهة مبنية على المتصفح | داخل بيئة IDE نفسها |
| **تبديل السياق** | مطلوب عند التحرير المتقدم | كل شيء في بيئة واحدة |
| **الأداء** | قد يصبح بطيئًا مع الملفات الكبيرة | أداء محرر أصلي أكثر سلاسة |
| **تصحيح الأخطاء** | أدوات محدودة | أدوات تصحيح أخطاء كاملة داخل الـ IDE |
| **خيارات التصدير** | HTML وPDF وصيغ أخرى | الإمكانات نفسها عبر الإضافة |
| **التعاون** | مربك مع أنظمة التحكم بالإصدارات | أقرب إلى سير عمل التعاون البرمجي المعتاد |
| **إدارة الاعتماديات** | غالبًا في ملفات أو إعدادات منفصلة | أكثر تكاملًا داخل بيئة المشروع |
| **مشكلات الحالة المخفية** | شائعة بسبب التنفيذ غير المرتب | أقل بفضل تشجيع التنفيذ الخطي والواضح |
| **دعم Markdown** | مدمج أصلًا | متاح عبر علامات الخلايا مع قدرات مماثلة |
| **التحقق من الأنواع** | غير موجود عمليًا | مدعوم عبر أدوات التحليل الساكن في الـ IDE |
| **النظام البيئي للإضافات** | إضافات Jupyter | إضافات IDE إضافةً إلى إضافات Jupyter |

الفرق هنا واضح: إذا كنت تريد بيئة مناسبة للعمل الجاد في تحليل البيانات، مع استفادة حقيقية من الذكاء الاصطناعي ومن دون تقطيع مستمر في التركيز، فنهج Cursor IDE يمنحك مزايا عملية جدًا.

ولفهم أوسع لبنية Jupyter وقدراته، راجع [توثيق Project Jupyter](https://docs.jupyter.org/en/latest/)، فهو يقدم نظرة شاملة على النظام البيئي كاملًا.

## فيديو تعليمي: شاهد سير العمل الكامل لـ Jupyter داخل Cursor IDE

إذا كنت تفضل التعلم بصريًا، فقد سجلت فيديو شاملًا يمر على كل الأفكار التي تناولتها في هذا المقال:

[![فيديو Jupyter Notebooks داخل Cursor IDE](/articles/assets/jupyter-notebooks/video-thumbnail.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

في هذا الفيديو سترى كل خطوة عمليًا: إعداد Jupyter داخل Cursor IDE، واستخدام التكامل مع الذكاء الاصطناعي، وإنشاء التصورات، ثم تصدير النتيجة النهائية، وكل ذلك من دون مغادرة بيئة العمل نفسها.
