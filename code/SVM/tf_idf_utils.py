from scipy.sparse import csr_matrix
import math
from collections import Counter, defaultdict
from typing import List

def generate_ngrams(tokens: List[str], n: int) -> List[str]:
    n_grams = []
    for i in range(1, n + 1):
        for j in range(len(tokens) - i + 1):
            n_gram = ' '.join(tokens[j:j+i])
            n_grams.append(n_gram)
    return n_grams

def custom_tokenize(text, ngram_range=(1, 2)):
    # Tokenize the text
    tokens = text.split()  # Or use a more sophisticated tokenizer
    # Filter out single-character tokens
    tokens = [token for token in tokens if len(token) > 1]
    # Generate n-grams
    return generate_ngrams(tokens, ngram_range[1])

def compute_tf(doc):
    tf_dict = Counter(doc)
    total_terms = len(doc)
    tf_dict = {word: count / total_terms for word, count in tf_dict.items()}
    return tf_dict

def compute_idf(corpus):
    idf_dict = defaultdict(int)
    num_docs = len(corpus)

    for doc in corpus:
        for word in set(doc):
            idf_dict[word] += 1

    idf_dict = {word: math.log(num_docs / count) for word, count in idf_dict.items()}
    return idf_dict

def compute_tfidf(tf, idf, default_idf):
    tfidf = {word: tf_val * idf.get(word, default_idf) for word, tf_val in tf.items()}
    return tfidf

def tfidf_to_sparse_matrix(tfidf_list, vocab, default_idx):
    rows, cols, data = [], [], []
    for row, tfidf in enumerate(tfidf_list):
        for word, val in tfidf.items():
            col = vocab.get(word, default_idx)
            rows.append(row)
            cols.append(col)
            data.append(val)
    return csr_matrix((data, (rows, cols)), shape=(len(tfidf_list), len(vocab) + 1))