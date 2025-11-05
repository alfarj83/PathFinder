import re
import json

def extract_class_info(json_text):
    # Regex patterns for the fields we care about
    file_content_string = ""
    
    with open("tempfile.txt", "r") as file:
        file_content_string = file.read()


    firstnameindex = file_content_string.find("firstName")
    #print(firstnameindex)
    first_name = (file_content_string[firstnameindex+12:file_content_string.find("\"", firstnameindex + 12)])

    
    lastnameindex = file_content_string.find("lastName", firstnameindex)
    #print(lastnameindex)
    last_name = (file_content_string[lastnameindex+11:file_content_string.find("\"", lastnameindex + 11)])

    
    depnameindex = file_content_string.find("department", lastnameindex)
    #print(depnameindex)
    department = (file_content_string[depnameindex+13:file_content_string.find("\"", depnameindex + 13)])



    numratingsindex = file_content_string.find("numRatings", depnameindex)
    print(numratingsindex)
    num_ratings = int(file_content_string[numratingsindex+12:file_content_string.find(",", numratingsindex + 12)])


    #avgRating


    #avgDifficulty



    curindex = numratingsindex
    class_index = file_content_string.find("\"class\":", curindex)
    
    class_reviews = {}

    while(class_index > 20):

        #find class name
        print(class_index)
        class_name = (file_content_string[class_index+9:file_content_string.find("\"", class_index + 9)])
        
        ratingindex = file_content_string.find("helpfulRating", class_index)
        print(ratingindex)
        user_rating = int(file_content_string[ratingindex+15:file_content_string.find(",", ratingindex + 15)])

        
        diffindex = file_content_string.find("difficultyRating", ratingindex)
        print(diffindex)
        user_diff = int(file_content_string[diffindex+18:file_content_string.find(",", diffindex + 18)])


        if class_name not in class_reviews:
            class_reviews[class_name] = []
        class_reviews[class_name].append([user_rating, user_diff])
        


        class_index = file_content_string.find("\"class\":", diffindex)


    #help me fix this part
    professor_name = first_name + " " + last_name
    result = {
        professor_name: {
            "rmpurl": "",
            "overall": "number",
            "diff": "number"
        }
    }

    # Add each class and its reviews
    for cname, ratings in class_reviews.items():
        result[professor_name][cname] = ratings

    return result







'''
    classes = []

    class_names = class_pattern.findall(json_text)
    ratings = rating_pattern.findall(json_text)
    difficulties = difficulty_pattern.findall(json_text)

    # Align them together (some may have fewer entries than others)
    for i in range(min(len(class_names), len(ratings), len(difficulties))):
        classes.append({
            "class": class_names[i],
            "rating": ratings[i],
            "difficulty": difficulties[i]
        })

    return classes
'''




if __name__ == "__main__":
    
    # put in the big string of it here
    compacted = extract_class_info("")


    with open("prof_rate.json", "w", encoding="utf-8") as f:
        json.dump(compacted, f, indent=2)

    print("Compacted data")


