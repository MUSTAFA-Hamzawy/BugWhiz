import nltk
from nltk.stem import WordNetLemmatizer
import re

# Download NLTK resources
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize the WordNet Lemmatizer
lemmatizer = WordNetLemmatizer()

def preprocess_bug_description(description):

    # Convert to lowercase
    description = description.lower()

    # Remove punctuation and special characters
    description = re.sub(r'[^a-zA-Z0-9\s]', '', description)

    # Remove numbers
    description = re.sub(r'\b\d+\b', '', description)

    # Remove extra whitespace
    description = re.sub(r'\s+', ' ', description)

    return description




'''
# Function to preprocess bug description text with negation handling and stopwords removal
def preprocess_bug_description(text):
    # Lowercase the text
    text = text.lower()
    
    # Remove punctuation and numbers
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove any remaining special characters and extra whitespaces
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = ' '.join(text.split())
    
    # Tokenize the text
    tokens = word_tokenize(text)
    
    # Lemmatization
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    
    # Remove stopwords with negation handling
    stop_words = set(stopwords.words('english'))
    negation_words = {'not', 'no', 'n\'t'}
    filtered_tokens = []
    negate = False
    for word in tokens:
        if word in negation_words:
            negate = True
        elif word not in stop_words:  # Check if word is not a stopword
            if negate:
                filtered_tokens.append("not_" + word)  # Prefix with "not_" for negation
                negate = False
            else:
                filtered_tokens.append(word)
    
    # Concatenate tokens into a single string
    preprocessed_text = ' '.join(filtered_tokens)
    
    return preprocessed_text
'''

'''
# Function to preprocess bug description text with negation handling
def preprocess_bug_description(text):
    # Lowercase the text
    text = text.lower()
    
    # Remove punctuation and numbers
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove any remaining special characters and extra whitespaces
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = ' '.join(text.split())
    
    # Tokenize the text
    tokens = word_tokenize(text)
    
    # Lemmatization
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    
    # Remove stopwords with negation handling
    stop_words = set(stopwords.words('english'))
    negation_words = {'not', 'no', 'n\'t'}
    filtered_tokens = []
    negate = False
    for word in tokens:
        if word in negation_words:
            negate = True
        elif negate:
            filtered_tokens.append("not_" + word)  # Prefix with "not_" for negation
            negate = False
        else:
            filtered_tokens.append(word)
    
    # Concatenate tokens into a single string
    preprocessed_text = ' '.join(filtered_tokens)
    
    return preprocessed_text
'''
