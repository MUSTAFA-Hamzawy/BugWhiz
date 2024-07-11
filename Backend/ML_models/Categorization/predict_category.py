import warnings
from sklearn.exceptions import InconsistentVersionWarning


import joblib
import sys
import os
import re
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
import numpy as np

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
stop_words = set(stopwords.words('english'))

def convert_lower_case(data):
    return str(data).lower()

def remove_punctuation(data):
    symbols = "!\"#$%&()*+-./:,;<=>?@[\\]^_`{|}~\n"
    for i in symbols:
        data = np.char.replace(data, i, ' ')

    return str(data)

def remove_apostrophe(data):
    return np.char.replace(data, "'", "")

def remove_stopwords(data):
    # If `data` is a string, tokenize it and remove stopwords.
    if isinstance(data, str):
        return ' '.join([word for word in data.split() if word not in stop_words])

    # If `data` is a pandas.Series, apply the lambda function to each element.
    elif isinstance(data, pd.Series):
        return data.apply(lambda x: ' '.join([word for word in x.split() if word not in stop_words]))

    else:
        raise ValueError("Unsupported data type. Expected string or pandas.Series.")

def remove_numbers(data):
    return re.sub(r'\d+', '', str(data))

def remove_single_characters(tokens):
    new_text = ""
    for w in tokens:
        if len(w) > 1:
            new_text = new_text + " " + w
    return new_text

def lemmatization(data):
    lemmatizer = WordNetLemmatizer()
    tokens = word_tokenize(data)
    data = remove_single_characters(tokens)
    lemmatized_output = ' '.join([lemmatizer.lemmatize(word) for word in tokens])
    return lemmatized_output

def preprocess(data):
    data = convert_lower_case(data)
    data = remove_punctuation(data)
    data = remove_apostrophe(data)
    data = remove_numbers(data)
    data = lemmatization(data)
    data = remove_stopwords(data)
    return data

def predict_category(bug_description):
    try:
        preprocessed_bug_description = preprocess(bug_description)
        model_path = os.path.join(os.path.dirname(__file__), 'svm_model.pkl')
        vectorizer_path = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')

        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        transformed_description = vectorizer.transform([preprocessed_bug_description])
        predicted_category = model.predict(transformed_description)

        return predicted_category[0]
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict_category.py <bug_description>")
        sys.exit(1)

    bug_description = sys.argv[1]
    category = predict_category(bug_description)
    print(category)
