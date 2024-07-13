import pandas as pd
import json
import sys
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import re
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
import math
from collections import defaultdict
from sklearn.base import BaseEstimator, TransformerMixin

# Remove the stop words from the preprocessed_description column using nltk
# nltk.download('stopwords')
# nltk.download('punkt')
# nltk.download('wordnet')
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

def extract_ticket_descriptions(data):
    # Initialize the result dictionary
    result = {}
    
    # Extract project tickets and populate the dictionary
    project_tickets = data.get("projectTickets", [])
    for ticket in project_tickets:
        ticket_id = ticket.get("_id")
        description = ticket.get("description")
        if ticket_id and description:
            result[ticket_id] = description
    
    return result

def extract_new_bug_description(data):
    # Extract the new bug description
    new_bug_description = data.get("bugDescription")
    
    return new_bug_description

class TfIdfVectorizer(BaseEstimator, TransformerMixin):
    def __init__(self, max_df=1.0, min_df=1, stop_words=None, ngram_range=(1, 1)):
        self.max_df = max_df
        self.min_df = min_df
        self.stop_words = stop_words
        self.ngram_range = ngram_range
        self.vocab = {}
        self.idf = {}
    
    def fit(self, documents):
        # Tokenize documents and calculate document frequency (DF)
        doc_count = len(documents)
        df = defaultdict(int)
        
        for doc in documents:
            tokens = self._tokenize(doc)
            unique_tokens = set(tokens)
            for token in unique_tokens:
                df[token] += 1

        # Filter tokens based on max_df and min_df
        self.vocab = {token: i for i, (token, count) in enumerate(df.items()) 
                    if count >= self.min_df and count <= self.max_df * doc_count}
        
        # Calculate inverse document frequency (IDF)
        self.idf = {token: math.log(doc_count / (count + 1)) + 1 for token, count in df.items() if token in self.vocab}
        
        return self

    def transform(self, documents):
        # Calculate TF-IDF for each document
        tfidf_matrix = np.zeros((len(documents), len(self.vocab)))
        
        for i, doc in enumerate(documents):
            tokens = self._tokenize(doc)
            tf = self._calculate_tf(tokens)
            
            for token, freq in tf.items():
                if token in self.vocab:
                    tfidf_matrix[i, self.vocab[token]] = freq * self.idf[token]
        
        return tfidf_matrix
    
    def fit_transform(self, documents):
        return self.fit(documents).transform(documents)

    def _tokenize(self, document):
        # Simple tokenization: split by whitespace and remove stop words
        words = document.lower().split()
        if self.stop_words:
            words = [word for word in words if word not in self.stop_words]
        
        # Generate n-grams
        tokens = []
        for n in range(self.ngram_range[0], self.ngram_range[1] + 1):
            for i in range(len(words) - n + 1):
                tokens.append(' '.join(words[i:i + n]))
        
        return tokens
    
    def _calculate_tf(self, tokens):
        # Calculate term frequency (TF)
        tf = defaultdict(int)
        for token in tokens:
            tf[token] += 1
        total_tokens = len(tokens)
        return {token: freq / total_tokens for token, freq in tf.items()}

def extract_tfidf_features(bug_reports, max_df=1.0, min_df=1, stop_words=None):
    # Extract bug report descriptions
    descriptions = list(bug_reports.values())
    
    # Initialize the TF-IDF vectorizer
    vectorizer = TfIdfVectorizer(max_df=max_df, min_df=min_df, stop_words=stop_words)
    
    # Extract TF-IDF features
    tfidf_features = vectorizer.fit_transform(descriptions)
    
    # Create a dictionary of bug report IDs and their corresponding TF-IDF features
    bug_report_ids = list(bug_reports.keys())
    bug_report_tfidf = {bug_report_ids[i]: tfidf_features[i] for i in range(len(bug_report_ids))}
    
    return vectorizer, bug_report_tfidf

def calculate_cosine_similarity(bug_report_features, bug_id1, bug_id2):
    
    # Get the TF-IDF features for the two bug reports
    features1 = bug_report_features.get(bug_id1)
    features2 = bug_report_features.get(bug_id2)
    
    # Calculate the cosine similarity between the two bug reports
    similarity = cosine_similarity([features1], [features2])[0][0]
    
    return similarity

if __name__ == "__main__":

    # 1- Read the input from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    # 2- Extract the ticket descriptions from the json file
    ticket_descriptions = extract_ticket_descriptions(data)

    # 3- Preprocess the ticket descriptions
    preprocessed_descriptions = {ticket_id: preprocess(description) for ticket_id, description in ticket_descriptions.items()}

    # 4- Extract TF-IDF features from the preprocessed descriptions
    vectorizer, tfidf_features = extract_tfidf_features(preprocessed_descriptions)

    # 5- load the new bug from the json file
    new_bug = extract_new_bug_description(data)

    # 6- Preprocess the new bug
    preprocessed_new_bug = preprocess(new_bug)

    # 7- Extract TF-IDF features from the preprocessed new bug
    new_bug_tfidf = vectorizer.transform([preprocessed_new_bug])

    # 8- Calculate the cosine similarity between the new bug and each of the existing tickets
    similarities = {}
    for bug_id, features in tfidf_features.items():
        similarity = cosine_similarity(new_bug_tfidf, [features])[0][0]
        similarities[bug_id] = similarity

    # if the similarity is less than 0.5, remove it from the similarities dictionary
    similarities = {bug_id: similarity for bug_id, similarity in similarities.items() if similarity >= 0.5}

    # 9- Sort the tickets based on the cosine similarity in descending order
    sorted_tickets = sorted(similarities.items(), key=lambda x: x[1], reverse=True)

    # truncate the float number to 2 decimal points and multiply by 100 to get the percentage
    sorted_tickets = [(ticket_id, similarity * 100) for ticket_id, similarity in sorted_tickets]

    # convert the numbers to integers
    sorted_tickets = [(ticket_id, int(similarity)) for ticket_id, similarity in sorted_tickets]

    # 10- Print the top 5 tickets with the highest cosine similarity to the new bug in form of string "id similarity,id similarity,..."
    top_tickets = sorted_tickets[:5]
    top_tickets_str = ",".join([f"{ticket_id} {similarity:.4f}" for ticket_id, similarity in top_tickets])
    print(top_tickets_str)
