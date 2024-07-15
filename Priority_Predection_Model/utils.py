import joblib
import numpy as np

def save_model(model, filepath):
    """
    Save the model to the specified filepath using joblib.

    Args:
    model: The model to be saved.
    filepath (str): The path where the model should be saved.
    """
    joblib.dump(model, filepath)

def load_model(filepath):
    """
    Load the model from the specified filepath using joblib.

    Args:
    filepath (str): The path from where the model should be loaded.

    Returns:
    model: The loaded model.
    """
    return joblib.load(filepath)
