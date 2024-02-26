import os
import pandas as pd
import glob

# Get the current working directory
current_directory = os.getcwd()

# Name of the directory containing the CSV files
directory_name = 'csv_files'

# Path to the directory containing the CSV files
directory_path = os.path.join(current_directory, directory_name)

# Get a list of all CSV files in the directory
csv_files = glob.glob(directory_path + '/*.csv')

# Initialize an empty list to store DataFrames
dfs = []

# Iterate over each CSV file
for csv_file in csv_files:
    # Read each CSV file into a DataFrame
    df = pd.read_csv(csv_file)
    # Append the DataFrame to the list
    dfs.append(df)

# Concatenate all DataFrames in the list along the rows
merged_df = pd.concat(dfs, ignore_index=True)

# Write the merged DataFrame to a new CSV file
merged_df.to_csv('merged_file.csv', index=False)
