import sys
import os

def predict_priority(bug_description):
    priority = "P2"  # just for testing
    try:
        # TODO: do your prediction here return the priority

        return priority
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict_priority.py <bug_description>")
        sys.exit(1)

    bug_description = sys.argv[1]
    priority = predict_priority(bug_description)
    print(priority)
