from bs4 import BeautifulSoup
import json
import pandas as pd
from googleapiclient.discovery import build

# --- API AND SEARCH ENGINE ID KEYS ---
API_KEY = "AIzaSyCj2xlSiwJlu666wP4eV3xXPs4cyaG1joU"
PSE_ID = "228b878098be746ff"
# -----------------------------

# LIST OF ALL DEPARTMENTS
ALL_DEPTS = [
    # School of Architecture
    "Architecture",
    
    # School of Engineering
    "Biomedical Engineering",
    "Chemical and Biological Engineering",
    "Civil and Environmental Engineering",
    "Electrical, Computer, and Systems Engineering",
    "Industrial and Systems Engineering",
    "Materials Science and Engineering",
    "Mechanical, Aerospace, and Nuclear Engineering",
    
    # School of Humanities, Arts, and Social Sciences (HASS)
    "Arts",
    "Cognitive Science",
    "Communication and Media",
    "Economics",
    "Games and Simulation Arts and Sciences",
    "Science and Technology Studies",
    
    # Lally School of Management
    "Management", 
    
    # School of Science
    "Biological Sciences",
    "Chemistry and Chemical Biology",
    "Computer Science",
    "Earth and Environmental Sciences",
    "Mathematical Sciences",
    "Physics, Applied Physics, and Astronomy",
    
    # Interdisciplinary Program
    "Information Technology and Web Science",
]

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
            #print(name_tag)

            if name_tag:
                # gets name text
                name = name_tag.get_text().replace("\u2019", "'").strip().strip(" *+•►♦")
                # gets text immediately after strong tag
                sibling_tag = name_tag.next_sibling

                if sibling_tag:
                    info_string = str(sibling_tag).strip()
                    #print('heres the name:', name)

                    # Loop through every official department
                    found_dept = 'unknown'
                    max_len = 0
                    for dept in ALL_DEPTS:
                    # Check if that department name is in the string
                        if dept in info_string:
                            # If it is, check if it's the longest one we've found so far
                            if len(dept) > max_len:
                                max_len = len(dept)
                                found_dept = dept
                    
                    # load items into dictionary item
                    prof_data = {
                        'Name': name,
                        'Department': found_dept
                    }
                    # put all prof_data dictionary items into list
                    all_professors.append(prof_data)

        return all_professors

def find_linkedin_url(service, name):
    # setup query
    query = f"{name} rpi Linkedin"

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
    name = name_list[0]
    url = find_linkedin_url(service, name)
    print(url) # WORKS
    #urls.append(url)

except Exception as e:
    print("LINKEDIN SCRAPING FAILED")
    print(e)