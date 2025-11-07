import re
import json

def extract_class_info(json_text):
    # Regex patterns for the fields we care about
    file_content_string = ""
    
    with open("tempfile.txt", "r") as file:
        file_content_string = file.read()


    firstnameindex = file_content_string.find("firstName")
    print(firstnameindex)
    print(file_content_string[firstnameindex+12:file_content_string.find("\"", firstnameindex + 12)])

    
    lastnameindex = file_content_string.find("lastName", firstnameindex)
    print(lastnameindex)
    print(file_content_string[lastnameindex+11:file_content_string.find("\"", lastnameindex + 11)])

    
    depnameindex = file_content_string.find("department", lastnameindex)
    print(depnameindex)
    print(file_content_string[depnameindex+13:file_content_string.find("\"", depnameindex + 13)])



    numratingsindex = file_content_string.find("numRatings", depnameindex)
    print(numratingsindex)
    print(file_content_string[numratingsindex+12:file_content_string.find(",", numratingsindex + 12)])


    #avgRating


    #avgDifficulty



    curindex = numratingsindex
    ratingindex = file_content_string.find("helpfulRating", curindex)

    while(ratingindex > 20):

        print(ratingindex)
        print(file_content_string[ratingindex+15:file_content_string.find(",", ratingindex + 15)])

        
        diffindex = file_content_string.find("difficultyRating", ratingindex)
        print(diffindex)
        print(file_content_string[diffindex+18:file_content_string.find(",", diffindex + 18)])


        ratingindex = file_content_string.find("helpfulRating", diffindex)










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

'''
    with open("profrate.json", "w", encoding="utf-8") as f:
        json.dump(compacted, f, indent=2)

    print("Compacted data")

'''
