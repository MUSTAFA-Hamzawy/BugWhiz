import numpy as np
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

class TextPreprocessor:
    def __init__(self):
        """
        Initialize the TextPreprocessor with a lemmatizer and a set of stop words.
        """
        self.lemmatizer = WordNetLemmatizer()  
        self.stop_words = set(stopwords.words('english'))  
        

    def to_lower_case(self, text):
        """
        Convert the input text to lowercase.

        Args:
        text (str): The text to convert.

        Returns:
        str: Lowercased version of the input text.
        """
        return str(text).lower()  
    

    def clean_text(self, text):
        """
        Remove special characters and symbols from the text by replacing them with spaces.

        Args:
        text (str): The text to clean.

        Returns:
        str: Text with special characters replaced by spaces.
        """
        # Define symbols to be replaced with spaces
        symbols = "!\"#$%&()*+-./:;<=>?@[]^_`{|}~,\n'"
        
        # Replace each symbol with a space
        for symbol in symbols:
            text = np.char.replace(text, symbol, ' ')
        return str(text)
    

    def remove_numbers(self, text):
        """
        Remove numerical digits from the text.

        Args:
        text (str): The text from which to remove numbers.

        Returns:
        str: Text with numerical digits removed.
        """
        return re.sub(r'\d+', '', str(text))  
    

    def tokenize_and_remove_stopwords(self, text):
        """
        Tokenize the text into words and remove stop words.

        Args:
        text (str): The text to tokenize and filter.

        Returns:
        list of str: Tokens from the text with stop words removed.
        """
        # Tokenize the text into words
        tokens = word_tokenize(text)  
        
        # Remove stop words from the tokens
        return [word for word in tokens if word not in self.stop_words]
    

    def lemmatize_and_clean_tokens(self, tokens):
        """
        Lemmatize tokens and filter out tokens with length <= 1.

        Args:
        tokens (list of str): Tokens to lemmatize and filter.

        Returns:
        str: Processed text with lemmatized tokens joined by spaces.
        """
        # Lemmatize tokens and filter out tokens with length <= 1
        lemmatized_tokens = [self.lemmatizer.lemmatize(word) for word in tokens]
        return ' '.join([word for word in lemmatized_tokens if len(word) > 1])
    

    def preprocess(self, text):
        """
        Preprocess the input text through lowercasing, cleaning, removing numbers,
        tokenizing, removing stop words, and lemmatizing.

        Args:
        text (str): The text to preprocess.

        Returns:
        str: Preprocessed text.
        """
        text = self.to_lower_case(text) 
        # Remove special characters
        text = self.clean_text(text)  
        text = self.remove_numbers(text)  
        tokens = self.tokenize_and_remove_stopwords(text)  
        processed_text = self.lemmatize_and_clean_tokens(tokens)  
        return processed_text
































import pickle
import numpy as np
import re
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import numpy as np

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

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
        symbols = "!\"#$%&()*+-./:;<=>?@[]^_`{|}~\n"
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
        with open(filepath, 'wb') as f:
            pickle.dump(self, f)

    @staticmethod
    def load(filepath):
        with open(filepath, 'rb') as f:
            return pickle.load(f)