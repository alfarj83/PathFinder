import json

def compact_rmp_data(raw_json):
    # Parse the JSON if it's a string
    if isinstance(raw_json, str):
        data = json.loads(raw_json)
    else:
        data = raw_json

    # The main teacher entry (RateMyProfessors encodes it weirdly)
    for key, val in data.items():
        if key.startswith("VGVhY2hlci"):
            teacher = val
            break

    # Extract key info
    first_name = teacher.get("firstName", "")
    last_name = teacher.get("lastName", "")
    full_name = f"{first_name} {last_name}".strip()
    legacy_id = teacher.get("legacyId")
    overall = teacher.get("avgRating")
    diff = teacher.get("avgDifficulty")
    numreviews = teacher.get("numRatings")

    # Construct RateMyProfessors URL
    rmp_url = f"https://www.ratemyprofessors.com/professor/{legacy_id}"

    # Now get the ratings list
    ratings_conn_ref = teacher.get("__RatingsList_ratings_connection", {}).get("__ref")
    ratings_ref = []

    if ratings_conn_ref and ratings_conn_ref in raw_json:
        ratings_ref = (
            raw_json[ratings_conn_ref]
            .get("edges", {})
            .get("__refs", [])
        )


    course_dict = {}

    # Traverse all ratings
    for ref in ratings_ref:
        rating = data[ref]["node"]
        rating_obj = data[rating["__ref"]]

        course = rating_obj.get("class")
        helpful = rating_obj.get("helpfulRating")
        difficulty = rating_obj.get("difficultyRating")

        if not course or helpful is None or difficulty is None:
            continue

        # Clean course code like "COMM4962" -> "COMM-4962"
        course = course.strip().upper().replace(" ", "")
        if not "-" in course:
            course = course[:4] + "-" + course[4:]

        # Add to course dict
        course_dict.setdefault(course, []).append([helpful, difficulty])

    # Build compact entry
    compact_entry = {
        "rmpurl": rmp_url,
        "overall": overall,
        "diff": diff,
        "numreviews": numreviews,
        **course_dict
    }

    # Final compacted dict
    return {full_name: compact_entry}


# Example usage
if __name__ == "__main__":
    with open("tempfile.json", "r", encoding="utf-8") as f:
        raw_json = f.read()

    compacted = compact_rmp_data(raw_json)

    with open("compacted_maurice.json", "w", encoding="utf-8") as f:
        json.dump(compacted, f, indent=2)

    print("Compacted data saved to compacted_maurice.json")