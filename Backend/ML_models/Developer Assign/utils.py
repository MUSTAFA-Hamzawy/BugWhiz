import re
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import string

# Download the 'punkt' tokenizer from NLTK (Natural Language Toolkit) if not already downloaded
# nltk.download('punkt')

# Download the stopwords dataset from NLTK if not already downloaded
# nltk.download('stopwords')

# Initialize a Porter stemmer from NLTK for stemming words
stemmer = PorterStemmer()

# Retrieve the set of stopwords in English from NLTK
stop_words = set(stopwords.words('english'))

def split_dataframe(df, num_chunks):
    """
    Splits a DataFrame into a specified number of chunks.

    Parameters:
    df (pandas.DataFrame): The DataFrame to be split.
    num_chunks (int): The number of chunks to split the DataFrame into.

    Returns:
    list: A list containing the resulting DataFrame chunks.

    Description:
    This function divides the input DataFrame `df` into `num_chunks` smaller DataFrames. 
    Each chunk is approximately equal in size. If the DataFrame's length is not perfectly 
    divisible by `num_chunks`, the first few chunks will contain an extra row until 
    the remainder is distributed.

    The function works by calculating the size of each chunk and any remainder left after 
    equal division. It then iterates over the number of chunks, determining the start 
    and end indices for each chunk, and appends each chunk to a list.

    Example:
    >>> import pandas as pd
    >>> df = pd.DataFrame({'A': range(10)})
    >>> chunks = split_dataframe(df, 3)
    >>> for chunk in chunks:
    >>>     print(chunk)
    """
    # Calculate the size of each chunk
    chunk_size = len(df) // num_chunks
    # Calculate any remaining rows after equal division
    remainder = len(df) % num_chunks
    # Initialize start index
    start = 0
    # List to hold chunks
    chunks = []
    
    for i in range(num_chunks):
        # Calculate the end index for the current chunk
        end = start + chunk_size
        # Distribute the remainder rows among the first 'remainder' chunks
        if i < remainder:
            end += 1
        # Append the chunk to the list
        chunks.append(df.iloc[start:end])
        # Update the start index for the next chunk
        start = end

    return chunks


def preprocess_summary(text):
    """
    Preprocesses a summary string by removing special characters, newlines, and hyperlinks.

    Parameters:
    summary (str): The summary string to preprocess.

    Returns:
    str: The preprocessed summary string.
    """
    # Remove hyperlinks from the text using regular expressions
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)

    # Replace newline and carriage return characters with spaces
    text = text.replace('\n', ' ').replace('\r', ' ')

    # Remove special characters (keep only alphanumeric characters and spaces)
    text = re.sub(r'[^A-Za-z0-9 ]+', '', text)

    return text 

def filter_by_word_count(df, min_word_count):
    """
    Filter a DataFrame 'df' to include only rows where the 'Summary' column has at least 'min_word_count' words.

    Parameters:
    df (DataFrame): The input DataFrame containing a 'Summary' column.
    min_word_count (int): The minimum number of words required in the 'Summary' column.

    Returns:
    DataFrame: A filtered DataFrame containing rows with at least 'min_word_count' words in the 'Summary' column.
    """
    # Split each summary into words, count the number of words, and filter rows based on word count
    return df[df['Summary'].str.split().str.len() >= min_word_count]


def tokenize_summary(text):
    """
    Tokenize the input text into words using word_tokenize from nltk.

    Parameters:
    -----------
    text : str
        The input text to tokenize.

    Returns:
    --------
    list
        A list of tokens (words) extracted from the input text.
    """
    # Tokenize the text into words, converting to lowercase
    return word_tokenize(text.lower())


def remove_stopwords(tokens):
    """
    Remove stopwords and punctuation from a list of tokens.

    Parameters:
    -----------
    tokens : list
        A list of tokens (words) from which stopwords and punctuation will be removed.

    Returns:
    --------
    list
        A list of tokens with stopwords and punctuation removed.
    """
    # List comprehension to filter out stopwords and punctuation
    return [word for word in tokens if word not in stop_words and word not in string.punctuation]

def stem_tokens(tokens):
    """
    Apply stemming to a list of tokens.

    Parameters:
    -----------
    tokens : list
        A list of tokens (words) to be stemmed.

    Returns:
    --------
    list
        A list of stemmed tokens.
    """
    # Apply stemming using the Porter Stemmer
    return [stemmer.stem(word) for word in tokens]

def join_tokens(tokens):
    """
    Join a list of tokens into a single string.

    Parameters:
    -----------
    tokens : list
        A list of tokens (words) to be joined into a string.

    Returns:
    --------
    str
        A single string where tokens are joined by a space.
    """
    # Join tokens into a single string separated by a space
    return ' '.join(tokens)