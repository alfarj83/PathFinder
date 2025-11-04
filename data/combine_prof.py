import json
import glob
import os
from collections import defaultdict

def build_professor_index(input_dir, output_file):
    # This will hold instructor -> { semester: [course_ids] }
    instructor_map = defaultdict(lambda: defaultdict(list))

    # Loop through all compact_classes*.json files
    for filepath in glob.glob(os.path.join(input_dir, "compact_classes*.json")):
        filename = os.path.basename(filepath)

        # Extract term code like "202501" from filename
        term = filename.replace("compact_classes", "").replace(".json", "")

        # Load JSON file
        with open(filepath, "r") as f:
            courses = json.load(f)

        # Go through each course
        for course in courses:
            course_id = course.get("id")
            instructors = course.get("instructors", [])

            for instr in instructors:
                instructor_map[instr][term].append(course_id)

    # Sort each instructor's term keys chronologically
    sorted_data = {
        instr: dict(sorted(terms.items())) for instr, terms in instructor_map.items()
    }

    # Write combined JSON
    with open(output_file, "w") as f:
        json.dump(sorted_data, f, indent=2)

    print(f"Professor-course mapping saved to {output_file}")


# Example usage:
build_professor_index("class", "professor_courses.json")
