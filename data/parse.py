
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


yearstotest = {
    '2024'
}

monthstotest = {'01', '05', '09'}



starting = {
  '1': 8,   # Spring
  '5': 20,  # Summer
  '8': 28,  # Fall
  '12': 21  # Winter
}




def compact_courses(input_file, output_file):
    with open(input_file, "r") as f:
        data = json.load(f)

    compact = []

    for subject in data:
        for course in subject.get("courses", []):
            course_id = course["id"]
            course_title = course["title"]

            total_act = 0
            total_cap = 0
            instructors = set()

            for section in course.get("sections", []):
                total_act += section.get("act", 0)
                total_cap += section.get("cap", 0)

                for ts in section.get("timeslots", []):
                    instr_field = ts.get("instructor", "")
                    if instr_field:
                        # Split multiple instructors (comma-separated)
                        for name in instr_field.split(","):
                            instructors.add(name.strip())

            compact.append({
                "id": course_id,
                "title": course_title,
                "act": total_act,
                "cap": total_cap,
                "instructors": sorted(list(instructors))
            })

    # Write out compact JSON
    with open(output_file, "w") as f:
        json.dump(compact, f, indent=2)

    print(f"Compact data saved to {output_file}")


# Example usage:
# compact_courses("courses.json", "compact_classes.json")






td = date.today(); day, month, year = td.day, td.month, td.year

# check that we have access to the info
data = get(URL).json()
if "message" in data:
  if "API rate limit exceeded" in data['message']:
    print("API rate limit exceeded!")


curSem = data[-1]['url']

counting = 0
for sem in reversed(data[-4:]):
  curSem = sem['url']
  print(curSem)
  
  content = get(curSem).json()
  courses = get(content[1]['download_url']).json()

  with open("tempfile.json", 'w') as f: json.dump(courses, f, indent=4)
  compact_courses("tempfile.json", "compact_classes" + str(curSem[-17:-11]) + ".json")

  counting = counting + 1
  if counting > 5:
    break



'''
content = get(curSem).json()
courses = get(content[1]['download_url']).json()

with open("tempfile.json", 'w') as f: json.dump(courses, f, indent=4)
compact_courses("tempfile.json", "compact_classes" + str(year) + str(month) + ".json")
'''