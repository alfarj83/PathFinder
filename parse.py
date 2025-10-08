
from collections import defaultdict
from math import inf as inf
from datetime import date
from requests import get
import json
import sys
import os


#link to quacs data
URL = "https://api.github.com/repos/quacs/quacs-data/contents/semester_data"

# Get the most recent courses.json from QuACS:
# make a loop to get all of the old data later


# right now just get the current classes


# check that we have access to the info
data = get(URL).json()
if "message" in data:
  if "API rate limit exceeded" in data['message']:
    sys.exit("API rate limit exceeded!")



# Find the current semster's info, change this
# Pick current sem from what's already been recorded this year
for sem in reversed(data[-4:]):
  if int(sem['name'][:4]) == year: # Same year
      if str(month) in starting and starting[str(month)] <= day: # Starts this month
        curSem = sem['url']
        break
      elif int(sem['name'][-2:]) < month: # Started month(s) ago
        curSem = sem['url']
        break

print(curSem)




def compact_courses(input_file, output_file):
    with open(input_file, "r") as f:
        data = json.load(f)

    compact = []

    for subject in data:
        for course in subject.get("courses", []):
            course_id = course["id"]
            course_title = course["title"]
            instructors = course["instructor"]

            total_act = 0
            total_cap = 0

            for section in course.get("sections", []):
                total_act += section.get("act", 0)
                total_cap += section.get("cap", 0)

            compact.append({
                "id": course_id,
                "title": course_title,
                "act": total_act,
                "cap": total_cap,
                "instructors": instructors
            })

    # Write out compact JSON
    with open(output_file, "w") as f:
        json.dump(compact, f, indent=2)

    print(f"Compact data saved to {output_file}")


# Example usage:
# compact_courses("classes.json", "compact_classes.json")
