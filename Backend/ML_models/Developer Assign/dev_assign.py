import nltk
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import joblib
import sys
import os
import json
import numpy as np
import warnings

from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

# Remove stop words from the bug report
def remove_stopwords(tokens, stop_words):
    return [word for word in tokens if word.lower() not in stop_words]

# Apply stemming on the bug tokens
def stem_tokens(tokens, stemmer):
    return [stemmer.stem(word) for word in tokens]

# Get the class using the svm_classifier
def predict_summary(summary, tfidf_vectorizer, svm_classifier):
    # Preprocess the input summary
    summary_tfidf = tfidf_vectorizer.transform(summary)

    # Predict the class
    predicted_class = svm_classifier.predict(summary_tfidf)

    return predicted_class[0]

# Define the prediction function to get top 5 classes
def predict_top_5_classes(summary, tfidf_vectorizer, svm_classifier):
    summary_tfidf = tfidf_vectorizer.transform([' '.join(summary)])
    probabilities = svm_classifier.predict_proba(summary_tfidf)[0]
    top_5_indices = np.argsort(probabilities)[-5:][::-1]
    return set(top_5_indices)

def Inference(bug_report, stop_words, stemmer, tfidf_vectorizer, svm_classifier):
    # Apply tokenization
    tokens = word_tokenize(bug_report)
    # Remove stop words
    remove_stopwords(tokens, stop_words)
    # Apply stemming
    stem_tokens(tokens, stemmer)
    # Predict the top 5 classes using the svm_classifier after applying TF-IDF
    top_5_classes = predict_top_5_classes(tokens, tfidf_vectorizer, svm_classifier)

    return top_5_classes

def main():
    # Prepare tokenizer, stemmer and stop words**
#     nltk.download('punkt')
#     nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))
    stemmer = PorterStemmer()

    # Load the claddifier, TF-IDF vectorizer
    svm_classifier = joblib.load(os.path.join(os.path.dirname(__file__), 'svm_classifier_model_with_probability.joblib'))
    tfidf_vectorizer = joblib.load(os.path.join(os.path.dirname(__file__), 'tfidf_vectorizer.joblib'))

    # Prepare the data
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    # Extract bug description
    bug_description = data["bugDescription"]

    input_bug_top_5_classes = Inference(bug_description, stop_words, stemmer, tfidf_vectorizer, svm_classifier)

    # Create a dictionary to store the results
    developers_bugs_classes = {}

    developers_with_no_bugs = set()
    # Extract developers' data
    for developer in data["developersData"]:
        developer_id = developer["developerID"]
        old_bugs = developer["oldBugsDescription"]
        # Check if the bug list is empty
        if not old_bugs:
            developers_with_no_bugs.add(developer_id)
            continue

        common_classes_count = 0
        for bug in old_bugs:
            predicted_top_5_classes = Inference(bug, stop_words, stemmer, tfidf_vectorizer, svm_classifier)
            common_classes = input_bug_top_5_classes.intersection(predicted_top_5_classes)
            common_classes_count += len(common_classes)
        developers_bugs_classes[developer_id] = common_classes_count

    # Sort developers by common class counts in descending order
    sorted_developers = sorted(developers_bugs_classes.items(), key=lambda item: item[1], reverse=True)

    # Get the top developers (at most 5)
    num_top_developers = min(5, len(sorted_developers))

    # Get the top 5 developers
    recommended_developers = [developer_id for developer_id, _ in sorted_developers[:num_top_developers]]

    # If there are developers that didn't solve bugs before ==> add them at the end of the list so they try to solve bugs
    if developers_with_no_bugs:
      if(len(recommended_developers)==5):
        # replace the last recommendation in the recommended develoeprs with a developer from the team that didn't solve a bug before
        recommended_developers[4] = developers_with_no_bugs.pop()
      else:
        # if the recommended_developers list is less than 5 recommendations ==> add developers with no bugs till their set ends or the recommendations list reaches 5 developers
        while(len(recommended_developers) < 5 and developers_with_no_bugs):
          recommended_developers.append(developers_with_no_bugs.pop())

    # Print the results
    result = ','.join(recommended_developers)
    print(result)

if __name__ == "__main__":
    main()
