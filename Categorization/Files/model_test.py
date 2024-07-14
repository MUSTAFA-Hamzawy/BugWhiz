import joblib

# Load the model and the vectorizer
loaded_model = joblib.load('svm_model.pkl')
loaded_vectorizer = joblib.load('vectorizer.pkl')

# Example new data for prediction
new_data = [
    "We have some problems in api and it slows down the system.",       # Backend
    "Manual guide of the installation is very bad.",           # Documentation
    "customer wants to add button on the main page to show products",   # Frontend
    "add warning when there is an error within the certificate"         # Security
    ]

# Transform the new data using the loaded vectorizer
new_data_transformed = loaded_vectorizer.transform(new_data)

# Predict the class label for the new data
new_pred = loaded_model.predict(new_data_transformed)

# Print the prediction
print(f"Predicted class for the new input: {new_pred}")