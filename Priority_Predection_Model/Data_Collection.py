import requests
import csv

class BugzillaDataFetcher:
    def __init__(self, api_url, output_csv_file):
        """
        Initialize the BugzillaDataFetcher with the API URL and output CSV file path.

        Args:
        api_url (str): Base URL for the Bugzilla API.
        output_csv_file (str): Path to the CSV file where data will be saved.
        """
        self.api_url = api_url
        self.output_csv_file = output_csv_file
        self.search_url = f"{self.api_url}/rest/bug"  # Construct the search URL for querying bugs

        # Parameters for API requests:
        # - include_fields: Specify which fields to include in the response
        # - status: Filter bugs by their status
        # - limit: Maximum number of results per request
        self.params = {
            "include_fields": ["id", "priority", "summary"],
            "status": ["NEW", "ASSIGNED", "REOPENED", "RESOLVED", "VERIFIED"],
            "limit": 5000,
        }

        self.unique_bug_ids = set()  
        self.unique_priority = set()  
        
        self.total_bugs = 0  
        self.offset = 0  # Initial offset for pagination
        self.limit = self.params["limit"]  # Limit for number of results per request
        

    def fetch_data(self):
        """
        Fetch bug data from the Bugzilla API and write it to a CSV file.
        """
        try:
            with open(self.output_csv_file, mode="w", newline="", encoding="utf-8") as file:
                csv_writer = csv.writer(file)
                
                # Write the header row to the CSV file
                csv_writer.writerow(["Summary", "Priority"])

                while True:
                    # Set the offset for the current request
                    self.params["offset"] = self.offset
                    
                    # Make the API request
                    response = requests.get(self.search_url, params=self.params)

                    if response.status_code == 200:
                        bug_data = response.json()

                        # Iterate through the bugs in the response
                        for bug in bug_data["bugs"]:
                            bug_id = bug["id"]
                            
                            # Check if the bug ID is unique
                            if bug_id not in self.unique_bug_ids:
                                priority = bug["priority"]
                                
                                # Ignore bugs with no priority
                                if priority != "--":                                    
                                    csv_writer.writerow([bug["summary"], priority])
                                    self.unique_bug_ids.add(bug_id)  
                                    self.unique_priority.add(priority)  

                        self.total_bugs += len(bug_data["bugs"])  
                        print(f"Bug data for {self.offset}-{self.offset+self.limit} has been added to {self.output_csv_file}")

                        # Exit loop if fewer bugs are returned than the limit
                        if len(bug_data["bugs"]) < self.limit:
                            break

                        # Increment offset for the next request
                        self.offset += self.limit

                    else:
                        print(f"Error: {response.status_code}, {response.text}")
                        break

            print(f"Total bugs retrieved: {self.total_bugs}")
            print("Unique Priorities:", self.unique_priority)

        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    bugzilla_api_url = "https://bugzilla.mozilla.org"  # Base URL for the Bugzilla API
    output_csv_file = "bugzilla_data.csv"  

    # Create an instance of BugzillaDataFetcher and fetch data
    fetcher = BugzillaDataFetcher(bugzilla_api_url, output_csv_file)
    fetcher.fetch_data()
