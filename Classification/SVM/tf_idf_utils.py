from typing import List, Dict, Tuple
from collections import Counter, defaultdict
from scipy.sparse import csr_matrix
import math

def generate_ngrams(tokens: List[str], n: int) -> List[str]:
    """
    Generate n-grams from a list of tokens.

    Parameters:
    tokens (List[str]): A list of tokens (words).
    n (int): The maximum number of grams.

    Returns:
    List[str]: A list of n-grams.
    """
    n_grams = []
    for i in range(1, n + 1):
        for j in range(len(tokens) - i + 1):
            n_gram = ' '.join(tokens[j:j+i])
            n_grams.append(n_gram)
    return n_grams

def custom_tokenize(text: str, ngram_range: Tuple[int, int] = (1, 2)) -> List[str]:
    """
    Tokenize text into words and generate n-grams.

    Parameters:
    text (str): The input text to tokenize.
    ngram_range (Tuple[int, int]): The range of n-grams to generate.

    Returns:
    List[str]: A list of n-grams.
    """
    # Tokenize the text
    tokens = text.split()  # Or use a more sophisticated tokenizer
    # Filter out single-character tokens
    tokens = [token for token in tokens if len(token) > 1]
    # Generate n-grams
    return generate_ngrams(tokens, ngram_range[1])

def compute_tf(doc: List[str]) -> Dict[str, float]:
    """
    Compute term frequency (TF) for a document.

    Parameters:
    doc (List[str]): A list of tokens (words) from a document.

    Returns:
    Dict[str, float]: A dictionary where keys are words and values are their term frequencies.
    """
    tf_dict = Counter(doc)
    total_terms = len(doc)
    tf_dict = {word: count / total_terms for word, count in tf_dict.items()}
    return tf_dict

def compute_idf(corpus: List[List[str]]) -> Dict[str, float]:
    """
    Compute inverse document frequency (IDF) for a corpus.

    Parameters:
    corpus (List[List[str]]): A list of documents, each document is a list of tokens (words).

    Returns:
    Dict[str, float]: A dictionary where keys are words and values are their inverse document frequencies.
    """
    idf_dict = defaultdict(int)
    num_docs = len(corpus)

    for doc in corpus:
        for word in set(doc):
            idf_dict[word] += 1

    idf_dict = {word: math.log(num_docs / count) for word, count in idf_dict.items()}
    return idf_dict

def compute_tfidf(tf: Dict[str, float], idf: Dict[str, float], default_idf: float) -> Dict[str, float]:
    """
    Compute TF-IDF for a document.

    Parameters:
    tf (Dict[str, float]): A dictionary where keys are words and values are their term frequencies.
    idf (Dict[str, float]): A dictionary where keys are words and values are their inverse document frequencies.
    default_idf (float): The default IDF value for words not seen in the training corpus.

    Returns:
    Dict[str, float]: A dictionary where keys are words and values are their TF-IDF scores.
    """
    tfidf = {word: tf_val * idf.get(word, default_idf) for word, tf_val in tf.items()}
    return tfidf

def tfidf_to_sparse_matrix(tfidf_list: List[Dict[str, float]], vocab: Dict[str, int], default_idx: int) -> csr_matrix:
    """
    Convert a list of TF-IDF dictionaries to a sparse matrix.

    Parameters:
    tfidf_list (List[Dict[str, float]]): A list of dictionaries where keys are words and values are their TF-IDF scores.
    vocab (Dict[str, int]): A dictionary where keys are words and values are their indices in the matrix.
    default_idx (int): The index for unseen words.

    Returns:
    csr_matrix: A sparse matrix of shape (number of documents, size of vocabulary + 1).
    """
    rows, cols, data = [], [], []
    for row, tfidf in enumerate(tfidf_list):
        for word, val in tfidf.items():
            col = vocab.get(word, default_idx)
            rows.append(row)
            cols.append(col)
            data.append(val)
    return csr_matrix((data, (rows, cols)), shape=(len(tfidf_list), len(vocab) + 1))