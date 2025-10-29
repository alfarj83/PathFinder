from bs4 import BeautifulSoup
import json
import pandas as pd
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv

# API KEYS AND ENGINE ID
# Load the variables from .env into the environment
load_dotenv()
API_KEY = os.getenv("API_KEY")
PSE_ID = os.getenv("PSE_ID")

# LIST OF ALL DEPARTMENTS
# This map links all variations (keys) to a single canonical name (value)
DEPT_MAP = {
    # School of Architecture
    "Architecture": "Architecture",
    
    # School of Engineering
    "Biomedical Engineering": "Biomedical Engineering",
    "Chemical and Biological Engineering": "Chemical and Biological Engineering",
    "Civil and Environmental Engineering": "Civil and Environmental Engineering",
    "Electrical, Computer, and Systems Engineering": "Electrical, Computer, and Systems Engineering",
    "Electrical, Computer and Systems Engineering": "Electrical, Computer, and Systems Engineering", # No comma
    "Industrial and Systems Engineering": "Industrial and Systems Engineering", 
    "Industrial & Systems Engineering":"Industrial and Systems Engineering",
    "Materials Science and Engineering": "Materials Science and Engineering",
    "Mechanical, Aerospace, and Nuclear Engineering": "Mechanical, Aerospace and Nuclear Engineering",
    
    # School of Humanities, Arts, and social Sciences (HASS)
    "Arts": "Arts", 
    "Cognitive Science": "Cognitive Science",
    "Cognitive Sciences": "Cognitive Science", # Plural
    "Communication and Media": "Communication and Media",
    "Economics": "Economics",
    "Games and Simulation Arts and Sciences": "Games and Simulation Arts and Sciences",
    "Science and Technology Studies": "Science and Technology Studies",
    
    # Lally School of Management
    "Management": "Management", 
    
    # School of Science
    "Biological Sciences": "Biological Sciences",
    "Chemistry and Chemical Biology": "Chemistry and Chemical Biology",
    "Computer Science": "Computer Science",
    "Computer Sciences": "Computer Science", # Plural
    "Earth and Environmental Sciences": "Earth and Environmental Sciences",
    "Mathematical Science": "Mathematical Sciences", # Canonical set to plural
    "Mathematical Sciences": "Mathematical Sciences", # Plural
    "Mathematics": "Mathematics",
    "Physics, Applied Physics, and Astronomy": "Physics, Applied Physics, and Astronomy",
    
    # Interdisciplinary Program
    "Information Technology and Web Science": "Information Technology and Web Science",
    "Information Technology and Web Systems": "Information Technology and Web Science", # Variation
}

# --- 1. Load your HTML file ---
# Assumes your HTML file is named 'catalog.html'
def get_departments():
    try:
        with open('catalog.html', 'r', encoding='utf-16') as f:
            html_content = f.read()
            #print(html_content)
    except FileNotFoundError:
        print("Error: catalog.html not found.")
        print("Please save your HTML file as 'catalog.html' in the same directory.")
        exit()

    # --- 2. Parse the HTML ---
    # Create the BeautifulSoup "soup" object
    soup = BeautifulSoup(html_content, 'html.parser')

    # This list will hold all our data
    all_professors = []

    # Find all the main "container" divs for each professor
    prof_containers = soup.find_all('p')
    #print(prof_containers)

    if not prof_containers:
        print("No professors found. Did you use the correct class for the container?")
        print("Please check your HTML file and update 'class_' in the script.")
    else:
        # --- 3. Loop and Extract Data ---
        for container in prof_containers:
            # name_tag is the strong tag within the p tag
            name_tag = container.find('strong')

            if name_tag:
                # gets name text
                name = name_tag.get_text().replace("\u2019", "'").strip().strip(" *+•►♦")
        
                # gets text immediately after strong tag
                # Get the *entire* text of the <p> tag
                full_p_text = container.get_text().replace("\u2019", "'")
                
                # Get the text of just the <strong> tag (the raw name)
                raw_name_text = name_tag.get_text().replace("\u2019", "'")

                # Subtract the raw name from the full text to get the rest of the info.
                # We also strip common leading punctuation.
                info_string = full_p_text.replace(raw_name_text, "").strip().strip(" ,;•►♦")

                if info_string:
                    if name == 'Koffas, Mattheos':
                        print('heres the name:', name)
                        print(full_p_text)
                        print(info_string)

                    # Loop through every official department
                    found_dept = 'unknown'
                    max_len = 0
                    for dept in DEPT_MAP.keys():
                    # Check if that department name is in the string
                        if dept.lower() in info_string.lower():
                            #print(dept)
                            # If it is, check if it's the longest one we've found so far
                            if len(dept) > max_len:
                                max_len = len(dept)
                                found_dept = DEPT_MAP[dept]
                    
                    # load items into dictionary item
                    prof_data = {
                        'Name': name,
                        'Department': found_dept
                    }
                    # put all prof_data dictionary items into list
                    all_professors.append(prof_data)

        return all_professors

def search_query(service, name, query):
    try:
        response = service.cse().list(
            q=query,
            cx=PSE_ID,
            num=1
        ).execute()

        # Check if the 'items' key exists and has at least one result
        if 'items' in response and len(response['items']) > 0:
            link = response['items'][0]['link']
            print(f"  > Found: {link}")
            return link
        else:
            print(f"  > No result found for {name}")
            return None
    
    except Exception as e:
        print('ERROR ERROR')
        print(e)
        return e

# --- MAIN ---
prof_dept_list = get_departments()
with open('professor_data/departments.json', 'w', encoding='utf-8') as f:
    json.dump(prof_dept_list, f, indent=4, ensure_ascii=False)

# build query service for linkedin profile scraping using api
try:
    service = build("customsearch", "v1", developerKey=API_KEY)

    urls = []
    name_list = pd.DataFrame(prof_dept_list)['Name']
    # testing
    name = name_list[2]
    print(name)
    linkedin_query = f"{name} rpi Linkedin"
    #linkedin_url = search_query(service, name, linkedin_query) # WORKS

    rpi_page_query = f"{name} rpi page"
    #rpi_page_url = search_query(service, name, rpi_page_query) # WORKS
    #urls.append(url)

except Exception as e:
    print("LINKEDIN SCRAPING FAILED")
    print(e)