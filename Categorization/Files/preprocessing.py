import numpy as np
import re
import csv
from collections import defaultdict
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

stop_words = set(stopwords.words('english'))



def remove_punctuation(data):
    symbols = "!\"#$%&()*+-./:;<=>?@[\]^_`{|}~\n"
    for i in symbols:
        data = np.char.replace(data, i, ' ')
    return str(data)

def convert_lower_case(data):
    return str(data).lower()

def remove_apostrophe(data):
    return np.char.replace(data, "'", "")

def remove_numbers(data):
    return re.sub(r'\d+', '', str(data))

def remove_single_characters(tokens):
    new_text = ""
    for w in tokens:
        if len(w) > 1:
            new_text = new_text + " " + w
    return new_text

def lemmatization(data):
    lemmatizer = WordNetLemmatizer()
    tokens = word_tokenize(data)
    data = remove_single_characters(tokens)
    lemmatized_output = ' '.join([lemmatizer.lemmatize(word) for word in tokens])
    return lemmatized_output

def remove_stop_words(data):
    tokens = word_tokenize(data)
    data = ' '.join([i for i in tokens if not i in stop_words])
    return data

def preprocess(data):
    data = convert_lower_case(data)
    data = remove_punctuation(data)
    data = remove_apostrophe(data)
    data = remove_numbers(data)
    data = lemmatization(data)
    return data


# read the preprocessed data from the new file
training_data_file = 'train.csv'
testing_data_file = 'test.csv'
preprocessed_train_df = pd.read_csv(training_data_file)
preprocessed_test_df = pd.read_csv(testing_data_file)

# show the first 5 rows of the preprocessed training data
print(preprocessed_train_df.head())
print(preprocessed_test_df.head())


# Convert non-string values to strings in 'bug_description' column
preprocessed_train_df['bug_description'] = preprocessed_train_df['bug_description'].apply(lambda x: str(x))
preprocessed_test_df['bug_description'] = preprocessed_test_df['bug_description'].apply(lambda x: str(x))

# Remove stop words from 'bug_description' column
preprocessed_train_df['bug_description'] = preprocessed_train_df['bug_description'].apply(lambda x: remove_stop_words(x))
preprocessed_test_df['bug_description'] = preprocessed_test_df['bug_description'].apply(lambda x: remove_stop_words(x))

print( preprocessed_test_df['bug_description'][0] )
print( preprocessed_train_df['bug_description'][0] )


# keep only the reports that has class_name of Frontend, Backend, Security, Documentation
# Filter the training data
filtered_train_df = preprocessed_train_df[
    (preprocessed_train_df['class_name'] == 'Frontend') |
    (preprocessed_train_df['class_name'] == 'Backend') |
    (preprocessed_train_df['class_name'] == 'Security') |
    (preprocessed_train_df['class_name'] == 'Documentation')
]

# Filter the testing data
filtered_test_df = preprocessed_test_df[
    (preprocessed_test_df['class_name'] == 'Frontend') |
    (preprocessed_test_df['class_name'] == 'Backend') |
    (preprocessed_test_df['class_name'] == 'Security') |
    (preprocessed_test_df['class_name'] == 'Documentation')
]

# Show the first 5 rows of the filtered training data
print("Filtered Training Data:")
print(filtered_train_df.head())

# Show the first 5 rows of the filtered testing data
print("\nFiltered Testing Data:")
print(filtered_test_df.head())


# Define the mapping of class names to the desired order
class_name_mapping = {
    'Frontend': 0,
    'Backend': 1,
    'Security': 2,
    'Documentation' : 3,
}

# Map class names in both training and testing data to the desired order
filtered_train_df['class_label'] = filtered_train_df['class_name'].map(class_name_mapping)
filtered_test_df['class_label'] = filtered_test_df['class_name'].map(class_name_mapping)

# order them based on the number of class_label
filtered_train_df = filtered_train_df.sort_values(by=['class_label'])
filtered_test_df = filtered_test_df.sort_values(by=['class_label'])

# Print the unique class names in the training data
print(filtered_train_df['class_name'].unique())


# Dictionary to store counts of each category
category_counts = defaultdict(int)

# Read the CSV file and count occurrences of each category
with open(training_data_file, 'r', newline='', encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file)
    for row in csv_reader:
        if len(row) == 2:  # Ensure the row has both report and category
            _, category = row
            category_counts[category] += 1

# Print the counts of each category
for category, count in category_counts.items():
    print(f"Category: {category}, Count: {count}")