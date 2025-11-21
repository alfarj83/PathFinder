import json
import csv

# Load the JSON file
with open("../class/catalog.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Create the CSV file
with open("../class/catalog.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["course_code", "course_name", "course_desc"])  # header row

    for coursecode, info in data.items():
        name = info.get("name", "")
        desc = info.get("description", "")
        writer.writerow([coursecode, name, desc])
