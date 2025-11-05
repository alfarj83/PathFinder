import json
import csv

# --- Configuration for courses ---
input_json_file = 'professor_courses.json'  # Change this to your JSON file's name
output_csv_file = 'professor_courses.csv' # The name of the file to create
# ---------------------

try:
    # 1. Read the JSON data from the input file
    with open(input_json_file, 'r') as f:
        professor_data = json.load(f)

    # 2. Process the data to prepare for the CSV
    output_rows = []
    
    # Add a header row for the CSV
    output_rows.append(['Professor', 'Courses']) 

    # Loop through each professor (the top-level keys in the JSON)
    for professor_name, semesters in professor_data.items():
        
        # Use a set() to automatically store only unique course codes
        unique_courses = set()
        
        # Loop through all the semester records for that professor
        for semester, course_list in semesters.items():
            # The update() method adds all items from the list to the set
            unique_courses.update(course_list) 
        
        # Convert the set of unique courses into a single, comma-separated string
        # We sort them so the output is consistent and clean (e.g., "ADMN-1010, WRIT-4120")
        courses_string = ", ".join(sorted(list(unique_courses)))
        
        # Add the professor's name and their formatted course string as a new row
        output_rows.append([professor_name, courses_string])

    # 3. Write the processed data to a CSV file
    with open(output_csv_file, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        # writerows() writes all the rows at once
        writer.writerows(output_rows)

    print(f"✅ Successfully created '{output_csv_file}'!")

except FileNotFoundError:
    print(f"Error: The file '{input_json_file}' was not found.")
    print("Please make sure the file is in the same directory as the script, or provide the full path.")
except json.JSONDecodeError:
    print(f"Error: Could not decode JSON from '{input_json_file}'. Please check the file's format.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

# -- Configuration for departments -- #
input_json = 'departments.json'  # Change this to your JSON file's name
output_csv = 'departments.csv' # The name of the file to create

# 1. Read the JSON data from the input file
with open(input_json, 'r', encoding='utf-8') as f:
    department_data = json.load(f)

try:
    # 1. Read the JSON data
    with open(input_json, 'r', encoding='utf-8') as f:
        # We assume the file contains a list [...] of objects {...}
        data_list = json.load(f)

    # Check if the list is empty or not a list
    if not isinstance(data_list, list) or not data_list:
        print("Error: JSON file does not contain a list or is empty.")
    else:
        # 2. Get the headers from the keys of the *first* object
        # This assumes all objects have the same keys
        headers = data_list[0].keys()

        # 3. Write the data to a CSV file
        with open(output_csv, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=headers)
            
            # Write the header row (e.g., "Name", "Department")
            writer.writeheader()
            
            # Write all the data rows
            writer.writerows(data_list)
        
        print(f"Successfully created '{output_csv_file}'")

except FileNotFoundError:
    print(f"Error: The file '{input_json_file}' was not found.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")