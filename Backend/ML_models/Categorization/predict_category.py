import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

import joblib
import sys
import os

def predict_category(bug_description):
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'svm_model.pkl')
        vectorizer_path = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')

        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        transformed_description = vectorizer.transform([bug_description])
        predicted_category = model.predict(transformed_description)

        return predicted_category[0]
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict_category.py <bug_description>")
        sys.exit(1)

    bug_description = sys.argv[1]
    category = predict_category(bug_description)
    print(category)
