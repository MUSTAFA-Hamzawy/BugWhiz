import sys
import json

if __name__ == "__main__":
    # Read the input from stdin
    input_data = sys.stdin.read()

    # Parse the JSON input
    data = json.loads(input_data)

    # Example processing: just print the bugDescription
    bugDescription = data['bugDescription']

    # Example processing: just print developersData
#     for developer in data['developersData']:
#         developer['developerID']
#         developer['jobTitle']
#         developer['oldBugsDescription']  # Array of strings


    output = "667a760a6da0c47fe0a327cd,667a760a6da0c47fe0a327cd,667a760a6da0c47fe0a327cd"
    print(output)

