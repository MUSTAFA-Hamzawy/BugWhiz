import pandas as pd
from sklearn.svm import SVC
from sklearn.metrics import classification_report
from sklearn.model_selection import cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib



def try_ngram_combinations(data, ngram_range):
    results = []

    # Initialize the TfidfVectorizer
    vectorizer = TfidfVectorizer(ngram_range=ngram_range)

    # Fit and transform the data
    X_transformed = vectorizer.fit_transform(data)


    return X_transformed, vectorizer


data1, vectorizer1 = try_ngram_combinations(filtered_train_df['bug_description'], (1, 2))



# SVM model
model = SVC(C = 100)
print(f"Model trained using n-gram range: {vectorizer1.ngram_range}")

# Perform cross-validation to evaluate the model
scores = cross_val_score(model, data1, filtered_train_df['class_name'], cv=5)
print(f"Cross-Validation Scores: {scores}")

# Fit the model on the entire training data
model.fit(data1, filtered_train_df['class_name'])

# Predict the class labels for the testing data
X_test_transformed = vectorizer1.transform(filtered_test_df['bug_description'])
y_pred = model.predict(X_test_transformed)

# Print the classification report
print(classification_report(filtered_test_df['class_name'], y_pred, target_names=filtered_test_df['class_name'].unique()))

# Print the confusion matrix
print(pd.crosstab(filtered_test_df['class_name'], y_pred, rownames=['Actual'], colnames=['Predicted']))


# Print the accuracy
accuracy = model.score(X_test_transformed, filtered_test_df['class_name'])
print(f"Accuracy: {round(accuracy, 3) * 100}%")

# Save the model and the vectorizer
joblib.dump(model, 'svm_model.pkl')
joblib.dump(vectorizer1, 'vectorizer.pkl')
print("Model and vectorizer saved successfully.")