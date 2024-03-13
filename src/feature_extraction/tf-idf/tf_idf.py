from sklearn.feature_extraction.text import TfidfVectorizer

# Import the preprocessing module
import sys
sys.path.append('..')
from Preprocessing.preprocessing import preprocess_bug_description

# Sample bug report data
bug_reports = [
    "Bug report 1: This is the first bug report.",
    "Bug report 2: This is another bug report.",
    "Bug report 3: Yet another bug report.",
    "Bug report 4: This bug report is similar to the first one.",
]

# Initialize the TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()

# Fit the vectorizer to the bug report data and transform it into TF-IDF vectors
tfidf_vectors = tfidf_vectorizer.fit_transform(bug_reports)

# Get the feature names (words)
feature_names = tfidf_vectorizer.get_feature_names_out()

# Print the shape of the TF-IDF matrix
print("TF-IDF matrix shape:", tfidf_vectors.shape)

# Convert the TF-IDF matrix to an array for easy inspection
tfidf_array = tfidf_vectors.toarray()

# Print the TF-IDF vectors with corresponding words
for i, bug_report in enumerate(bug_reports):
    print("\nBug Report:", bug_report)
    for word_index, tfidf_value in enumerate(tfidf_array[i]):
        if tfidf_value != 0:
            print("Word:", feature_names[word_index], "- TF-IDF Value:", tfidf_value)

# Function to apply TF-IDF to bug reports
def tfidf_bug_reports(bug_reports):
    # Initialize the TF-IDF vectorizer
    tfidf_vectorizer = TfidfVectorizer()
    
    # Preprocess and apply TF-IDF to each bug report
    tfidf_results = []
    for bug_report in bug_reports:

        # Preprocess the bug report description
        preprocessed_description = preprocess_bug_description(bug_report)

        # Apply TF-IDF
        tfidf_vectors = tfidf_vectorizer.fit_transform([preprocessed_description])

        # Get the TF-IDF vectors
        tfidf_results.append((preprocessed_description, tfidf_vectors, tfidf_vectorizer.get_feature_names_out()))
    
    return tfidf_results