
import nltk
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import joblib
import sys
import os
import json
import numpy as np
import utils
import tf_idf_utils
import warnings
from sklearn.exceptions import InconsistentVersionWarning
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

# Define the prediction function to get top 5 classes
def predict_top_5_classes(bug_report, svm_classifier, idf, default_idf, vocab, default_idx):
    # Tokenize the new data
    new_data_tokens = [tf_idf_utils.custom_tokenize(doc) for doc in bug_report]
    # Compute TF-IDF for the new data using the loaded IDF
    new_data_tfidf = [tf_idf_utils.compute_tfidf(tf_idf_utils.compute_tf(doc), idf, default_idf) for doc in new_data_tokens]
    # Convert the TF-IDF vectors to a sparse matrix
    new_data_tfidf_matrix = tf_idf_utils.tfidf_to_sparse_matrix(new_data_tfidf, vocab, default_idx)

    probabilities = svm_classifier.predict_proba(new_data_tfidf_matrix)[0]
    top_5_indices = np.argsort(probabilities)[-5:][::-1]
    return set(top_5_indices)

# Function for inference based on bug report
def Inference(bug_report, svm_classifier, idf, default_idf, vocab, default_idx):
    # Tokenize the bug report
    tokens = utils.tokenize_summary(bug_report)

    # Remove stop words
    tokens_without_stop_words = utils.remove_stopwords(tokens)

    # Apply stemming
    stemmed_tokens = utils.stem_tokens(tokens_without_stop_words)

    joined_tokens = utils.join_tokens(stemmed_tokens)
    # Predict the top 5 classes using the svm_classifier after applying TF-IDF
    top_5_classes = predict_top_5_classes(joined_tokens, svm_classifier, idf, default_idf, vocab, default_idx)

    return top_5_classes

def main():
    # Load the claddifier, TF-IDF vectorizer and label encoder
    svm_classifier = joblib.load(os.path.join(os.path.dirname(__file__), 'svm_classifier_model_with_tf_idf_implementation_final.joblib'))

    # Load the tfidf components
    idf, default_idf, vocab, default_idx = joblib.load(os.path.join(os.path.dirname(__file__),'custom_tfidf_vectorizer_final.pkl'))
    # Load and parse the input data
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    bug_description = data["bugDescription"]

    # Perform inference to predict top 5 classes for the input bug description
    input_bug_top_5_classes = Inference(bug_description, svm_classifier, idf, default_idf, vocab, default_idx)

    # Dictionary to store the number of common classes for each developer
    developers_bugs_classes = {}

    # Set to store developers with no bugs solved
    developers_with_no_bugs = set()

    # Iterate over developers' data
    for developer in data["developersData"]:
        developer_id = developer["developerID"]
        old_bugs = developer["oldBugsDescription"]

        # Check if the developer has no old bugs
        if not old_bugs:
            developers_with_no_bugs.add(developer_id)
            continue

        # Count common classes between input bug and each old bug
        common_classes_count = 0
        for bug in old_bugs:
            predicted_top_5_classes = Inference(bug, svm_classifier, idf, default_idf, vocab, default_idx)
            common_classes = input_bug_top_5_classes.intersection(predicted_top_5_classes)
            common_classes_count += len(common_classes)

        # Store the total common classes count for the developer
        developers_bugs_classes[developer_id] = common_classes_count

    # Sort developers by common class counts in descending order
    sorted_developers = sorted(developers_bugs_classes.items(), key=lambda item: item[1], reverse=True)

    # Get the top developers (at most 5)
    num_top_developers = min(5, len(sorted_developers))

    # Get the top 5 developers based on common class counts
    recommended_developers = [developer_id for developer_id, _ in sorted_developers[:num_top_developers]]

    # Ensure that all developers with no bugs are considered for recommendation
    if developers_with_no_bugs:
      if(len(recommended_developers)==5):
        # Replace the last recommendation with a developer with no bugs
        recommended_developers[4] = developers_with_no_bugs.pop()
      else:
        # Add developers with no bugs until the recommended list reaches 5 developers
        while(len(recommended_developers) < 5 and developers_with_no_bugs):
          recommended_developers.append(developers_with_no_bugs.pop())

    # Print the recommended developers
    result = ','.join(recommended_developers)
    print(result)

if __name__ == "__main__":
    main()