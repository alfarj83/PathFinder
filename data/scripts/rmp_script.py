import re
import json
import sys

def extract_class_info(json_text, what_print):

    '''
    # Regex patterns for the fields we care about
    file_content_string = ""
    
    with open("../tempfile.txt", "r") as file:
        file_content_string = file.read()


    #get legacy id for url
    legacyidindex = file_content_string.find("legacyId")
    print(legacyidindex)
    legacy_id = (file_content_string[legacyidindex+10:file_content_string.find(",", legacyidindex + 10)])
    rmpurl = "https://www.ratemyprofessors.com/professor/" + legacy_id

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
    avgratingsindex = file_content_string.find("avgRating", numratingsindex)
    print(avgratingsindex)
    avg_ratings = float(file_content_string[avgratingsindex+11:file_content_string.find(",", avgratingsindex + 11)])


    #avgDifficulty
    avgdiffindex = file_content_string.find("avgDifficulty", avgratingsindex)
    print(avgdiffindex)
    avg_diff = float(file_content_string[avgdiffindex+15:file_content_string.find(",", avgdiffindex + 15)])


    '''


    file_content_string = ""
    
    with open("../ratings.txt", "r") as file:
        file_content_string = file.read()


    class_name_index = file_content_string.find("RatingHeader__StyledClass")
    
    # RatingHeader__StyledClass
    # >
    # >
    # CardNumRating__CardNumRatingNumber
    # > 
    count_num_reviews = 0
    class_reviews = {}

    while(class_name_index > 5):
        print()
        count_num_reviews = count_num_reviews + 1
        print(count_num_reviews)

        #find class name
        class_name_index = file_content_string.find(">", class_name_index) 
        old_index_here = class_name_index
        if(count_num_reviews < 6): class_name_index = file_content_string.find(">", class_name_index + 1)
        if(file_content_string[class_name_index-1:class_name_index+5] == "v></di"):
            class_name_index = old_index_here
        print(str(class_name_index) + file_content_string[class_name_index-1:class_name_index+5])
        if(file_content_string[class_name_index:class_name_index+5] == "><img"):
            class_name_index = file_content_string.find("currentitem", class_name_index + 1)
            class_name_index = file_content_string.find(">", class_name_index + 1)
        class_name = (file_content_string[class_name_index+1:file_content_string.find("<", class_name_index+1)]).strip()
        print(class_name + " here===")
        if(len(class_name) == 8):
            class_name = class_name[:4] + "-" + class_name[4:]
        

        ratingindex = file_content_string.find("CardNumRating__CardNumRatingNumber", class_name_index)
        
        ratingindex = file_content_string.find(">", ratingindex)
        print(ratingindex)
        if(count_num_reviews == 78):
            print(file_content_string[ratingindex-10:ratingindex+20])
        user_rating = float(file_content_string[ratingindex+1:file_content_string.find("<", ratingindex)])
        print(user_rating)



        diffindex = file_content_string.find("CardNumRating__CardNumRatingNumber", ratingindex)
        diffindex = file_content_string.find(">", diffindex)
        print(diffindex)
        user_diff = float(file_content_string[diffindex+1:file_content_string.find("<", diffindex)])
        print(user_diff)
        
        

        if class_name not in class_reviews:
            class_reviews[class_name] = []
        class_reviews[class_name].append([user_rating, user_diff])
        


        class_name_index = file_content_string.find("RatingHeader__StyledClass", diffindex)
        class_name_index = file_content_string.find("RatingHeader__StyledClass", class_name_index+5)


    
    #help me fix this part
    professor_name = "profn"
    #first_name + " " + last_name
    result = {
        professor_name: {
            "temp": "temp"

            
        }
    }

    '''
    "rmpurl": rmpurl,
    "department": department,
    "overall": avg_ratings,
    "diff": avg_diff
    '''

    # Add each class and its reviews
    for cname, ratings in class_reviews.items():
        if(what_print == "old"):
            result[professor_name][cname] = ratings
        else:

            tot_over = 0
            tot_diff = 0
            for single_rating in ratings:
                tot_over = tot_over + single_rating[0]
                tot_diff = tot_diff + single_rating[1]
            #print(tot_over/len(ratings))
            #print(tot_diff/len(ratings))
            if(what_print == "fin"):
                result[professor_name][cname] = [round(tot_over/len(ratings), 1), round(tot_diff/len(ratings), 1), len(ratings)]
            else:
                result[professor_name][cname] = [tot_over, tot_diff, len(ratings)]

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
    
    filetype = "new"
    if len(sys.argv) > 1:
        filetype = sys.argv[1]
    # put in the big string of it here
    compacted = extract_class_info("", filetype)


    with open("../prof_rate.json", "w", encoding="utf-8") as f:
        json.dump(compacted, f, indent=2)

    print("Compacted data")


