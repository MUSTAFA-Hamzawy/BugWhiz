import csv

file_path = 'merged_file.csv'

# Open the file in read mode
with open(file_path, 'r') as file:
    # Create a CSV reader object
    csv_reader = csv.reader(file)
    
    # Read the first row of the CSV file
    column_names = next(csv_reader)

    # Use a loop to iterate over each line in the file
    line_count = sum(1 for line in file)

print("Number of lines in the file:", line_count)


print("Column names in the CSV file:", column_names)
