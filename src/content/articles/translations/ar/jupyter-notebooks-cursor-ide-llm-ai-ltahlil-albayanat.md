---
keywords: [
  "دفاتر Jupyter داخل Cursor IDE",
  "تحليل البيانات بالذكاء الاصطناعي",
  "نماذج اللغة الكبيرة مع Jupyter",
  "Cursor IDE لتحليل البيانات",
  "بديل نصي لملفات ipynb",
  "تصور البيانات في Jupyter",
  "تحويل دفاتر Jupyter إلى PDF"
]
title: "دفاتر Jupyter مع نماذج اللغة الكبيرة داخل Cursor IDE لتحليل البيانات"
date: 2026-04-11
slug: "jupyter-notebooks-cursor-ide-llm-ai-ltahlil-albayanat"
description: "تعرّف إلى طريقة استخدام دفاتر Jupyter داخل Cursor IDE مع الذكاء الاصطناعي لتحليل البيانات، وبناء التصورات، وكتابة التوثيق، وتصدير تقارير احترافية من بيئة واحدة."
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

# من الإحباط إلى الانسياب: كيف غيّرت دفاتر Jupyter والذكاء الاصطناعي داخل Cursor IDE طريقة عملي

## المشكلة: نماذج اللغة الكبيرة ودفاتر Jupyter لا تتفاهم بسهولة

كانت الساعة الثانية صباحًا حين اعترفت أخيرًا بالهزيمة. كان تحليل التسلسل الجيني الذي أعمل عليه متعطلًا لأن مساعدي القائم على نماذج اللغة الكبيرة داخل Cursor IDE لم يستطع التعامل جيدًا مع بنية JSON المعقدة في دفتر Jupyter. وكل محاولة لطلب مساعدة من الذكاء الاصطناعي في شيفرة التصور البصري كانت تنتهي بملف JSON معطوب لا يفتح أصلًا. حاولت إرسال مقتطفات صغيرة بدلًا من الملف كاملًا، لكن ذلك انتزع كل السياق المتعلق بخطوات المعالجة المسبقة. وفي الوقت نفسه كنت أتنقل بين ثلاث نوافذ: Jupyter في المتصفح، وVSCode للبرمجة "الجدية"، ومحرر آخر للتوثيق. هذا المزيج من قيود نماذج اللغة وصيغة Jupyter وتبديل السياق المستمر جعل العمل المعقد على البيانات شبه مستحيل. وحتى مع مجموعات بيانات أبسط مثل Iris، كانت هذه الفجوة الأساسية تقتل إنتاجيتي.

هل يبدو لك هذا مألوفًا؟ سير العمل في علم البيانات مرهق أصلًا بسبب كثرة التنقل بين الأدوات. فأنت تقفز باستمرار بين:
- محررات الشيفرة للبرمجة "الجدية"
- دفاتر Jupyter للاستكشاف
- أدوات التوثيق لمشاركة النتائج
- برامج التصور لإنشاء الرسوم
- ChatGPT وClaude المفتوحين في المتصفح لطرح الأسئلة

كل انتقال يستهلك قدرًا من طاقتك الذهنية ويضيف احتكاكًا يبطئ الاكتشاف. لكن ماذا لو وُجدت طريقة أفضل؟

> **تفضل شرحًا بالفيديو؟** أعددت عرضًا عمليًا خطوة بخطوة لهذا المسار كاملًا. [شاهد الشرح الكامل لاستخدام Jupyter Notebooks داخل Cursor IDE لتحليل البيانات بالذكاء الاصطناعي](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL) لترى هذه الأساليب أثناء التطبيق.

[![النتيجة النهائية لسير عمل Jupyter داخل Cursor IDE مع تصور البيانات](/articles/assets/jupyter-notebooks/jupyter-workflow-result.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

## الاكتشاف: سير عمل موحد لعلم البيانات داخل Cursor IDE

هنا عثرت على حل غيّر طريقتي في العمل: استخدام دفاتر Jupyter مباشرة داخل Cursor IDE مع الاستفادة من قوة الذكاء الاصطناعي. هذا الأسلوب يجمع بين:

- التنفيذ التفاعلي المعتمد على الخلايا في Jupyter
- قدرات التحرير والتنقل الموجودة في بيئة تطوير متكاملة حقيقية
- مساعدة بالذكاء الاصطناعي تفهم الشيفرة ومفاهيم علم البيانات معًا
- ملفات نصية عادية تعمل بانسجام ممتاز مع أنظمة التحكم بالإصدارات

وبحلول نهاية هذا المقال، سأريك كيف بنيت بيئة متكاملة تسمح لي بأن:

- أحلل مجموعات البيانات وأنشئ التصورات بأقل قدر ممكن من الكتابة اليدوية
- أبني رسومًا ثلاثية الأبعاد تكشف أنماطًا خفية في البيانات
- أوثق نتائجي إلى جانب الشيفرة في صيغة أنيقة وواضحة
- أصدّر تقارير احترافية بأمر واحد
- أفعل كل ذلك من دون التنقل بين أدوات متفرقة

إذا كنت تريد وضع حد لفوضى تبديل السياق، فلنبدأ الرحلة.

## إعداد بيئة Jupyter داخل Cursor IDE: الأساس الذي يقوم عليه كل شيء

كل رحلة جيدة تحتاج إلى تجهيز. وحتى تستخدم Jupyter داخل Cursor IDE، عليك تثبيت الأدوات المناسبة وإعداد البيئة بشكل صحيح.

### تثبيت إضافة Jupyter

تبدأ الخطوة الأولى مع إضافة Jupyter الرسمية داخل Cursor IDE:

1. افتح Cursor IDE وأنشئ مجلدًا للمشروع
2. انتقل إلى قسم Extensions في الشريط الجانبي
3. ابحث عن "Jupyter" واختر الإضافة الرسمية
4. اضغط "Install"

هذه الإضافة هي الجسر بين دفاتر Jupyter التقليدية وبيئة التطوير. كما أنها تفتح لك ميزة مهمة جدًا: القدرة على استخدام علامات صياغية خاصة داخل ملفات Python العادية لإنشاء خلايا قابلة للتنفيذ. وبهذا لا تعود مضطرًا للتعامل مع ملفات `.ipynb` ذات البنية المعقدة، بل يمكنك استخدام ملف Python نصي بسيط مع بعض العلامات الخاصة.

إذا أردت معرفة المزيد عن دفاتر Jupyter وقدراتها، فراجع [الوثائق الرسمية لـ Jupyter Notebook](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html)، فهي تقدم شرحًا شاملًا للميزات وطريقة الاستخدام.

### تجهيز بيئة Python

بعد تثبيت الإضافة، حان وقت إعداد بيئة Python نظيفة:

```bash
python -m venv .venv
```

بعد ذلك أنشئ ملف `pyproject.toml` لإدارة الاعتماديات:

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

تعلمت بالطريقة الصعبة أن تضارب الإصدارات قد يسبب أخطاء غامضة ومربكة. وعندما يقترح عليك الذكاء الاصطناعي شيفرة تستورد مكتبات معينة، تحقق أولًا من أن هذه المكتبات مثبتة فعلًا في بيئتك.

## إنشاء أول دفتر: قوة النص العادي

تستخدم دفاتر Jupyter التقليدية صيغة `.ipynb`، وهي بنية JSON معقدة يصعب تحريرها مباشرة، ويكاد يكون من المستحيل على أدوات الذكاء الاصطناعي تعديلها من دون إفسادها. لذلك سنستخدم نهجًا نصيًا يمنحنا أفضل ما في العالمين.

### المشكلة في دفاتر Jupyter الأصلية

هذا مثال سريع على شكل ملف `.ipynb` عندما تفتحه في محرر نصوص:

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

هذه البنية صعبة على نماذج اللغة المستخدمة في ميزات الذكاء الاصطناعي داخل Cursor للأسباب التالية:

[![البنية المعقدة لملف Jupyter Notebook التقليدي بصيغة JSON](/articles/assets/jupyter-notebooks/jupyter-json-structure.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

1. صيغة JSON مليئة بالرموز والبنى المتداخلة التي لا ترتبط مباشرة بالمحتوى نفسه
2. محتوى كل خلية محفوظ داخل مصفوفة من السلاسل النصية مع محارف هروب للأسطر والاقتباسات
3. الشيفرة ومخرجاتها منفصلتان في أجزاء مختلفة من البنية
4. أي تعديل بسيط يتطلب فهم مخطط JSON كاملًا حتى لا ينكسر الملف
5. التغييرات الصغيرة في المحتوى تنتج فروقات كبيرة في JSON، ما يجعل التعديلات الدقيقة أصعب على الذكاء الاصطناعي

وعندما يحاول نموذج لغة كبير تعديل هذه الصيغة، فإنه غالبًا يعجز عن الحفاظ على البنية الصحيحة للملف أثناء إجراء تغييرات مفيدة في المحتوى. والنتيجة تكون دفاتر معطوبة لا تفتح أو لا تعمل كما ينبغي.

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

هل ترى العلامة `# %%` في الأعلى؟ هذه هي العلامة السحرية التي تخبر إضافة Jupyter بأن هذا الجزء خلية شيفرة. وعندما تضيفها ستلاحظ ظهور أزرار تشغيل بجانبها. يمكنك تنفيذ هذه الخلية وحدها، وستظهر النتائج مباشرة داخل المحرر.

لنضف الآن خلية `Markdown` للتوثيق:

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

هذه تركيبة قوية جدًا: شيفرة قابلة للتنفيذ وتوثيق غني داخل الملف النصي نفسه. لا صيغ خاصة، ولا قيود تحرير مرتبطة بالمتصفح، بل نص واضح يتعامل جيدًا مع أنظمة التحكم بالإصدارات.

وأثناء بناء الدفتر، سنسير وفق هذا النمط:
- استخدم `# %%` لخلايا الشيفرة
- استخدم `# %% [markdown]` مع علامات الاقتباس الثلاثية لخلايا التوثيق
- حافظ على تسلسل منطقي يبدأ بتحميل البيانات ثم الاستكشاف ثم التصور
- وثّق خطواتك ونتائجك أثناء التقدم

## إطلاق مساعد نماذج اللغة الكبيرة: شريكك في علم البيانات

ما يجعل هذا الأسلوب مختلفًا فعلًا هو الدمج مع AI Composer في Cursor. لا نتحدث هنا عن إكمال تلقائي بسيط، بل عن شريك تعاوني يفهم تحليل البيانات.

### وضع "Agent Mode": رفيق علم بيانات مدعوم بالذكاء الاصطناعي

داخل Cursor IDE، اضغط على زر "Composer" ثم اختر "Agent Mode". هذا يفعّل مساعدًا أكثر تطورًا يستطيع أن:
- يحافظ على السياق عبر عدة تفاعلات
- يفهم مجموعة البيانات وأهداف التحليل
- يولد خلايا كاملة مع صياغة Jupyter الصحيحة
- ينشئ تصورات مناسبة لبياناتك الفعلية

لنبدأ بطلب استيراد مجموعة بيانات:

```text
Please import the Iris dataset in this notebook format
```

سيولد الذكاء الاصطناعي خلية كاملة قابلة للتنفيذ:

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

بمجرد طلب بسيط واحد، تحصل على خلية مكتملة ومنسقة لتحميل البيانات. لا حاجة إلى تذكر الصياغة الدقيقة أو أسماء الدوال؛ الذكاء الاصطناعي يتولى ذلك.

لكن السحر الحقيقي يظهر عندما تطلب تصورًا بصريًا أكثر طموحًا:

```text
Generate a 3D scatter plot for the iris dataset showing the three species in different colors
```

عندها ينشئ تصورًا ثلاثي الأبعاد متقدمًا مع حركة دوران:

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

هذا ليس مجرد رسم بسيط، بل تصور ثلاثي الأبعاد متحرك يدور ليعرض البيانات من زوايا متعددة، مع تسميات صحيحة وألوان وتنسيق كامل. وكل ذلك انطلاقًا من طلب واحد.

## توجيه نموذج اللغة بقواعد Cursor للحصول على شيفرة أفضل

اكتشفت أن بإمكاني جعل الذكاء الاصطناعي أكثر فائدة عبر إنشاء ملف `.cursorrules` في جذر المشروع. هذا الملف يضم تعليمات مخصصة توجه طريقة توليد الشيفرة.

إذا أردت شرحًا مفصلًا لهذا الجانب، فراجع مقالتي عن [تحسين البرمجة بالذكاء الاصطناعي باستخدام Cursor rules](/articles/cursor-ide-rules-for-ai).

على سبيل المثال، أضفت القواعد التالية:

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

ومع هذه القواعد في مكانها، بدأ الذكاء الاصطناعي يولد شيفرة آمنة من ناحية الأنواع وتنسجم مع الأسلوب الذي أفضلّه:

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

هنا بدأ المساعد يلتزم بالقواعد التي وضعتها بدقة، فأنشأ شيفرة واضحة الأنواع، وقريبة من البرمجة الوظيفية، وتستخدم نماذج Pydantic تمامًا كما طلبت.

## استكشاف مجموعة بيانات Iris باستخدام Python: رحلة التحليل

بعد أن أصبحت البيئة جاهزة والمساعد حاضرًا، حان وقت بدء رحلتنا داخل مجموعة بيانات Iris الكلاسيكية.

### نظرة أولى على البيانات

البيانات محملة بالفعل، لكن لنستكشف بنيتها أولًا:

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

يُظهر هذا أن لدينا 150 عينة، بواقع 50 عينة لكل نوع، مع أربع خصائص تقيس أجزاء مختلفة من الزهرة. والآن لنصوّر كل خاصية لنرى كيف تتغير عبر الأنواع:

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

تكشف هذه الرسوم الصندوقية أنماطًا لافتة. يتميز Setosa بسبلات عريضة نسبيًا لكنه يملك بتلات صغيرة. أما Virginica فلديه أكبر البتلات عمومًا. لكن أي الخصائص تفصل بين الأنواع بأوضح صورة؟

### كشف الأنماط المخفية

للإجابة عن ذلك، علينا أن ننظر في العلاقات بين الخصائص:

```python
# %%
# Create a pairplot to visualize relationships between features
sns.pairplot(df, hue='species_name', height=2.5)
plt.suptitle('Iris Dataset Pairwise Relationships', y=1.02)
plt.show()
```

هذا المخطط يوضح بسرعة أن:

1. Setosa منفصل تمامًا تقريبًا عن بقية الأنواع في أي رسم يتضمن قياسات البتلات
2. هناك بعض التداخل بين Versicolor وVirginica، لكنه لا يمنع تمييزهما
3. طول البتلة وعرضها يقدمان أوضح فصل بين الأنواع الثلاثة

لكن أكثر تصور لافت كان الرسم الثلاثي الأبعاد الذي أنشأناه سابقًا. فمع دوران المشهد، تظهر زوايا يصبح فيها الفصل بين المجموعات شديد الوضوح، وهو نوع من الفهم يصعب الوصول إليه عبر رسوم ثنائية الأبعاد ثابتة.

إذا أردت التوسع في تقنيات التحليل والتصور، فيمكنك الرجوع إلى [دليل مستخدم scikit-learn](https://scikit-learn.org/stable/user_guide.html)، فهو مرجع ممتاز في التعلم الآلي ومعالجة البيانات.

## تجاوز عقبات تكامل Jupyter: تشخيص مشكلات الاعتماديات

لا تخلو أي رحلة من العقبات. ومع الانتقال إلى تصورات أكثر تعقيدًا، اصطدمت بمشكلة: خطأ استيراد متعلق بمكتبة Seaborn.

```text
ImportError: Seaborn not valid package style
```

وهذا من المشكلات الشائعة في مكتبات علم البيانات: تعارض الإصدارات بين الحزم. ولتشخيص السبب، أضفت خلية تتحقق من الإصدارات المثبتة:

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

اكتشفت أن إصدار Seaborn لم يكن متوافقًا مع إصدار NumPy المثبت لدي. وكان الحل استخدام ميزة الطرفية المنبثقة في Cursor:

1. اضغط على أيقونة الطرفية في اللوحة السفلية
2. اختر "Pop out terminal"
3. شغّل أمر التحديث التالي:
   ```bash
   pip install seaborn --upgrade
   ```

وهنا تحديدًا تظهر قوة Cursor IDE: استطعت حل مشكلة الاعتماديات من دون مغادرة البيئة أو فقدان مكاني في التحليل.

والأفضل من ذلك أنني استطعت عرض رسالة الخطأ على الذكاء الاصطناعي، فاقترح مباشرة الأمر المناسب لإصلاحها. هذا الدمج بين الطرفية المنبثقة والمساعدة الذكية يجعل استكشاف الأخطاء أسرع بكثير مما اعتدت عليه في البيئات التقليدية.

## إنشاء تصورات تكشف الأنماط فعلًا: رسوم تفاعلية داخل Jupyter

بعد أن أصبحت البيئة تعمل بسلاسة، أردت إنشاء تصورات لا تبدو جميلة فقط، بل تكشف فعلًا ما يحدث في البيانات.

### من الرسوم البسيطة إلى التصورات ثلاثية الأبعاد

بدأت بمخطط تبعثر بسيط يركز على أبعاد البتلات:

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

يوضح هذا الرسم مباشرة كيف تفصل قياسات البتلات بين الأنواع، مع ظهور Setosa كتجمع صغير واضح في الجهة السفلية اليسرى.

ولفهم العلاقات بعمق أكبر، أنشأت خريطة حرارية للارتباطات:

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

أظهرت الخريطة الحرارية ارتباطًا قويًا جدًا، بلغ 0.96، بين طول البتلة وعرضها. وهذا يعني أن هاتين الخاصيتين تتحركان معًا بوضوح في الطبيعة.

لكن التصور الأكثر لفتًا للنظر ظل الرسم الثلاثي الأبعاد المتحرك الذي أنشأناه سابقًا. فمع انتقاله بين زوايا الرؤية المختلفة، ظهرت لحظات تصبح فيها الأنواع الثلاثة منفصلة تمامًا، كاشفة أنماطًا لا يمكن ملاحظتها بالسهولة نفسها في الرسوم الثنائية الثابتة.

هذه هي قوة التصور التفاعلي للبيانات: إنه يحول الأرقام المجردة إلى فهم بصري مباشر وحسي.

## مشاركة النتائج: من التحليل إلى العرض

بعد الوصول إلى هذه الاستنتاجات، احتجت إلى مشاركتها مع زملاء لا يملكون Python أو Jupyter مثبتين على أجهزتهم. وهنا تظهر قيمة إمكانات التصدير في إضافة Jupyter.

### إنشاء تقارير احترافية

لإنتاج تقرير قابل للمشاركة:

1. تأكدت من تنفيذ جميع الخلايا حتى تظهر المخرجات
2. أضفت خلايا `Markdown` لشرح المنهجية والنتائج
3. استخدمت خيار "Export as HTML" في إضافة Jupyter
4. فتحت ملف HTML في المتصفح ثم استخدمت "Save as PDF" للحصول على مستند نهائي أنيق

[![تحويل Jupyter Notebook إلى تقرير PDF احترافي](/articles/assets/jupyter-notebooks/jupyter-pdf-export.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

النتيجة كانت تقريرًا يضم الشيفرة، والشرح النصي، والتصورات كلها في صيغة يستطيع أي شخص الاطلاع عليها. والاهتمام بتنسيق `Markdown` أثمر هنا بوضوح: العناوين والقوائم والتأكيدات النصية انتقلت بسلاسة إلى المستند النهائي.

وعند إعداد عرض موجّه إلى أصحاب مصلحة غير تقنيين، كنت أضبط حجم الرسوم وجودتها بما يناسب الطباعة:

```python
plt.figure(figsize=(10, 6), dpi=300)
```

وهذا يضمن بقاء الرسوم واضحة ومقروءة في ملف PDF.

أما في التصورات ثلاثية الأبعاد، فكنت أختار الزاوية الأكثر إفادة قبل التصدير، لأن ملف PDF سيلتقط لقطة ثابتة فقط من الحركة. هذا التموضع المقصود سمح لي بإبراز النمط الذي أردت التأكيد عليه داخل التقرير.

## كيف غيّر هذا الأسلوب سير عملي بالكامل

عندما أنظر إلى هذه الرحلة، يبدو التحول كبيرًا فعلًا. فما كان يتطلب ثلاث أدوات منفصلة وتبديلًا مستمرًا للسياق أصبح يحدث بسلاسة داخل بيئة واحدة. صار سير عملي كالتالي:

1. **الاستكشاف:** أستخدم الذكاء الاصطناعي للمساعدة في تحميل البيانات وإنشاء التصورات الأولى
2. **الاكتشاف:** أستفيد من تنفيذ الخلايا في Jupyter لتحسين التحليل بصورة تفاعلية
3. **التوثيق:** أضيف خلايا `Markdown` لشرح النتائج مباشرة إلى جانب الشيفرة
4. **المشاركة:** أصدّر التحليل كاملًا كتقرير احترافي بأمر واحد

الجمع بين تفاعلية Jupyter، وقدرات التحرير القوية في Cursor IDE، ومساعدة الذكاء الاصطناعي أزال الاحتكاك الذي كان يقطع تركيزي باستمرار. وأصبحت حرًا في متابعة فضولي من دون الضريبة الذهنية المصاحبة للتنقل بين الأدوات.

وهناك فائدة إضافية لم أكن أتوقعها: بما أنني أستخدم ملفات نصية عادية بدل دفاتر Jupyter الأصلية، صار التحليل كله خاضعًا للتحكم بالإصدارات عبر Git بصورة سليمة. أستطيع أن أرى التغييرات بدقة بين الإصدارات، وأن أتعاون مع الفريق من دون تعارضات دمج مزعجة، وأن أحافظ على سجل عمل نظيف.

هذا الأسلوب لا يوفر الوقت فقط، بل يغير طريقة التفكير في تحليل البيانات نفسها. فعندما يختفي عبء الانقطاع المستمر، يصبح من الأسهل الحفاظ على حالة التدفق وملاحقة الفكرة حتى النهاية. عندها يصبح التحليل أعمق، والتوثيق أكمل، والتصورات أكثر فاعلية.

إذا كنت قد تعبت من موازنة عدة أدوات لإنجاز عمل واحد في علم البيانات، فأنصحك بتجربة هذا النهج المتكامل. أعدّ Jupyter داخل Cursor IDE، واستفد من المساعد الذكي، واختبر بنفسك كيف يبدو العمل عندما تجتمع الأدوات كلها في مكان واحد. سيشكرك نفسك لاحقًا، خصوصًا في تلك الساعات المتأخرة من الليل.

## مقارنة: Jupyter التقليدي مقابل Cursor IDE المعزز بنماذج اللغة الكبيرة

يلخص الجدول التالي الفروقات الأساسية بين أسلوب Jupyter Notebook التقليدي وبين العمل داخل Cursor IDE باستخدام Jupyter بصيغة نصية:

| الميزة | Jupyter Notebooks التقليدية | Cursor IDE مع Jupyter النصي |
|--------|------------------------------|------------------------------|
| **صيغة الملف** | JSON معقدة بصيغة `.ipynb` | ملف Python نصي عادي بصيغة `.py` |
| **التحكم بالإصدارات** | صعب بسبب الفروقات الكبيرة وتعارضات الدمج | ممتاز ضمن سير عمل Git المعتاد |
| **قدرات الـ IDE** | محدودة في التنقل وإعادة الهيكلة | قدرات IDE كاملة مثل البحث والاستبدال والتنقل |
| **مساعدة الذكاء الاصطناعي** | محدودة | تكامل قوي مع نماذج اللغة الكبيرة وفهم أفضل للسياق |
| **تنفيذ الخلايا** | واجهة مبنية على المتصفح | داخل بيئة IDE نفسها |
| **تبديل السياق** | مطلوب عند التحرير المتقدم | كل شيء في بيئة واحدة |
| **الأداء** | قد يصبح بطيئًا مع الملفات الكبيرة | أداء محرر أصلي أكثر سلاسة |
| **تصحيح الأخطاء** | أدوات محدودة | أدوات تصحيح أخطاء كاملة داخل الـ IDE |
| **خيارات التصدير** | HTML وPDF وصيغ أخرى | الإمكانات نفسها عبر الإضافة |
| **التعاون** | مربك مع أنظمة التحكم بالإصدارات | أقرب إلى سير عمل التعاون البرمجي المعتاد |
| **إدارة الاعتماديات** | تُدار غالبًا في ملفات أو إعدادات منفصلة | أكثر تكاملًا داخل بيئة المشروع |
| **مشكلات الحالة المخفية** | شائعة بسبب التنفيذ خارج الترتيب | أقل بفضل تشجيع التنفيذ الخطي والواضح |
| **دعم Markdown** | مدمج أصلًا | متاح عبر علامات الخلايا مع القدرات نفسها |
| **التحقق من الأنواع** | شبه غائب | مدعوم عبر أدوات التحليل الساكن في الـ IDE |
| **النظام البيئي للإضافات** | إضافات Jupyter | إضافات IDE إضافة إلى إضافات Jupyter |

يوضح هذا الجدول لماذا يقدم نهج Cursor IDE مزايا ملموسة في أعمال تحليل البيانات الجادة، خصوصًا عند الاستفادة من الذكاء الاصطناعي مع الحفاظ على سير عمل سلس.

ولمزيد من التفاصيل عن بنية Jupyter وقدراته، راجع [توثيق Project Jupyter](https://docs.jupyter.org/en/latest/)، فهو يقدم نظرة عامة على النظام البيئي كاملًا.

## فيديو تعليمي: شاهد سير العمل الكامل لـ Jupyter داخل Cursor IDE

إذا كنت تفضل التعلم بصريًا، فقد أعددت فيديو شاملًا يشرح كل الأفكار الواردة في هذا المقال:

[![فيديو Jupyter Notebooks داخل Cursor IDE](/articles/assets/jupyter-notebooks/video-thumbnail.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

يعرض الفيديو كل خطوة عمليًا: إعداد دفاتر Jupyter داخل Cursor IDE، واستخدام التكامل مع الذكاء الاصطناعي، وإنشاء التصورات، ثم تصدير النتائج، وكل ذلك من دون مغادرة بيئة العمل نفسها.
