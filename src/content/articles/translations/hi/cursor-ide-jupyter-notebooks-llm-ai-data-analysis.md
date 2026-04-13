---
title: "Cursor IDE में LLM के साथ Jupyter Notebooks: AI-सहायित डेटा विश्लेषण"
date: 2026-04-11
slug: "cursor-ide-jupyter-notebooks-llm-ai-data-analysis"
description: "जानें कि Cursor IDE में Jupyter Notebooks और LLM की मदद से कम टूल बदलते हुए डेटा विश्लेषण, दृश्यांकन और दस्तावेज़ीकरण को एक ही कार्यप्रवाह में कैसे समेटें।"
tags: [productivity, cursor-ide, ai, llm]
publish: true
thumbnailUrl: "/articles/jupyter-2025-04-25.webp"
language: "hi"
originalArticle:
  language: "en"
  slug: "jupyter-notebooks-cursor-ide-llm-ai-tutorial"
translations:
  - language: "en"
    slug: "jupyter-notebooks-cursor-ide-llm-ai-tutorial"
  - language: "zh"
    slug: "cursor-ide-jupyter-notebooks-llm-ai-shuju-fenxi"
  - language: "es"
    slug: "jupyter-notebooks-cursor-ide-llm-ia-analisis-datos"
  - language: "ar"
    slug: "jupyter-notebooks-cursor-ide-llm-ai-ltahlil-albayanat"
---

# हताशा से सहज प्रवाह तक: Cursor IDE में Jupyter Notebooks और LLM के साथ मेरी यात्रा

## समस्या: LLM और Jupyter Notebooks की पटरी आसानी से नहीं बैठती

रात के 2 बजे आखिरकार मुझे मानना पड़ा कि मैं अटक चुका हूँ। मेरा जीनोमिक अनुक्रमण विश्लेषण इसलिए ठहर गया था क्योंकि Cursor IDE के भीतर मौजूद LLM सहायक मेरी Jupyter Notebook की जटिल JSON संरचना को ठीक से समझ ही नहीं पा रहा था। जब भी मैं अपने दृश्यांकन के कोड में मदद मांगता, बदले में टूटा हुआ JSON मिलता जो खुलता तक नहीं था। मैंने छोटे-छोटे अंश भेजकर भी देखा, लेकिन उससे मेरे पूर्व-प्रसंस्करण चरणों का पूरा संदर्भ गायब हो जाता था। ऊपर से तीन अलग-अलग विंडो हमेशा खुली रहती थीं: ब्राउज़र में Jupyter, "असल" कोड लिखने के लिए VSCode, और दस्तावेज़ीकरण के लिए एक अलग संपादक। Jupyter के फ़ॉर्मैट की सीमाएँ, LLM की दिक्कतें और बार-बार टूल बदलने की मजबूरी, इन सबने मिलकर जटिल डेटा-कार्य को लगभग असंभव बना दिया था। Iris जैसे अपेक्षाकृत सरल मानक डेटा सेट पर भी यही बुनियादी असंगति मेरी उत्पादकता को खत्म कर रही थी।

क्या यह स्थिति जानी-पहचानी लगती है? डेटा विज्ञान के काम में बार-बार टूल बदलना खास तौर पर थकाऊ होता है। आप लगातार इन चीजों के बीच झूलते रहते हैं:
- गंभीर प्रोग्रामिंग के लिए कोड संपादक
- खोजबीन और प्रयोग के लिए Jupyter Notebooks
- निष्कर्ष साझा करने के लिए दस्तावेज़ीकरण उपकरण
- चार्ट बनाने के लिए दृश्यांकन सॉफ़्टवेयर
- सवाल पूछने के लिए ब्राउज़र में खुले ChatGPT और Claude

हर बार टूल बदलने पर मानसिक ऊर्जा खर्च होती है और खोज की रफ्तार धीमी पड़ जाती है। लेकिन अगर इससे बेहतर रास्ता हो तो?

> **वीडियो ट्यूटोरियल देखना पसंद है?** मैंने इस पूरे कार्यप्रवाह का चरण-दर-चरण वीडियो बनाया है। [AI-सहायित डेटा विश्लेषण के साथ Cursor IDE में Jupyter Notebooks का ट्यूटोरियल देखें](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)।

[![Cursor IDE में डेटा दृश्यांकन के साथ अंतिम Jupyter कार्यप्रवाह](/articles/assets/jupyter-notebooks/jupyter-workflow-result.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

## खोज: Cursor IDE में एकीकृत डेटा विज्ञान कार्यप्रवाह

तभी मुझे एक ऐसा उपाय मिला जिसने मेरा पूरा काम करने का तरीका बदल दिया: Cursor IDE के भीतर सीधे Jupyter Notebooks चलाना, और उस पर AI की शक्ति जोड़ देना। इस तरीके में एक साथ ये फायदे मिलते हैं:

- Jupyter का अंतःक्रियात्मक, सेल-आधारित निष्पादन
- एक सक्षम IDE की शक्तिशाली संपादन और नेविगेशन सुविधाएँ
- ऐसी AI सहायता जो कोड और डेटा विज्ञान दोनों का संदर्भ समझती है
- सादा पाठ वाला फ़ाइल प्रारूप, जो संस्करण नियंत्रण के साथ बेहतरीन ढंग से काम करता है

इस लेख के अंत तक मैं दिखाऊँगा कि मैंने ऐसा एकीकृत वातावरण कैसे बनाया, जिसमें मैं:

- बहुत कम हाथ से कोड लिखकर डेटा सेट का विश्लेषण और दृश्यांकन कर सकता हूँ
- ऐसे त्रि-आयामी दृश्यांकन बना सकता हूँ जो डेटा में छिपे पैटर्न उजागर करें
- अपने निष्कर्षों को कोड के साथ ही साफ़-सुथरे ढंग से दर्ज कर सकता हूँ
- एक ही कमांड से पेशेवर स्तर की रिपोर्टें निर्यात कर सकता हूँ
- और यह सब अलग-अलग टूल्स के बीच भटके बिना कर सकता हूँ

अगर आप भी लगातार टूल बदलने की इस थकान से बाहर निकलना चाहते हैं, तो चलिए शुरू करते हैं।

## Cursor IDE में Jupyter परिवेश तैयार करना: बुनियाद

हर अच्छी व्यवस्था की शुरुआत तैयारी से होती है। Cursor IDE में Jupyter को सही ढंग से चलाने के लिए हमें उपयुक्त औज़ार स्थापित करने और परिवेश को ठीक से विन्यस्त करने की ज़रूरत है।

### Jupyter extension इंस्टॉल करना

सारी शुरुआत Cursor IDE के लिए Jupyter extension से होती है:

1. Cursor IDE खोलें और एक project folder बनाएँ
2. साइडबार में `Extensions` पर जाएँ
3. `Jupyter` खोजें और लाखों डाउनलोड वाला आधिकारिक extension चुनें
4. `Install` पर क्लिक करें

यह extension पारंपरिक नोटबुक्स और आपके IDE के बीच पुल का काम करती है। इसी की मदद से आप सामान्य Python files में खास syntax markers लिखकर चलाए जा सकने वाले cells बना सकते हैं। अब जटिल JSON संरचना वाली `.ipynb` फ़ाइलों पर निर्भर रहना ज़रूरी नहीं रहता, बल्कि कुछ विशेष markers के साथ साधारण Python पाठ-फ़ाइलों में ही काम हो जाता है।

Jupyter Notebooks और उनकी क्षमताओं के बारे में अधिक जानकारी के लिए [आधिकारिक Jupyter Notebook documentation](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html) देखें।

### Python परिवेश तैयार करना

Extension स्थापित होने के बाद अब एक साफ़-सुथरा Python परिवेश बनाते हैं:

```bash
python -m venv .venv
```

अब निर्भरताओं को व्यवस्थित ढंग से संभालने के लिए `pyproject.toml` फ़ाइल बनाएँ:

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

फिर इस virtual environment में निर्भरताएँ स्थापित करें:

```bash
pip install -e .
```

मैंने अनुभव से सीखा है कि संस्करण टकराव बहुत रहस्यमय त्रुटियाँ पैदा कर सकते हैं। जब AI किसी library का `import` सुझाए, तो पहले यह सुनिश्चित कर लें कि वह आपके परिवेश में सचमुच स्थापित है।

## अपनी पहली नोटबुक बनाना: सादे पाठ की ताकत

पारंपरिक Jupyter Notebooks `.ipynb` प्रारूप का उपयोग करती हैं, जो असल में एक जटिल JSON संरचना होती है। उसे सीधे संपादित करना मुश्किल है, और AI औज़ारों के लिए बिना फ़ॉर्मैट बिगाड़े उसमें बदलाव करना उससे भी कठिन। इसलिए हम एक ऐसे सादे-पाठ वाले तरीके का उपयोग करेंगे जो दोनों दुनिया के फायदे देता है।

### मूल Jupyter Notebooks की समस्या

अगर आप एक पारंपरिक `.ipynb` फ़ाइल को किसी पाठ-संपादक में खोलें, तो वह कुछ इस तरह दिखती है:

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

यह संरचना खास तौर पर Cursor जैसे AI औज़ारों में इस्तेमाल होने वाले LLMs के लिए चुनौतीपूर्ण है, क्योंकि:

[![पारंपरिक Jupyter Notebook फ़ाइल की जटिल JSON संरचना](/articles/assets/jupyter-notebooks/jupyter-json-structure.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

1. JSON प्रारूप में बहुत सारे प्रतीक और परतदार संरचनाएँ होती हैं, जिनका असली सामग्री से सीधा संबंध नहीं होता
2. हर cell की सामग्री strings की array में रखी जाती है, जिसमें नई पंक्तियों और quotes के लिए escape characters होते हैं
3. कोड और उसके परिणाम संरचना के अलग-अलग हिस्सों में बँटे होते हैं
4. छोटा-सा संपादन भी पूरी JSON schema समझे बिना सुरक्षित ढंग से नहीं किया जा सकता
5. सामग्री में छोटे बदलाव भी JSON में बड़े `diff` पैदा करते हैं, इसलिए AI के लिए सटीक संपादन करना कठिन हो जाता है

जब कोई LLM इस प्रारूप को बदलने की कोशिश करता है, तो वह अक्सर अर्थपूर्ण बदलाव करते हुए सही JSON संरचना बनाए नहीं रख पाता। नतीजा यह होता है कि नोटबुक टूट जाती है और फिर न खुलती है, न ठीक से चलती है।

### सेल संकेतकों का कमाल

`main.py` नाम की फ़ाइल बनाएँ और उसमें अपना पहला cell जोड़ें:

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

ऊपर दिख रहा `# %%` वही जादुई marker है, जो Jupyter extension को बताता है कि "यह एक code cell है"। जैसे ही आप यह marker जोड़ते हैं, उसके पास चलाने के बटन दिखाई देने लगते हैं। आप सिर्फ इसी cell को चला सकते हैं, और उसके परिणाम सीधे अपने संपादक के भीतर देख सकते हैं।

अब दस्तावेज़ीकरण के लिए एक markdown cell जोड़ते हैं:

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

यही इस तरीके की असली ताकत है: चलाया जा सकने वाला कोड और समृद्ध दस्तावेज़ीकरण, दोनों एक ही सादे-पाठ वाली फ़ाइल में। कोई विशेष file format नहीं, ब्राउज़र-आधारित संपादन की कोई बंदिश नहीं, सिर्फ साफ़ टेक्स्ट जो संस्करण नियंत्रण के साथ बेहतरीन ढंग से चलता है।

जैसे-जैसे हम अपनी नोटबुक बनाएँगे, हम यह ढाँचा अपनाएँगे:

- code cells के लिए `# %%` का उपयोग
- दस्तावेज़ीकरण के लिए triple quotes के साथ `# %% [markdown]`
- data loading से खोजबीन और फिर दृश्यांकन तक स्पष्ट तार्किक प्रवाह
- पूरे रास्ते प्रक्रिया और निष्कर्षों का साफ़ लेखा-जोखा

## LLM सहायक की शक्ति खोलना: आपका डेटा विज्ञान सहयोगी

इस कार्यप्रवाह को वास्तव में अलग बनाता है Cursor के AI Composer के साथ इसका एकीकरण। यह सिर्फ स्वतः-पूरण नहीं है, बल्कि एक सहयोगी साथी की तरह काम करता है जो डेटा विज्ञान का संदर्भ समझता है।

### Agent Mode: AI-संचालित डेटा विज्ञान साथी

Cursor IDE में `Composer` button पर क्लिक करें और `Agent Mode` चुनें। इससे एक अधिक सक्षम AI सहायक सक्रिय होता है, जो:

- कई दौर की बातचीत के दौरान संदर्भ बनाए रखता है
- आपके डेटा सेट और विश्लेषण लक्ष्यों को समझता है
- सही Jupyter syntax के साथ पूरे code cells बना देता है
- आपके डेटा के अनुरूप दृश्यांकन तैयार करता है

आइए सबसे पहले उससे डेटा सेट import करने को कहें:

```text
Please import the Iris dataset in this notebook format
```

AI एक पूरा चलाया जा सकने वाला cell तैयार कर देती है:

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

सिर्फ एक सरल अनुरोध, और हमारे पास ऐसा code cell है जो डेटा सेट को सही ढंग से लोड कर देता है। न आपको सटीक syntax याद रखने की ज़रूरत है, न फ़ंक्शन के नाम खोजने की। यह हिस्सा AI संभाल लेती है।

लेकिन असली कमाल तब दिखता है जब हम उससे दृश्यांकन बनाने को कहते हैं:

```text
Generate a 3D scatter plot for the iris dataset showing the three species in different colors
```

AI घूर्णन के साथ एक उन्नत 3D दृश्यांकन तैयार करती है:

[![Iris dataset clusters दिखाने वाला 3D scatter plot visualization](/articles/assets/jupyter-notebooks/jupyter-3d-visualization.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

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

यह सिर्फ एक साधारण chart नहीं है। यह गतिशील 3D दृश्यांकन है, जो डेटा को अलग-अलग कोणों से दिखाता है और labels, colors तथा formatting भी ठीक ढंग से संभालता है। और यह सब एक ही अनुरोध से।

## बेहतर कोड निर्माण के लिए Cursor Rules से LLM को दिशा देना

मुझे यह भी पता चला कि project root में `.cursorrules` फ़ाइल बनाकर AI को और उपयोगी बनाया जा सकता है। इस फ़ाइल में वे विशेष निर्देश लिखे जाते हैं, जिनके आधार पर AI कोड तैयार करती है।

Cursor rules को प्रभावी ढंग से सेट करने और इस्तेमाल करने के लिए आप मेरा विस्तृत लेख [Cursor rules की मदद से AI-आधारित कोड लेखन को बेहतर बनाने](/articles/cursor-ide-rules-for-ai) पर पढ़ सकते हैं।

उदाहरण के लिए, मैंने ये rules जोड़े:

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

इन rules के बाद AI ने मेरी पसंद के अनुरूप, टाइप-सुरक्षित कोड बनाना शुरू कर दिया:

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

AI ने मेरे rules का ठीक वैसा ही पालन किया जैसा मैं चाहता था: साफ़ typing, functional style और Pydantic models के साथ।

## Python के साथ Iris डेटा सेट की पड़ताल: हमारा विश्लेषण अभियान

अब परिवेश भी तैयार है और AI सहायक भी, तो चलिए Iris डेटा सेट की पड़ताल शुरू करते हैं।

### डेटा पर पहली नज़र

डेटा सेट हमने पहले ही लोड कर लिया है, लेकिन अब इसकी संरचना समझते हैं:

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

इससे पता चलता है कि हमारे पास 150 samples हैं, हर species के 50, और फूलों के अलग-अलग हिस्सों को मापने वाले 4 features हैं। अब देखते हैं कि ये features प्रजातियों के अनुसार कैसे बदलते हैं:

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

इन boxplots से कई रोचक बातें सामने आती हैं। Setosa के बाह्यदल अपेक्षाकृत चौड़े हैं, लेकिन पंखुड़ियाँ छोटी हैं। Virginica की पंखुड़ियाँ सबसे बड़ी दिखाई देती हैं। लेकिन कौन-से features प्रजातियों के बीच सबसे साफ़ अंतर दिखाते हैं?

### छिपे हुए पैटर्न सामने लाना

इसका जवाब पाने के लिए हमें features के बीच संबंध देखने होंगे:

```python
# %%
# Create a pairplot to visualize relationships between features
sns.pairplot(df, hue='species_name', height=2.5)
plt.suptitle('Iris Dataset Pairwise Relationships', y=1.02)
plt.show()
```

यह pairplot आँखें खोल देने वाला है। इससे तुरंत दिखता है कि:

1. पंखुड़ियों के माप वाले किसी भी plot में Setosa बाकी प्रजातियों से पूरी तरह अलग दिखाई देती है
2. Versicolor और Virginica में कुछ ओवरलैप है, लेकिन फिर भी उन्हें अलग पहचाना जा सकता है
3. Petal length और petal width, तीनों प्रजातियों के बीच सबसे स्पष्ट अलगाव देती हैं

सबसे प्रभावशाली दृश्यांकन वही 3D scatter plot है, जिसमें तीनों प्रजातियाँ त्रि-आयामी space में अलग-अलग समूह बनाती दिखती हैं। Animation के दौरान कुछ कोण ऐसे सामने आते हैं, जहाँ यह अलगाव बिल्कुल साफ़ दिखाई देता है। स्थिर 2D plots के साथ ऐसी अंतर्दृष्टि पाना लगभग असंभव होता।

अधिक उन्नत दृश्यांकन और डेटा विश्लेषण तकनीकों के लिए [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html) एक उत्कृष्ट संदर्भ है, जिसमें मशीन लर्निंग एल्गोरिद्म और डेटा पूर्व-प्रसंस्करण विधियों दोनों पर विस्तृत जानकारी मिलती है।

## Jupyter एकीकरण की रुकावटें दूर करना: निर्भरताओं की समस्या-सुलझाई

हर कामकाजी व्यवस्था में कुछ न कुछ अड़चनें आती हैं। जब मैंने थोड़ा अधिक जटिल दृश्यांकन बनाना शुरू किया, तो Seaborn import से जुड़ी यह समस्या सामने आई:

```text
ImportError: Seaborn not valid package style
```

डेटा विज्ञान की libraries के साथ संस्करण असंगतियाँ आम बात हैं। इसकी जाँच करने के लिए मैंने स्थापित संस्करण देखने वाला एक cell जोड़ा:

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

यहीं पता चला कि मेरी Seaborn version, NumPy version के साथ अनुकूल नहीं थी। समाधान के लिए मैंने Cursor की pop-out terminal सुविधा का उपयोग किया:

1. नीचे वाले panel में terminal icon पर क्लिक करें
2. `Pop out terminal` चुनें
3. यह कमांड चलाएँ:
   ```bash
   pip install seaborn --upgrade
   ```

यहीं Cursor IDE की असली ताकत सामने आती है। निर्भरता से जुड़ी समस्या ठीक करने के लिए मुझे न टूल बदलना पड़ा, न अपने विश्लेषण का संदर्भ छोड़ना पड़ा।

इससे भी बेहतर बात यह थी कि मैंने त्रुटि संदेश AI को दिखाया, और उसने ठीक वही कमांड सुझाई जिसकी ज़रूरत थी। Pop-out terminal और AI सहायता का यह मेल समस्या-सुलझाने को पारंपरिक वातावरण की तुलना में बहुत तेज़ बना देता है।

## दृश्यांकन से अंतर्दृष्टि पाना: Jupyter में इंटरैक्टिव चार्ट

अब जब परिवेश सुचारु रूप से चल रहा था, तो मेरा लक्ष्य ऐसे दृश्यांकन बनाना था जो हमारे डेटा के पैटर्न सचमुच सामने ला सकें।

### साधारण चार्ट से 3D दृश्यांकन तक

मैंने शुरुआत petals के dimensions पर आधारित एक सरल scatter plot से की:

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

यह plot तुरंत दिखा देता है कि पंखुड़ियों के माप प्रजातियों को अलग करने में कितने उपयोगी हैं। Setosa नीचे बाईं ओर एक घना समूह बनाती दिखाई देती है।

रिश्तों को और गहराई से समझने के लिए मैंने correlation heatmap बनाई:

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

इस heatmap ने दिखाया कि petal length और petal width के बीच 0.96 का बहुत मजबूत correlation है। यानी प्रकृति में ये दोनों विशेषताएँ साथ-साथ बदलती हैं।

लेकिन सबसे उल्लेखनीय दृश्यांकन वही animated 3D scatter plot रहा, जिसे हमने पहले बनाया था। अलग-अलग देखने के कोणों पर घूमते हुए उसने ऐसे क्षण दिखाए, जहाँ तीनों प्रजातियाँ पूरी तरह अलग नज़र आती हैं। यही इंटरैक्टिव डेटा दृश्यांकन की असली शक्ति है: अमूर्त संख्याओं को सहज और लगभग अनुभवजन्य समझ में बदल देना।

## अपनी खोजें साझा करना: विश्लेषण से प्रस्तुति तक

इन निष्कर्षों को सामने लाने के बाद अगली ज़रूरत थी उन्हें उन साथियों के साथ साझा करना, जिनके सिस्टम पर Python या Jupyter स्थापित नहीं था। यहीं Jupyter extension की निर्यात सुविधाएँ बेहद मूल्यवान साबित होती हैं।

### पेशेवर रिपोर्टें बनाना

साझा की जा सकने वाली रिपोर्ट तैयार करने के लिए मैंने यह किया:

1. यह सुनिश्चित किया कि सभी cells चल चुके हों और उनके परिणाम दिखाई दे रहे हों
2. कार्यविधि और निष्कर्ष समझाने के लिए markdown cells जोड़े
3. Jupyter extension के `Export as HTML` विकल्प का उपयोग किया
4. HTML फ़ाइल को ब्राउज़र में खोला और `Save as PDF` से एक सुघड़ दस्तावेज़ बनाया

[![Jupyter Notebook को पेशेवर PDF report में बदलना](/articles/assets/jupyter-notebooks/jupyter-pdf-export.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

अंतिम रिपोर्ट में मेरा कोड, पाठ्य व्याख्याएँ और दृश्यांकन, सब कुछ ऐसे स्वरूप में आ गया जिसे कोई भी देख सकता था। Markdown स्वरूपण पर दिया गया ध्यान यहाँ काम आया: खंड शीर्षक, bullet points और emphasis सब अंतिम दस्तावेज़ में ठीक से बने रहे।

गैर-तकनीकी हितधारकों के लिए प्रस्तुति तैयार करते समय मैं दृश्यांकनों का आकार उपयुक्त रखता हूँ, जैसे `figsize=(10, 6)` और print quality के लिए high DPI का उपयोग करता हूँ:

```python
plt.figure(figsize=(10, 6), dpi=300)
```

इससे PDF export में चार्ट साफ़ और पढ़ने योग्य बने रहते हैं।

3D दृश्यांकन के मामले में, export से पहले मैं उन्हें उस कोण पर सेट करता हूँ जहाँ पैटर्न सबसे स्पष्ट दिखाई दे। क्योंकि rotation animation अंततः एक स्थिर image के रूप में ही दर्ज होती है, इसलिए सही कोण चुनना रिपोर्ट में सही बिंदु उभारने के लिए बहुत महत्वपूर्ण है।

## कार्यप्रवाह में आया बदलाव: Cursor IDE में LLM-संचालित डेटा विज्ञान

पीछे मुड़कर देखूँ तो यह बदलाव काफ़ी बड़ा है। जो काम पहले तीन अलग औज़ारों और लगातार संदर्भ बदलने की थकान के साथ होता था, वह अब एक ही परिवेश में सहज रूप से हो जाता है। मेरा कार्यप्रवाह अब कुछ ऐसा है:

1. **पड़ताल**: AI की मदद से डेटा लोड करना और शुरुआती दृश्यांकन बनाना
2. **खोज**: Jupyter की सेल-आधारित निष्पादन शैली के सहारे विश्लेषण को इंटरैक्टिव ढंग से परिष्कृत करना
3. **दस्तावेज़ीकरण**: निष्कर्षों को सीधे कोड के साथ markdown cells में लिखना
4. **साझा करना**: पूरे विश्लेषण को एक ही कमांड से पेशेवर रिपोर्ट के रूप में निर्यात करना

Jupyter की परस्पर क्रियाशीलता, Cursor IDE की शक्तिशाली संपादन सुविधाएँ और AI सहायता, इन तीनों के मेल ने वह रुकावट खत्म कर दी है जो पहले मेरी एकाग्रता तोड़ देती थी। अब मैं लगातार टूल बदलने की कीमत चुकाए बिना अपनी जिज्ञासा के पीछे जा सकता हूँ।

और एक अप्रत्याशित लाभ भी मिला: क्योंकि मैं मूल Jupyter notebooks की बजाय सादे-पाठ वाली फ़ाइलों का उपयोग कर रहा हूँ, मेरा पूरा विश्लेषण अब Git में ठीक से संस्करणबद्ध है। मैं साफ़-साफ़ देख सकता हूँ कि अलग-अलग संस्करणों के बीच क्या बदला, साथ काम करने वालों के साथ अनावश्यक मर्ज टकरावों के बिना सहयोग कर सकता हूँ, और अपने काम का साफ़ इतिहास बनाए रख सकता हूँ।

यह तरीका सिर्फ समय नहीं बचाता, बल्कि डेटा विश्लेषण के बारे में मेरी सोच भी बदल देता है। जब बार-बार संदर्भ नहीं टूटता, तो गहरी एकाग्रता की अवस्था बनाए रखना आसान हो जाता है। इससे विश्लेषण अधिक गहरा होता है, दस्तावेज़ीकरण अधिक पूरा होता है, और दृश्यांकन अधिक प्रभावशाली बनते हैं।

अगर आप भी डेटा विज्ञान के काम के लिए कई औज़ार संभालते-संभालते थक चुके हैं, तो इस एकीकृत तरीके को ज़रूर आज़माइए। Cursor IDE में Jupyter की व्यवस्था कीजिए, AI सहायक का लाभ उठाइए, और इस एकजुट कार्यप्रवाह की शक्ति महसूस कीजिए। आपका भविष्य वाला रूप, ख़ासकर रात के 2 बजे वाला, आपको इसके लिए धन्यवाद देगा।

## तुलना: पारंपरिक Jupyter बनाम LLM-सक्षम Cursor IDE

नीचे एक त्वरित तुलना दी गई है, जो पारंपरिक Jupyter Notebook तरीके और Cursor IDE के सादे-पाठ वाले Jupyter कार्यप्रवाह के बीच मुख्य अंतर स्पष्ट करती है:

| विशेषता | पारंपरिक Jupyter Notebooks | सादे-पाठ वाले Jupyter के साथ Cursor IDE |
|---------|-----------------------------|------------------------------------------|
| **फ़ाइल प्रारूप** | जटिल JSON (`.ipynb`) | सादा पाठ Python (`.py`) |
| **संस्करण नियंत्रण** | कठिन (`diff` बड़े, मर्ज टकराव आम) | उत्कृष्ट (सामान्य Git कार्यप्रवाह) |
| **IDE सुविधाएँ** | सीमित कोड नेविगेशन और पुनर्रचना | पूरी IDE क्षमताएँ (खोज, बदलना, नेविगेशन) |
| **AI सहायता** | सीमित | संदर्भ समझने वाला शक्तिशाली LLM एकीकरण |
| **Cell चलाना** | ब्राउज़र-आधारित इंटरफ़ेस | IDE के भीतर मूल रूप से |
| **बार-बार टूल बदलना** | उन्नत संपादन के लिए ज़रूरी | लगभग सब कुछ एक ही परिवेश में |
| **प्रदर्शन** | बड़ी notebooks पर धीमा हो सकता है | स्थानीय संपादक जैसा प्रदर्शन |
| **डिबगिंग** | सीमित डिबगिंग क्षमताएँ | IDE के पूरे डिबगिंग औज़ार |
| **निर्यात विकल्प** | HTML, PDF और अन्य formats | extension के जरिए वही क्षमताएँ |
| **सहयोग** | संस्करण नियंत्रण के साथ चुनौतीपूर्ण | सामान्य कोड सहयोग कार्यप्रवाह |
| **निर्भरताएँ** | अलग परिवेश फ़ाइलों में प्रबंधित | परिवेश के भीतर एकीकृत प्रबंधन |
| **छिपी हुई state की समस्या** | out-of-order execution के कारण आम | क्रमवार execution के प्रोत्साहन से कम |
| **Markdown समर्थन** | मूल रूप से उपलब्ध | cell markers के माध्यम से, लगभग वही क्षमता |
| **टाइप जाँच** | नहीं के बराबर | IDE का पूरा स्थिर विश्लेषण समर्थन |
| **एक्सटेंशन तंत्र** | Jupyter extensions | IDE extensions + Jupyter extensions |

यह तुलना साफ़ दिखाती है कि गंभीर डेटा विश्लेषण कार्य के लिए, ख़ासकर तब जब आप AI क्षमताओं का लाभ लेना चाहते हों और कार्यप्रवाह को टूटने नहीं देना चाहते हों, Cursor IDE वाला तरीका कई मायनों में अधिक शक्तिशाली है।

Jupyter की वास्तुकला और क्षमताओं के बारे में अधिक विस्तार से समझने के लिए [Project Jupyter Documentation](https://docs.jupyter.org/en/latest/) देखें, जिसमें पूरे Jupyter पारिस्थितिकी तंत्र का व्यापक परिचय दिया गया है।

## वीडियो ट्यूटोरियल: Cursor IDE में पूरा Jupyter कार्यप्रवाह देखें

अगर आप देखकर सीखना पसंद करते हैं, तो मैंने इस लेख की सभी बातों को समेटता हुआ एक विस्तृत वीडियो ट्यूटोरियल भी बनाया है:

[![Cursor IDE में Jupyter Notebooks का वीडियो ट्यूटोरियल](/articles/assets/jupyter-notebooks/video-thumbnail.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

इस वीडियो में Cursor IDE के साथ Jupyter Notebooks की व्यवस्था करना, AI एकीकरण का उपयोग करना, दृश्यांकन बनाना और परिणाम निर्यात करना, सब कुछ वास्तविक समय में दिखाया गया है। आप देख पाएँगे कि AI एकीकरण व्यवहार में कैसे काम करता है, और यह भी कि एक ही परिवेश में रहते हुए पूरा कार्यप्रवाह कितना सहज हो सकता है।
