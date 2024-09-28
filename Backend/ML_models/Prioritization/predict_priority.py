import warnings
from sklearn.exceptions import InconsistentVersionWarning
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from nltk.stem import WordNetLemmatizer
import joblib
import sys
import os
import re
import nltk
import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# nltk.download('stopwords')
# nltk.download('punkt')
# nltk.download('wordnet')

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
stop_words = set(stopwords.words('english'))

class TextClassifier:
    def __init__(self):
        self.model = LogisticRegression(max_iter=1000, random_state=42)
        self.vectorizer = TfidfVectorizer(max_features=5000)
        self.lemmatizer = WordNetLemmatizer()
        self.label_encoder = LabelEncoder()

    def convert_lower_case(self, data):
        return str(data).lower()

    def remove_punctuation(self, data):
        symbols = "!\"#$%&()*+-./:;<=>?@[\\]^_`{|}~\n"
        for i in symbols:
            data = np.char.replace(data, i, ' ')
        return str(data)

    def remove_apostrophe(self, data):
        return np.char.replace(data, "'", "")

    def remove_numbers(self, data):
        return re.sub(r'\d+', '', str(data))

    def remove_single_characters(self, tokens):
        new_text = ""
        for w in tokens:
            if len(w) > 1:
                new_text = new_text + " " + w
        return new_text

    def lemmatization(self, data):
        tokens = word_tokenize(data)
        data = self.remove_single_characters(tokens)
        lemmatized_output = ' '.join([self.lemmatizer.lemmatize(word) for word in tokens])
        return lemmatized_output

    def remove_stop_words(self, data):
        tokens = word_tokenize(data)
        data = ' '.join([i for i in tokens if not i in stop_words])
        return data

    def preprocess(self, data):
        data = self.convert_lower_case(data)
        data = self.remove_punctuation(data)
        data = self.remove_apostrophe(data)
        data = self.remove_numbers(data)
        data = self.lemmatization(data)
        data = self.remove_stop_words(data)
        return data

    def fit(self, X, y):
        X_preprocessed = [self.preprocess(text) for text in X]
        X_tfidf = self.vectorizer.fit_transform(X_preprocessed)
        y_encoded = self.label_encoder.fit_transform(y)
        self.model.fit(X_tfidf, y_encoded)

    def predict(self, X):
        X_preprocessed = [self.preprocess(text) for text in X]
        X_tfidf = self.vectorizer.transform(X_preprocessed)
        predictions = self.model.predict(X_tfidf)
        return self.label_encoder.inverse_transform(predictions)

    def save(self, filepath):
        joblib.dump(self, filepath)

    @staticmethod
    def load(filepath):
        return joblib.load(filepath)


def predict_priority(bug_description):
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'text_classifier.pkl')
        loaded_classifier = TextClassifier.load(model_path)

        predicted_priority = loaded_classifier.predict([bug_description])
        return predicted_priority[0]
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict_category.py <bug_description>")
        sys.exit(1)

    bug_description = sys.argv[1]
    priority = predict_priority(bug_description)
    print(priority)
