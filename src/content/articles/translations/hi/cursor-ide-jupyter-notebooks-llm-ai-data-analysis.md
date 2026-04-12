---
title: "Cursor IDE में LLM के साथ Jupyter Notebooks: AI-संचालित डेटा विश्लेषण"
date: 2026-04-11
slug: "cursor-ide-jupyter-notebooks-llm-ai-data-analysis"
description: "जानें कि Cursor IDE में Jupyter Notebooks और AI का उपयोग करके कम टूल बदलते हुए डेटा विश्लेषण, चित्रांकन और दस्तावेज़ीकरण कैसे करें।"
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

रात के 2 बजे मैंने आखिर मान लिया कि मैं फंस गया हूँ। मेरा जीनोम अनुक्रमण विश्लेषण इसलिए अटक गया था क्योंकि Cursor IDE के भीतर मौजूद LLM सहायक मेरी Jupyter notebook की जटिल JSON संरचना को ठीक से समझ नहीं पा रहा था। जब भी मैं चित्रांकन वाले कोड में मदद मांगता, बदले में टूटा हुआ JSON मिलता जो खुलता ही नहीं था। मैंने छोटे-छोटे अंश भेजकर देखने की भी कोशिश की, लेकिन उससे preprocessing का पूरा संदर्भ गायब हो जाता था। ऊपर से तीन अलग-अलग विंडो खुली रहती थीं: ब्राउज़र में Jupyter, "असली" coding के लिए VSCode, और दस्तावेज़ लिखने के लिए एक अलग संपादक। Jupyter के फ़ॉर्मैट, LLM की सीमाएँ और लगातार टूल बदलने की मजबूरी, इन सबने मिलकर आँकड़ों पर जटिल काम लगभग असंभव बना दिया था। Iris जैसे अपेक्षाकृत सरल मानक डेटा सेट पर भी यही बुनियादी असंगति मेरी उत्पादकता खत्म कर रही थी।

क्या यह परिचित लगता है? डेटा विज्ञान के काम में बार-बार टूल बदलना खास तौर पर थकाने वाला होता है। आप लगातार इन चीजों के बीच आते-जाते रहते हैं:
- गंभीर programming के लिए कोड संपादक
- शुरुआती पड़ताल के लिए Jupyter notebook
- निष्कर्ष साझा करने के लिए दस्तावेज़ीकरण के औज़ार
- charts बनाने के लिए चित्रांकन सॉफ़्टवेयर
- सवाल पूछने के लिए ब्राउज़र में खुले ChatGPT और Claude

हर बार टूल बदलने पर मानसिक ऊर्जा खर्च होती है और नई समझ तक पहुंचने की रफ्तार धीमी पड़ जाती है। लेकिन अगर इससे बेहतर तरीका मौजूद हो तो?

> **वीडियो ट्यूटोरियल देखना पसंद है?** मैंने इस पूरे कार्यप्रवाह का चरण-दर-चरण वीडियो बनाया है। [AI-Powered Data Analysis के साथ Jupyter Notebooks in Cursor IDE Tutorial देखें](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)।

[![Cursor IDE में डेटा चित्रांकन के साथ अंतिम Jupyter कार्यप्रवाह](/articles/assets/jupyter-notebooks/jupyter-workflow-result.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

## खोज: Cursor IDE में एकीकृत डेटा विज्ञान कार्यप्रवाह

तभी मुझे एक ऐसा समाधान मिला जिसने मेरा कार्यप्रवाह बदल दिया: Jupyter notebooks को सीधे Cursor IDE के भीतर चलाना, और उसके ऊपर AI की ताकत जोड़ना। इस तरीके में एक साथ ये फायदे मिलते हैं:

- Jupyter की अंतःक्रियात्मक, cell-based execution
- एक सधे हुए IDE की शक्तिशाली संपादन और नेविगेशन सुविधाएँ
- ऐसी AI सहायता जो code और डेटा विज्ञान, दोनों का संदर्भ समझती है
- साधारण पाठ वाला फ़ाइल स्वरूप, जो version control के साथ बेहद अच्छी तरह काम करता है

इस लेख के अंत तक मैं दिखाऊंगा कि मैंने ऐसा एकीकृत वातावरण कैसे बनाया, जिसमें मैं:

- बहुत कम हाथ से कोड लिखकर डेटा सेट्स का विश्लेषण और दृश्यांकन कर सकता हूँ
- ऐसे 3D visualizations बना सकता हूँ जो data में छिपे पैटर्न सामने लाएं
- अपने निष्कर्षों को code के साथ ही साफ-सुथरे तरीके से दर्ज कर सकता हूँ
- एक ही command से पेशेवर गुणवत्ता वाली रिपोर्टें निर्यात कर सकता हूँ
- और यह सब अलग-अलग टूल्स के बीच भटके बिना कर सकता हूँ

अगर आप बार-बार टूल बदलने की इस थकान से बाहर निकलना चाहते हैं, तो चलिए शुरू करते हैं।

## Cursor IDE में Jupyter परिवेश तैयार करना: बुनियाद

हर अच्छी व्यवस्था के पीछे थोड़ी तैयारी होती है। Cursor IDE में Jupyter को ठीक से चलाने के लिए हमें सही tools install करने और परिवेश को ठीक ढंग से विन्यस्त करने की जरूरत है।

### Jupyter extension इंस्टॉल करना

सारी शुरुआत Jupyter extension से होती है:

1. Cursor IDE खोलें और एक project folder बनाएं
2. Sidebar में `Extensions` पर जाएं
3. `Jupyter` खोजें और official extension चुनें
4. `Install` पर क्लिक करें

यह extension traditional notebooks और IDE के बीच पुल का काम करती है। इसी की मदद से आप सामान्य Python files में special syntax markers लिखकर executable cells बना सकते हैं। यानी जटिल `.ipynb` फ़ाइलों के बजाय साधारण पाठ वाली Python files के साथ काम करना संभव हो जाता है।

Jupyter Notebooks की क्षमताओं के बारे में और जानकारी के लिए [official Jupyter Notebook documentation](https://jupyter-notebook.readthedocs.io/en/stable/notebook.html) देखें।

### Python परिवेश तैयार करना

Extension install होने के बाद एक साफ़-सुथरा Python परिवेश बनाते हैं:

```bash
python -m venv .venv
```

अब निर्भरताएँ संभालने के लिए `pyproject.toml` फ़ाइल बनाएं:

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

फिर virtual environment में निर्भरताएँ install करें:

```bash
pip install -e .
```

मैंने अनुभव से सीखा है कि version conflicts बहुत उलझाऊ errors पैदा कर सकते हैं। जब AI किसी library का import सुझाए, तो पहले यह पक्का कर लें कि वह आपके परिवेश में सचमुच स्थापित है।

## अपनी पहली notebook बनाना: साधारण पाठ की ताकत

पारंपरिक Jupyter notebooks `.ipynb` format का उपयोग करती हैं, जो असल में एक जटिल JSON structure होता है। उसे सीधे edit करना मुश्किल है, और AI tools के लिए बिना फ़ॉर्मैट तोड़े उसमें बदलाव करना उससे भी कठिन। इसलिए हम एक ऐसे साधारण पाठ वाले तरीके का उपयोग करेंगे जो दोनों दुनिया के फायदे देता है।

### मूल Jupyter notebooks की समस्या

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

यह संरचना खास तौर पर LLM के लिए कठिन है, क्योंकि:

[![पारंपरिक Jupyter notebook फ़ाइल की जटिल JSON संरचना](/articles/assets/jupyter-notebooks/jupyter-json-structure.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

1. JSON format में बहुत सारे symbols और nested structures होते हैं, जिनका असली सामग्री से सीधा संबंध नहीं होता
2. हर cell की सामग्री strings की array में रखी जाती है, जहां newlines और quotes के लिए escape characters आते हैं
3. Code और उसके outputs संरचना के अलग-अलग हिस्सों में बंटे होते हैं
4. छोटा-सा edit भी पूरी JSON schema को समझे बिना सुरक्षित तरीके से नहीं किया जा सकता
5. सामग्री में छोटे बदलाव भी JSON में बड़े diffs पैदा करते हैं, इसलिए AI के लिए सटीक edits देना कठिन हो जाता है

जब LLM इस format को बदलने की कोशिश करता है, तो वह अक्सर सार्थक बदलाव करते हुए सही JSON structure बनाए नहीं रख पाता। परिणाम यह होता है कि notebook टूट जाती है और फिर न खुलती है, न चलती है।

### Cell markers का कमाल

`main.py` नाम की फ़ाइल बनाइए और उसमें पहला cell जोड़िए:

```python
# %%
# आवश्यक libraries import करें
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# बेहतर दृश्यांकन के लिए display settings
pd.set_option('display.max_columns', None)
plt.style.use('ggplot')

print("Data analysis के लिए environment तैयार है!")
```

ऊपर दिख रहा `# %%` वही खास marker है, जो Jupyter extension को बताता है कि "यह code cell है"। जैसे ही आप यह marker जोड़ते हैं, उसके पास run buttons दिखाई देने लगते हैं। आप सिर्फ इसी cell को चला सकते हैं और उसके परिणाम संपादक के भीतर ही देख सकते हैं।

अब दस्तावेज़ीकरण के लिए एक markdown cell जोड़ते हैं:

```python
# %% [markdown]
"""
# Iris dataset analysis

यह notebook प्रसिद्ध Iris flower dataset की मदद से इन बातों को समझती है:
- फूलों के अलग-अलग measurements के बीच क्या संबंध हैं
- इन measurements की मदद से species को कैसे अलग पहचाना जा सकता है
- कौन-से features species के बीच सबसे साफ़ अंतर दिखाते हैं

Dataset में हर flower निम्न तीन species में से एक से संबंधित है:
1. Setosa
2. Versicolor
3. Virginica
"""
```

यही इस तरीके की असली ताकत है: executable code और समृद्ध दस्तावेज़ीकरण, दोनों एक ही साधारण पाठ वाली फ़ाइल में। कोई विशेष file format नहीं, browser-based editing की कोई बंदिश नहीं, सिर्फ साफ़ टेक्स्ट जो version control के साथ अच्छी तरह निभता है।

जैसे-जैसे notebook तैयार होगी, हम यह ढांचा अपनाएंगे:

- code cells के लिए `# %%` का उपयोग
- दस्तावेज़ीकरण के लिए triple quotes के साथ `# %% [markdown]`
- data loading से पड़ताल और फिर visualization तक तार्किक क्रम
- पूरे रास्ते प्रक्रिया और निष्कर्षों का स्पष्ट लेखा-जोखा

## LLM assistant को साथ लाना: आपका डेटा विज्ञान सहयोगी

इस कार्यप्रवाह को वास्तव में अलग बनाती है Cursor के AI Composer के साथ इसकी integration। यह सिर्फ autocomplete नहीं है, बल्कि एक सहयोगी साथी की तरह काम करता है जो डेटा विज्ञान का संदर्भ समझता है।

### Agent Mode: AI-संचालित डेटा विज्ञान साथी

Cursor IDE में `Composer` button पर क्लिक करें और `Agent Mode` चुनें। इससे एक अधिक सक्षम AI सहायक सक्रिय होता है, जो:

- कई interactions के दौरान संदर्भ बनाए रखता है
- आपके डेटा सेट और analysis goals को समझता है
- सही Jupyter syntax के साथ पूरे code cells बना देता है
- आपके data के अनुसार visualizations तैयार करता है

आइए सबसे पहले उससे डेटा सेट import करने को कहें:

```text
Please import the Iris dataset in this notebook format
```

AI एक पूरा executable cell तैयार कर देती है:

```python
# %%
# आवश्यक libraries import करें
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

# Iris dataset load करें
iris = load_iris()

# pandas DataFrame में बदलें
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['species'] = iris.target

# शुरुआती rows दिखाएं
print(df.head())
```

सिर्फ एक अनुरोध, और हमारे पास डेटा सेट load करने वाला पूरी तरह तैयार code cell है। न exact syntax याद रखने की जरूरत, न function names खोजने की। AI यह हिस्सा संभाल लेता है।

लेकिन असली कमाल तब दिखता है जब हम उससे visualization मांगते हैं:

```text
Generate a 3D scatter plot for the iris dataset showing the three species in different colors
```

AI घूर्णन के साथ एक उन्नत 3D visualization तैयार करती है:

[![Iris dataset clusters दिखाने वाला 3D scatter plot visualization](/articles/assets/jupyter-notebooks/jupyter-3d-visualization.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

```python
# %%
# 3D scatter plot बनाएं
from mpl_toolkits.mplot3d import Axes3D

# Figure और 3D axis बनाएं
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# तीनों species लें
species_names = iris.target_names
colors = ['blue', 'red', 'green']

# हर species को अलग रंग में plot करें
for species_id, species_name in enumerate(species_names):
    # इस species का data चुनें
    species_data = df[df['species'] == species_id]
    
    # species plot करें
    ax.scatter(
        species_data['sepal length (cm)'],
        species_data['sepal width (cm)'],
        species_data['petal length (cm)'],
        c=colors[species_id],
        label=species_name,
        s=60,
        alpha=0.8
    )

# Labels और title सेट करें
ax.set_xlabel('Sepal Length (cm)')
ax.set_ylabel('Sepal Width (cm)')
ax.set_zlabel('Petal Length (cm)')
ax.set_title('3D Scatter Plot of Iris Dataset')
ax.legend()

# बेहतर दृश्यांकन के लिए घूर्णन जोड़ें
for angle in range(0, 360, 5):
    ax.view_init(30, angle)
    plt.draw()
    plt.pause(0.001)

plt.show()
```

यह सिर्फ एक साधारण chart नहीं है। यह animated 3D visualization है, जो अलग-अलग कोणों से डेटा दिखाती है और labels, colors तथा formatting भी ठीक से संभालती है। और यह सब एक ही अनुरोध से।

## बेहतर code generation के लिए Cursor Rules से दिशा देना

मुझे बाद में पता चला कि project root में `.cursorrules` फ़ाइल जोड़कर AI को और उपयोगी बनाया जा सकता है। इस फ़ाइल में वे निर्देश लिखे जाते हैं, जिनके आधार पर AI code generate करती है।

Cursor rules को प्रभावी ढंग से सेट करने और उपयोग करने पर मेरी विस्तृत मार्गदर्शिका [यहां](/articles/cursor-ide-rules-for-ai) उपलब्ध है।

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

इन rules के बाद AI ने मेरी पसंद के अनुरूप, सख़्त typing वाला code generate करना शुरू किया:

```python
# %%
# बेहतर type safety के लिए Pydantic model परिभाषित करें
from pydantic import BaseModel
from typing import List, Optional

class IrisFeatures(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float
    species: int
    species_name: Optional[str] = None

# DataFrame rows को Pydantic models में बदलने वाला function
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

# उदाहरण के लिए कुछ rows convert करें
iris_models = convert_to_models(df.head())
for model in iris_models:
    print(model)
```

AI ने rules का ठीक वैसा ही पालन किया जैसा मैंने चाहा था: साफ़ typing, functional style और Pydantic model के साथ।

## Python के साथ Iris डेटा सेट की पड़ताल: हमारा विश्लेषण अभियान

अब परिवेश भी तैयार है और AI assistant भी, तो चलिए Iris डेटा सेट के भीतर झांकते हैं।

### Data पर पहली नजर

डेटा सेट हमने पहले ही load कर लिया है। अब इसकी संरचना समझते हैं:

```python
# %%
# Dataset की बुनियादी जानकारी देखें
print("Dataset shape:", df.shape)
print("\nClass distribution:")
print(df['species'].value_counts())

# अधिक स्पष्ट species column बनाएं
species_names = {0: 'setosa', 1: 'versicolor', 2: 'virginica'}
df['species_name'] = df['species'].map(species_names)

# Descriptive statistics दिखाएं
print("\nDescriptive statistics:")
print(df.describe())
```

इससे पता चलता है कि हमारे पास 150 नमूने हैं, हर species के 50, और फूलों के अलग-अलग हिस्सों को मापने वाले 4 features हैं। अब देखते हैं कि ये features species के अनुसार कैसे बदलते हैं:

```python
# %%
# हर feature के लिए species-wise boxplot बनाएं
plt.figure(figsize=(12, 10))

for i, feature in enumerate(iris.feature_names):
    plt.subplot(2, 2, i+1)
    sns.boxplot(x='species_name', y=feature, data=df)
    plt.title(f'Distribution of {feature} by Species')
    plt.xticks(rotation=45)

plt.tight_layout()
plt.show()
```

इन boxplots से कई रोचक बातें सामने आती हैं। Setosa के sepals अपेक्षाकृत चौड़े हैं, लेकिन petals छोटे हैं। Virginica के petals सबसे बड़े दिखाई देते हैं। अब सवाल यह है कि कौन-से features species को सबसे साफ़ तरीके से अलग करते हैं।

### छिपे हुए पैटर्न सामने लाना

इसका जवाब पाने के लिए हमें features के बीच संबंध देखने होंगे:

```python
# %%
# Features के बीच संबंध देखने के लिए pairplot बनाएं
sns.pairplot(df, hue='species_name', height=2.5)
plt.suptitle('Iris Dataset Pairwise Relationships', y=1.02)
plt.show()
```

यह pairplot आंखें खोल देने वाला है। इससे तुरंत दिखता है कि:

1. Petal measurements वाले किसी भी plot में Setosa बाकी species से साफ़ अलग दिखती है
2. Versicolor और Virginica में कुछ आंशिक मेल है, लेकिन फिर भी उन्हें अलग किया जा सकता है
3. Petal length और petal width, तीनों species के बीच सबसे स्पष्ट separation देती हैं

सबसे प्रभावशाली visualization वही 3D scatter plot है, जिसमें तीनों species त्रि-आयामी space में अलग समूह बनाती दिखती हैं। Rotation के दौरान कुछ कोण ऐसे सामने आते हैं, जहां यह separation बिल्कुल स्पष्ट हो जाती है। यह ऐसी समझ है जिसे स्थिर 2D charts से पकड़ना मुश्किल होता।

अधिक उन्नत visualization और data analysis techniques के लिए [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html) एक उत्कृष्ट संदर्भ है।

## Jupyter integration की रुकावटें दूर करना: निर्भरताओं की जांच-पड़ताल

हर कार्यप्रवाह में कुछ न कुछ रुकावटें आती हैं। जब मैंने थोड़ा अधिक जटिल visualization बनाना शुरू किया, तो Seaborn import से जुड़ी एक समस्या सामने आई:

```text
ImportError: Seaborn not valid package style
```

डेटा विज्ञान की libraries के साथ version incompatibilities आम बात हैं। इसकी जांच करने के लिए मैंने स्थापित versions देखने वाला एक cell जोड़ा:

```python
# %%
# Installed package versions जांचें
import pkg_resources
print("Installed packages:")
for package in ['numpy', 'pandas', 'matplotlib', 'seaborn', 'scikit-learn']:
    try:
        version = pkg_resources.get_distribution(package).version
        print(f"{package}: {version}")
    except pkg_resources.DistributionNotFound:
        print(f"{package}: Not installed")
```

यहीं पता चला कि मेरी Seaborn version, NumPy version के साथ compatible नहीं थी। समाधान के लिए मैंने Cursor की pop-out terminal सुविधा का उपयोग किया:

1. नीचे वाले panel में terminal icon पर क्लिक करें
2. `Pop out terminal` चुनें
3. यह command चलाएं:
   ```bash
   pip install seaborn --upgrade
   ```

यहीं Cursor IDE की असली ताकत महसूस होती है। मुझे निर्भरता से जुड़ी समस्या ठीक करने के लिए टूल बदलना नहीं पड़ा, न विश्लेषण से बाहर आना पड़ा।

इससे भी बेहतर बात यह रही कि मैंने error message AI को दिखाया, और उसने वही command सुझाई जिसकी जरूरत थी। Pop-out terminal और AI सहायता का यह मेल समस्या-सुलझाव को पारंपरिक व्यवस्था की तुलना में काफी तेज बना देता है।

## ऐसे visualizations बनाना जो data को सचमुच खोल दें

अब जब परिवेश ठीक से चल रहा था, तो मेरा लक्ष्य ऐसे charts बनाना था जो data में छिपे पैटर्नों को वास्तव में सामने ला सकें।

### साधारण charts से 3D visualization तक

मैंने शुरुआत petals के dimensions पर आधारित एक सरल scatter plot से की:

```python
# %%
# Petal dimensions का scatter plot बनाएं
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

यह plot तुरंत दिखा देता है कि petal measurements species को अलग करने में कितनी उपयोगी हैं। Setosa नीचे बाईं ओर एक सघन समूह बनाती दिखाई देती है।

रिश्तों को और गहराई से समझने के लिए मैंने correlation heatmap बनाई:

```python
# %%
# Correlation matrix निकालें
correlation_matrix = df.drop(columns=['species_name']).corr()

# Heatmap बनाएं
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

Heatmap ने दिखाया कि petal length और petal width के बीच 0.96 का बहुत मजबूत correlation है। यानी प्रकृति में ये दोनों features साथ-साथ बदलते हैं।

लेकिन सबसे उल्लेखनीय visualization वही animated 3D scatter plot रही, जिसे हमने पहले बनाया था। अलग-अलग viewing angles पर घूमते हुए उसने ऐसे क्षण दिखाए, जहां तीनों species पूरी तरह अलग नज़र आती हैं। यही interactive data visualization की असली ताकत है: अमूर्त संख्याओं को सहज, लगभग अनुभवजन्य समझ में बदल देना।

## अपनी खोजों को साझा करना: विश्लेषण से प्रस्तुति तक

इन निष्कर्षों को सामने लाने के बाद अगली जरूरत थी उन्हें उन साथियों के साथ साझा करना, जिनके सिस्टम पर Python या Jupyter स्थापित नहीं था। यहां Jupyter extension की export capabilities बेहद काम आती हैं।

### पेशेवर रिपोर्टें बनाना

एक साझा की जा सकने वाली रिपोर्ट तैयार करने के लिए मैंने यह किया:

1. पहले सुनिश्चित किया कि सभी cells execute हो चुके हों और outputs दिखाई दे रहे हों
2. कार्यविधि और निष्कर्ष समझाने के लिए markdown cells जोड़े
3. Jupyter extension में `Export as HTML` विकल्प का उपयोग किया
4. browser में HTML खोला और `Save as PDF` के जरिए सुघड़ दस्तावेज़ बनाया

[![Jupyter notebook को professional PDF report में बदलना](/articles/assets/jupyter-notebooks/jupyter-pdf-export.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

अंतिम रिपोर्ट में code, व्याख्या और visualizations, सब कुछ ऐसे स्वरूप में आ गया जिसे कोई भी देख सकता था। Markdown formatting पर दिया गया ध्यान यहां काम आया: section headings, bullet points और emphasis सब अंतिम दस्तावेज़ में ठीक से बने रहे।

गैर-तकनीकी हितधारकों के लिए प्रस्तुतियाँ बनाते समय मैं visualizations का आकार उपयुक्त रखता हूँ, जैसे `figsize=(10, 6)`, और print quality के लिए high DPI का उपयोग करता हूँ:

```python
plt.figure(figsize=(10, 6), dpi=300)
```

इससे PDF export में charts साफ़ और पढ़ने योग्य बने रहते हैं।

3D visualizations के मामले में, export से पहले मैं उन्हें उस कोण पर सेट करता हूँ जहां pattern सबसे स्पष्ट दिखाई दे। क्योंकि rotation animation अंततः एक स्थिर image के रूप में ही capture होती है, इसलिए सही कोण चुनना रिपोर्ट में सही बिंदु उभारने के लिए बहुत महत्वपूर्ण है।

## कार्यप्रवाह में आया वास्तविक बदलाव: Cursor IDE में LLM-संचालित डेटा विज्ञान

पीछे मुड़कर देखूं तो यह बदलाव काफी बड़ा है। जो काम पहले तीन अलग tools और लगातार context switching के साथ होता था, वह अब एक ही परिवेश में सहज रूप से हो जाता है। मेरा कार्यप्रवाह अब कुछ ऐसा है:

1. **Explore**: AI की मदद से डेटा load करना और शुरुआती visualizations बनाना
2. **Discover**: Jupyter की cell-based execution के सहारे analysis को इंटरैक्टिव तरीके से refine करना
3. **Document**: निष्कर्षों को सीधे code के साथ markdown cells में लिखना
4. **Share**: पूरे analysis को एक command से पेशेवर रिपोर्ट में export करना

Jupyter की interactivity, Cursor IDE की editing शक्ति और AI सहायता के मेल ने वह friction खत्म कर दिया है जो पहले मेरा ध्यान बार-बार तोड़ देता था। अब मैं लगातार टूल बदलने की कीमत चुकाए बिना अपनी जिज्ञासा के पीछे जा सकता हूँ।

और एक अप्रत्याशित लाभ भी मिला: क्योंकि मैं मूल `.ipynb` notebooks की बजाय साधारण पाठ वाली files का उपयोग कर रहा हूँ, मेरा पूरा analysis अब Git में ठीक से दर्ज रहता है। मैं साफ़-साफ़ देख सकता हूँ कि versions के बीच क्या बदला, साथ काम करने वालों के साथ विलय टकरावों के बिना काम कर सकता हूँ, और अपने काम का साफ़ इतिहास बनाए रख सकता हूँ।

यह तरीका सिर्फ समय नहीं बचाता, बल्कि data analysis के बारे में मेरी सोच भी बदल देता है। जब बार-बार context टूटता नहीं, तो flow state बनाए रखना आसान हो जाता है। इससे analysis अधिक गहरी होती है, documentation अधिक पूरी होती है, और visualizations अधिक प्रभावशाली बनती हैं।

अगर आप भी डेटा विज्ञान के काम के लिए कई tools संभालते-संभालते थक चुके हैं, तो इस एकीकृत तरीके को जरूर आजमाइए। Cursor IDE में Jupyter की व्यवस्था कीजिए, AI assistant का सहारा लीजिए, और इस एकजुट कार्यप्रवाह का लाभ महसूस कीजिए। आपका भविष्य वाला स्वरूप, खासकर रात के 2 बजे वाला, आपको इसके लिए धन्यवाद देगा।

## तुलना: पारंपरिक Jupyter बनाम LLM-सक्षम Cursor IDE

नीचे एक त्वरित तुलना दी गई है, जो traditional Jupyter Notebook approach और Cursor IDE के plain text Jupyter कार्यप्रवाह के बीच मुख्य अंतर बताती है:

| विशेषता | पारंपरिक Jupyter Notebooks | plain text Jupyter के साथ Cursor IDE |
|---------|-----------------------------|--------------------------------------|
| **फ़ाइल स्वरूप** | जटिल JSON (`.ipynb`) | साधारण पाठ Python (`.py`) |
| **संस्करण नियंत्रण** | कठिन, बड़े अंतर और विलय टकराव | कहीं बेहतर, सामान्य Git कार्यप्रवाह |
| **IDE सुविधाएँ** | सीमित नेविगेशन और कोड पुनर्संरचना | पूरी IDE सुविधाएँ, खोज, बदलना और नेविगेशन |
| **AI सहायता** | सीमित | संदर्भ समझने वाला शक्तिशाली LLM एकीकरण |
| **Cell चलाना** | ब्राउज़र आधारित interface | IDE के भीतर ही |
| **बार-बार टूल बदलना** | उन्नत संपादन के लिए अक्सर ज़रूरी | लगभग सब कुछ एक ही स्थान पर |
| **गति** | बड़ी notebooks पर धीमी हो सकती है | स्थानीय संपादक जैसी तेज़ी |
| **त्रुटि-जांच** | सीमित debugging सुविधाएँ | IDE के पूरे debugging tools |
| **निर्यात विकल्प** | HTML, PDF और अन्य formats | extension के जरिए वही विकल्प |
| **साझा कार्य** | version control के साथ चुनौतीपूर्ण | सामान्य साझा-विकास कार्यप्रवाह |
| **निर्भरताएँ** | अलग environment files में managed | परिवेश के भीतर एकीकृत प्रबंधन |
| **छिपी हुई state की समस्या** | out-of-order execution के कारण आम समस्या | क्रमवार execution के प्रोत्साहन से कम |
| **Markdown समर्थन** | मूल रूप से उपलब्ध | cell markers के माध्यम से, लगभग वही क्षमता |
| **Typechecking** | लगभग नहीं के बराबर | IDE का पूरा स्थिर विश्लेषण समर्थन |
| **विस्तार तंत्र** | Jupyter extensions | IDE और Jupyter, दोनों के extensions |

यह तुलना साफ़ दिखाती है कि गंभीर data analysis काम के लिए, खासकर तब जब आप AI capabilities और बिना टूटे कार्यप्रवाह का लाभ लेना चाहते हों, Cursor IDE वाला तरीका कई मायनों में अधिक उपयोगी है।

Jupyter की architecture और ecosystem के बारे में विस्तार से समझने के लिए [Project Jupyter Documentation](https://docs.jupyter.org/en/latest/) देखें।

## वीडियो ट्यूटोरियल: Cursor IDE में पूरा Jupyter workflow देखें

अगर आप चीजें देखकर सीखना पसंद करते हैं, तो मैंने इस लेख की सभी बातों को समेटता हुआ एक विस्तृत वीडियो ट्यूटोरियल भी बनाया है:

[![Cursor IDE में Jupyter Notebooks का वीडियो ट्यूटोरियल](/articles/assets/jupyter-notebooks/video-thumbnail.webp)](https://youtu.be/eOSfeBIBzr0?si=M-DfJWF5y1WLt-vL)

इस वीडियो में Cursor IDE के साथ Jupyter notebooks की व्यवस्था करना, AI integration का उपयोग करना, visualizations बनाना और परिणाम export करना, सब कुछ वास्तविक समय में दिखाया गया है। इससे आप पूरे कार्यप्रवाह को एक ही जगह, बिना context टूटे, काम करते हुए देख सकते हैं।
