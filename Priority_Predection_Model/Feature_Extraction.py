from collections import Counter
from scipy.sparse import csr_matrix
import math
from sklearn.preprocessing import normalize

class TfidfVectorizerCustom:
    def __init__(self):
        """
        Initialize the TfidfVectorizerCustom with empty vocabulary and IDF values.
        """
        self.vocabulary = {}  
        self.idf_values = {}  
        

    def compute_idf(self, documents, unique_terms):
        """
        Compute the Inverse Document Frequency (IDF) for each term in the documents.

        Args:
        documents (list of str): List of documents.
        unique_terms (set of str): Set of unique terms.

        Returns:
        dict: A dictionary with terms as keys and their IDF scores as values.
        """
        idf_scores = {}
        total_documents = len(documents)  
        
        # Calculate IDF score for each term
        for term in unique_terms:
            doc_count = sum(1 for doc in documents if term in doc.split(" "))
            # IDF formula with smoothing
            idf_scores[term] = 1 + math.log((1 + total_documents) / (1 + doc_count))
        
        return idf_scores
    

    def fit(self, documents):
        """
        Fit the TF-IDF vectorizer on the provided documents by building the vocabulary and IDF values.

        Args:
        documents (list of str): List of documents to fit the vectorizer on.
        """
        unique_terms = set()  
        
        # Iterate through each document to collect unique terms
        for doc in documents:
            for term in doc.split(" "):
                if len(term) < 2:
                    continue  # Ignore terms with length < 2
                unique_terms.add(term)
        
        unique_terms = sorted(list(unique_terms))  # Sort terms alphabetically
        
        # Create vocabulary with term index mapping
        self.vocabulary = {term: idx for idx, term in enumerate(unique_terms)}
        
        # Compute IDF values for the collected terms
        self.idf_values = self.compute_idf(documents, unique_terms)
        

    def transform(self, documents):
        """
        Transform the documents into a normalized TF-IDF sparse matrix.

        Args:
        documents (list of str): List of documents to transform.

        Returns:
        scipy.sparse.csr_matrix: The normalized TF-IDF matrix.
        """
        # Initialize a sparse matrix with dimensions (number of documents, vocabulary size)
        sparse_matrix = csr_matrix((len(documents), len(self.vocabulary)), dtype=float)

        for row, doc in enumerate(documents):
            term_counts = Counter(doc.split(' '))  # Count term frequencies in the document

            for term in doc.split(' '):
                if term in self.vocabulary:
                    tf = term_counts[term] / len(doc.split(' '))  # Term frequency (TF)

                    tfidf = tf * self.idf_values[term]  # TF-IDF score
                    # Assign TF-IDF value to the corresponding cell in the sparse matrix
                    sparse_matrix[row, self.vocabulary[term]] = tfidf

        # Normalize the TF-IDF vectors
        normalized_matrix = normalize(sparse_matrix, norm='l2', axis=1, copy=True, return_norm=False)
        
        return normalized_matrix
