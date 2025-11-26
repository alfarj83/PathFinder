import json
import csv
import sys



def rmp_csv(par_arr):

    # --- Configuration for courses ---
    input_json_file = '../temps/prof_rate.json'  # Change this to your JSON file's name
    output_csv_file = '../temps/tempcsv.csv' # The name of the file to create
    # ---------------------



    try:
        # 1. Read the JSON data from the input file
        with open(input_json_file, 'r') as f:
            professor_data = json.load(f)

        # 2. Process the data to prepare for the CSV
        output_rows = []
        
        # Add a header row for the CSV
        output_rows.append(['prof_name', 'class_code', 'num_ratings', 'rating', 'diff']) 

        # Loop through each professor (the top-level keys in the JSON)
        for professor_name, infos in professor_data.items():
            
            # goes through our list of combines
            # adds the seocnd part to the first part and removes the second part
            for combine in par_arr:
                print(infos[combine[1]])
                added_rat = infos[combine[0]][0] + infos[combine[1]][0]
                added_dif = infos[combine[0]][1] + infos[combine[1]][1]
                added_num = infos[combine[0]][2] + infos[combine[1]][2]
                added_arr = [added_rat, added_dif, added_num]
                print(added_arr)
                infos[combine[0]] = added_arr
                infos.pop(combine[1])


            print()

            for info in infos:

                if(info == "rmpurl" or info == "department" or info == "overall" or info == "diff" or info == "temp"):
                    continue
                

                print(info)
                print(infos[info])
                ratingval = round(infos[info][0] / infos[info][2], 1)
                diffval = round(infos[info][1] / infos[info][2], 1)
                infos[info] = [ratingval, diffval, infos[info][2]]
                print(infos[info])
                print()

                output_rows.append([professor_name, info, infos[info][2], infos[info][0], infos[info][1]])
            


        
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







if __name__ == "__main__":
    

    par_arr = []
    
    for i in range(1, len(sys.argv), 2):
        print(i)
        par_arr.append([sys.argv[i], sys.argv[i+1]])
    
    print("paramters:")
    print(par_arr)
    # put in the big string of it here
    rmp_csv(par_arr)


    print("CSV created")


    names_file = "../temps/full_names.txt"
    with open(names_file, "r", encoding="utf-8") as f:
        lines = f.readlines()
    # Write back everything except the first line
    with open(names_file, "w", encoding="utf-8") as f:
        f.writelines(lines[1:])

