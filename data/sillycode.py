import re
import json

def extract_class_info(json_text):
    # Regex patterns for the fields we care about
    file_content_string = ""
    
    with open("ratings.txt", "r") as file:
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
        if(count_num_reviews < 6): class_name_index = file_content_string.find(">", class_name_index + 1)
        print(str(class_name_index) + file_content_string[class_name_index-1:class_name_index+5])
        if(file_content_string[class_name_index:class_name_index+5] == "><img"):
            class_name_index = file_content_string.find("currentitem", class_name_index + 1)
            class_name_index = file_content_string.find(">", class_name_index + 1)
        class_name = (file_content_string[class_name_index+1:file_content_string.find("<", class_name_index+1)])
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

    for cname, ratings in class_reviews.items():
        print(cname)
        print(ratings)
        tot_over = 0
        tot_diff = 0
        
        for single_rating in ratings:
            tot_over = tot_over + single_rating[0]
            tot_diff = tot_diff + single_rating[1]
        print(tot_over/len(ratings))
        print(tot_diff/len(ratings))

'''
    #help me fix this part
    professor_name = first_name + " " + last_name
    result = {
        professor_name: {
            "rmpurl": rmpurl,
            "department": department,
            "overall": avg_ratings,
            "diff": avg_diff
        }
    }

    # Add each class and its reviews
    for cname, ratings in class_reviews.items():
        result[professor_name][cname] = ratings

    return result

'''





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
    with open("prof_rate.json", "w", encoding="utf-8") as f:
        json.dump(compacted, f, indent=2)

    print("Compacted data")
'''
    


